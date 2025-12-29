import { NextRequest, NextResponse } from 'next/server';
import { EpubParser } from '@/lib/epub';
import { KokoroClient } from '@/lib/kokoro';
import { AudioProcessor } from '@/lib/audio';
import path from 'path';
import fs from 'fs';
import os from 'os';
import pLimit from 'p-limit';

// --- Helper Functions ---

const ensureDir = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

/**
 * Parses the input (File or Text) into a standard list of chapters.
 */
async function parseInput(file: File | null, textInput: string | null): Promise<{ chapters: { title: string; text: string }[]; filename: string }> {
    let chapters: { title: string; text: string }[] = [];
    let filename = '';

    if (file) {
        // 1. Save uploaded file temporarily
        const buffer = Buffer.from(await file.arrayBuffer());
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kokoro-upload-'));
        const tempFilePath = path.join(tempDir, file.name);
        fs.writeFileSync(tempFilePath, buffer);

        // 2. Parse EPUB (or Text)
        if (file.name.endsWith('.epub')) {
            const parsedChapters = await EpubParser.parse(tempFilePath);
            chapters = parsedChapters.map(c => ({ title: c.title, text: c.text }));
        } else {
            // Assume text file
            const text = fs.readFileSync(tempFilePath, 'utf-8');
            chapters = [{ title: 'Full Text', text }];
        }
        filename = path.parse(file.name).name;

        // Cleanup temp upload immediately after parsing
        fs.rmSync(tempDir, { recursive: true, force: true });
    } else if (textInput) {
        // Handle direct text input
        chapters = [{ title: 'Text Input', text: textInput }];
        filename = `text-input-${Date.now()}`;
    }

    return { chapters, filename };
}

/**
 * Generates audio for a text chunk and saves it to disk.
 */
async function generateAndSaveChunk(
    text: string,
    kokoro: KokoroClient,
    voice: string,
    speed: number,
    signal: AbortSignal,
    bookDir: string,
    chapterTitle: string,
    chapterIndex: number,
    chunkIndex: number
): Promise<string> {
    if (signal.aborted) throw new Error('Generation aborted');

    // Generate audio
    const audio = await kokoro.generateAudio(text, voice, speed, signal);

    // Construct filename
    const chapterTitleSafe = chapterTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
    const chunkFilename = `${String(chapterIndex).padStart(3, '0')}_${chapterTitleSafe}_part${chunkIndex}.mp3`;
    const chunkPath = path.join(bookDir, chunkFilename);

    // Save to disk
    fs.writeFileSync(chunkPath, audio);
    return chunkPath;
}

/**
 * Processes chapters: chunks text, generates audio in parallel, and saves intermediary files.
 */
async function processChapters(
    chapters: { title: string; text: string }[],
    bookDir: string,
    kokoro: KokoroClient,
    voice: string,
    speed: number,
    signal: AbortSignal,
    sendEvent: (data: any) => void
): Promise<string[]> {
    // 1. Pre-calculate all chunks
    interface ChunkTask {
        text: string;
        chapterTitle: string;
        chapterIndex: number;
        chunkIndex: number;
    }

    let allChunks: ChunkTask[] = [];
    const totalCharacters = chapters.reduce((acc, chapter) => acc + chapter.text.length, 0);

    // Chunking Logic
    let globalChapterIndex = 0;
    for (const chapter of chapters) {
        if (!chapter.text.trim()) {
            globalChapterIndex++;
            continue;
        }

        const paragraphs = chapter.text.split(/\n+/);
        let currentChunk = '';
        let chunkIndex = 0;

        for (const p of paragraphs) {
            if ((currentChunk + p).length > 2000) {
                if (currentChunk.trim()) {
                    allChunks.push({
                        text: currentChunk,
                        chapterTitle: chapter.title,
                        chapterIndex: globalChapterIndex,
                        chunkIndex: chunkIndex
                    });
                    chunkIndex++;
                }
                currentChunk = p + ' ';
            } else {
                currentChunk += p + ' ';
            }
        }

        if (currentChunk.trim()) {
            allChunks.push({
                text: currentChunk,
                chapterTitle: chapter.title,
                chapterIndex: globalChapterIndex,
                chunkIndex: chunkIndex
            });
        }
        globalChapterIndex++;
    }

    // 2. Process chunks in parallel
    // Limit concurrency to 4 to avoid overwhelming the TTS server or memory
    const limit = pLimit(4);
    const audioFilePaths: string[] = new Array(allChunks.length);
    let completedChunks = 0;
    let processedCharacters = 0;

    const tasks = allChunks.map((task, index) => {
        return limit(async () => {
            if (signal.aborted) return;

            const filePath = await generateAndSaveChunk(
                task.text,
                kokoro,
                voice,
                speed,
                signal,
                bookDir,
                task.chapterTitle,
                task.chapterIndex,
                task.chunkIndex
            );

            // Store result at correct index to maintain order
            audioFilePaths[index] = filePath;

            completedChunks++;
            processedCharacters += task.text.length;

            // Emit progress
            const progress = Math.round((completedChunks / allChunks.length) * 100);
            sendEvent({
                type: 'progress',
                chapterIndex: task.chapterIndex + 1, // Display 1-based index
                totalChapters: chapters.length,
                chapterTitle: task.chapterTitle,
                progress: progress,
                processedCharacters: processedCharacters,
                totalCharacters: totalCharacters
            });
        });
    });

    await Promise.all(tasks);

    if (signal.aborted) throw new Error('Generation aborted');

    return audioFilePaths;
}

// --- Main Handler ---

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const textInput = formData.get('text') as string | null;
    const voice = formData.get('voice') as string || 'af_heart';
    const speed = parseFloat(formData.get('speed') as string || '1.0');
    const outputFormat = (formData.get('format') as 'm4b' | 'mp3') || 'm4b';

    if (!file && !textInput) {
        return NextResponse.json({ error: 'No file or text provided' }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const sendEvent = (data: any) => {
                controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
            };

            try {
                // 1. Parse Input
                const { chapters, filename } = await parseInput(file, textInput);

                // 2. Setup Directories
                const safeFilename = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const outputDir = path.join(process.cwd(), 'public', 'downloads');
                const bookDir = path.join(outputDir, safeFilename);
                ensureDir(bookDir);

                // 3. Generate Audio (Parallel Chunks)
                const kokoro = new KokoroClient();
                const audioFilePaths = await processChapters(
                    chapters,
                    bookDir,
                    kokoro,
                    voice,
                    speed,
                    req.signal,
                    sendEvent
                );

                // 4. Merge Audio Files
                sendEvent({ type: 'status', message: 'Merging audio files...' });
                const outputPath = await AudioProcessor.mergeAudio(
                    audioFilePaths,
                    outputDir,
                    filename,
                    outputFormat,
                    { title: filename }
                );

                // 5. Return Result
                const downloadUrl = `/downloads/${path.basename(outputPath)}`;
                sendEvent({
                    type: 'result',
                    success: true,
                    downloadUrl,
                    stats: {
                        chapters: chapters.length,
                        duration: 'Unknown'
                    }
                });
                controller.close();

            } catch (error: any) {
                console.error('Generation error:', error);
                sendEvent({ type: 'error', error: error.message || 'Internal Server Error' });
                controller.close();
            }
        }
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'application/x-ndjson',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
