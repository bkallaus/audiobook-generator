PR Title: feat: Audio Chime Alert on Completion

The Problem Solved:
Provides an audible completion notification for long-running audiobook generation tasks, allowing users to step away from their tab without missing when their file is ready.

Visuals:
![Success screenshot](/home/jules/verification/screenshots/audio-chime-success.png)

Implementation Journey:
- Verified existing icons in `lucide-react`.
- Added a simple, zero-asset Web Audio API oscillator (`playChime`) to generate a pleasing notification sound.
- Added a `soundEnabled` state and a UI toggle button (Volume2 / VolumeX icons) next to the "Output Format" selection.
- Handled React stale closure bugs by backing `soundEnabled` with a `useRef` for the async SSE handler.
- Verified toggle functionality and API completion triggers using a headless Playwright script.

Tradeoffs & Assumptions:
- **Assumption:** The user requested a "net-new feature". Since none was explicitly specified, I autonomously selected a feature that adds high value to long-running asynchronous tasks (an audio chime).
- **Paths Brainstormed:**
  1) Standard: Load a static `ding.mp3` file.
  2) Minimalist: Base64 encode a small mp3 string.
  3) Lateral: Use `window.AudioContext` to synthesize the sound.
- **Decision:** Selected the Lateral approach. Synthesizing the sound with the Web Audio API requires zero external assets, avoids large base64 strings in the code, and keeps the component entirely self-contained.

Testing Instructions:
1. Start the Next.js dev server (`npm run dev`).
2. Navigate to `http://localhost:3000`.
3. Notice the "Sound On" toggle next to "Output Format".
4. Run a generation (or mock a short text input generation).
5. Wait for it to complete. An audible chime should play.
6. Toggle the button to "Muted" and repeat. No chime should play.

Action Item:
Submitted via autonomous submit tool.
