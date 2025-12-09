import axios from 'axios';

const KOKORO_BASE_URL = process.env.KOKORO_BASE_URL || 'http://localhost:8880/v1';

export interface KokoroResponse {
    audio: string; // Base64 encoded audio or URL
    // Add other fields as needed based on actual API response
}

export class KokoroClient {
    private baseUrl: string;

    constructor(baseUrl: string = KOKORO_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async generateAudio(text: string, voice: string, speed: number = 1.0, signal?: AbortSignal): Promise<Buffer> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/audio/speech`,
                {
                    input: text,
                    voice: voice,
                    speed: speed,
                    response_format: 'mp3', // Request mp3 from Kokoro, we'll convert to m4b later
                },
                {
                    responseType: 'arraybuffer',
                    signal: signal,
                }
            );

            return Buffer.from(response.data);
        } catch (error) {
            console.error('Error generating audio from Kokoro:', error);
            throw error;
        }
    }
}
