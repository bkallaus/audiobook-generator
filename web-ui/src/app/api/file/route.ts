import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(req: NextRequest) {
    try {
        const { fileUrl } = await req.json();

        if (!fileUrl || typeof fileUrl !== 'string' || !fileUrl.startsWith('/downloads/')) {
            return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 });
        }

        const filename = path.basename(fileUrl);
        if (!filename) {
            return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
        }

        const outputDir = path.join(process.cwd(), 'public', 'downloads');
        const filePath = path.join(outputDir, filename);

        // Calculate the chunks directory name: safeFilename
        const ext = path.extname(filename); // e.g., .m4b
        const baseName = path.basename(filename, ext); // e.g., my_book
        const safeFilename = baseName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const bookDir = path.join(outputDir, safeFilename);

        // Delete the final generated file
        try {
            await fs.promises.unlink(filePath);
        } catch (e: any) {
            if (e.code !== 'ENOENT') throw e;
        }

        // Delete the chunks directory if it exists
        try {
            await fs.promises.rm(bookDir, { recursive: true, force: true });
        } catch (e: any) {
            if (e.code !== 'ENOENT') throw e;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }
}
