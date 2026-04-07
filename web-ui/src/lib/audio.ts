import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import os from 'os';

export class AudioProcessor {
    static async mergeAudio(
        inputFiles: string[],
        outputDir: string,
        filename: string,
        format: 'm4b' | 'mp3',
        metadata: { title?: string; author?: string }
    ): Promise<string> {
        const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'audio-merge-'));
        // inputFiles are now passed directly


        const outputPath = path.join(outputDir, `${filename}.${format}`);
        const fileListPath = path.join(tempDir, 'files.txt');

        // Create ffmpeg concat list
        const fileContent = inputFiles.map(f => `file '${f}'`).join('\n');
        await fs.promises.writeFile(fileListPath, fileContent);

        return new Promise((resolve, reject) => {
            let command = ffmpeg()
                .input(fileListPath)
                .inputOptions(['-f', 'concat', '-safe', '0'])
                .output(outputPath);

            if (format === 'm4b') {
                command = command
                    .audioCodec('aac')
                    .audioBitrate('128k')
                    .outputOptions('-movflags', '+faststart');
            } else {
                // MP3
                // Since inputs are already MP3 (from Kokoro), we can copy the stream
                // This avoids re-encoding artifacts and is much faster
                command = command
                    .audioCodec('copy');
            }

            if (metadata.title) command = command.outputOptions('-metadata', `title=${metadata.title}`);
            if (metadata.author) command = command.outputOptions('-metadata', `artist=${metadata.author}`); // 'artist' is often used for author in audio files

            command
                .on('end', async () => {
                    // Cleanup temp files
                    try {
                        await fs.promises.rm(tempDir, { recursive: true, force: true });
                    } catch (e) {
                        console.error('Failed to clean up temp directory:', e);
                    }
                    resolve(outputPath);
                })
                .on('error', async (err) => {
                    // Cleanup temp files
                    try {
                        await fs.promises.rm(tempDir, { recursive: true, force: true });
                    } catch (e) {
                        console.error('Failed to clean up temp directory:', e);
                    }
                    reject(err);
                })
                .run();
        });
    }
}
