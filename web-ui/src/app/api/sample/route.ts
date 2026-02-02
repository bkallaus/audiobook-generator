import { NextRequest, NextResponse } from 'next/server';
import { KokoroClient } from '@/lib/kokoro';

const ALLOWED_VOICES = [
    'af_heart', 'af_sky', 'af_bella', 'af_nicole', 'af_sarah', 'am_adam', 'am_michael'
];

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const voice = searchParams.get('voice');

    if (!voice || !ALLOWED_VOICES.includes(voice)) {
        return NextResponse.json({ error: 'Invalid or missing voice parameter' }, { status: 400 });
    }

    try {
        const kokoro = new KokoroClient();
        // Short sample text
        const text = "Hello, this is a sample of my voice.";
        const audioBuffer = await kokoro.generateAudio(text, voice, 1.0);

        return new NextResponse(new Blob([new Uint8Array(audioBuffer)]), {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length.toString(),
            },
        });
    } catch (error: any) {
        console.error('Error generating sample:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
