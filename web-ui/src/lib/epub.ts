import EPub from 'epub2';

export interface Chapter {
    id: string;
    title: string;
    content: string; // HTML content
    text: string;    // Plain text content
}

export class EpubParser {
    static async parse(filePath: string): Promise<Chapter[]> {
        return new Promise((resolve, reject) => {
            const epub = new EPub(filePath);

            epub.on('end', async () => {
                try {
                    const chapters: Chapter[] = [];

                    // Iterate over flow to get chapters in order
                    for (const chapterId of epub.flow) {
                        if (!chapterId.id) continue;
                        const chapter = await new Promise<any>((res, rej) => {
                            epub.getChapter(chapterId.id!, (err, text) => {
                                if (err) rej(err);
                                else res({ ...chapterId, text });
                            });
                        });

                        // Basic HTML to Text stripping (can be improved)
                        const plainText = chapter.text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

                        if (plainText.length > 0) {
                            chapters.push({
                                id: chapter.id,
                                title: chapter.title || 'Untitled',
                                content: chapter.text,
                                text: plainText
                            });
                        }
                    }
                    resolve(chapters);
                } catch (error) {
                    reject(error);
                }
            });

            epub.on('error', (err) => {
                reject(err);
            });

            epub.parse();
        });
    }
}
