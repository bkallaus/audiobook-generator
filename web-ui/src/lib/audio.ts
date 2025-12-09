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
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'audio-merge-'));
        // inputFiles are now passed directly


        const outputPath = path.join(outputDir, `${filename}.${format}`);
        const fileListPath = path.join(tempDir, 'files.txt');

        // Create ffmpeg concat list
        const fileContent = inputFiles.map(f => `file '${f}'`).join('\n');
        fs.writeFileSync(fileListPath, fileContent);

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
                command = command
                    .audioCodec('libmp3lame')
                    .audioBitrate('192k');
            }

            if (metadata.title) command = command.outputOptions('-metadata', `title=${metadata.title}`);
            if (metadata.author) command = command.outputOptions('-metadata', `artist=${metadata.author}`); // 'artist' is often used for author in audio files

            command
                .on('end', () => {
                    // Cleanup temp files
                    fs.rmSync(tempDir, { recursive: true, force: true });
                    resolve(outputPath);
                })
                .on('error', (err) => {
                    // Cleanup temp files
                    fs.rmSync(tempDir, { recursive: true, force: true });
                    reject(err);
                })
                .run();
        });
    }
}
