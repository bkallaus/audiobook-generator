import { NextRequest, NextResponse } from 'next/server';
import { EpubParser } from '@/lib/epub';
import { KokoroClient } from '@/lib/kokoro';
import { AudioProcessor } from '@/lib/audio';
import path from 'path';
import fs from 'fs';
import os from 'os';

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
 * Processes chapters: chunks text, generates audio, and saves intermediary files.
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
    const audioFilePaths: string[] = [];
    let chapterIndex = 0;

    for (const chapter of chapters) {
        if (signal.aborted) throw new Error('Generation aborted');
        if (!chapter.text.trim()) continue;

        const paragraphs = chapter.text.split(/\n+/);
        let currentChunk = '';
        let chunkIndex = 0;
        let processedParagraphs = 0;

        for (const p of paragraphs) {
            if (signal.aborted) throw new Error('Generation aborted');

            // Chunking logic (approx 2000 chars)
            if ((currentChunk + p).length > 2000) {
                if (currentChunk.trim()) {
                    const chunkPath = await generateAndSaveChunk(
                        currentChunk, kokoro, voice, speed, signal, bookDir, chapter.title, chapterIndex, chunkIndex
                    );
                    audioFilePaths.push(chunkPath);
                    chunkIndex++;
                }
                currentChunk = p + ' ';
            } else {
                currentChunk += p + ' ';
            }
            processedParagraphs++;

            // Emit progress
            const progress = Math.round((processedParagraphs / paragraphs.length) * 100);
            sendEvent({
                type: 'progress',
                chapterIndex: chapterIndex + 1,
                totalChapters: chapters.length,
                chapterTitle: chapter.title,
                progress: progress
            });
        }

        // Save remaining chunk
        if (currentChunk.trim()) {
            const chunkPath = await generateAndSaveChunk(
                currentChunk, kokoro, voice, speed, signal, bookDir, chapter.title, chapterIndex, chunkIndex
            );
            audioFilePaths.push(chunkPath);
            chunkIndex++;
        }
        chapterIndex++;
    }

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

                // 3. Generate Audio (Chapter by Chapter)
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
