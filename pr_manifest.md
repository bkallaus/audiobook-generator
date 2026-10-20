PR Title: feat: Native TTS Proofread Mode

The Problem Solved: Generating audiobooks from large text blocks can be time-consuming. Users need a quick, low-latency way to catch typos or listen to their drafted text before committing to the full Kokoro backend generation process. This feature adds a "Proofread (Browser TTS)" button that leverages the native Web Speech API (`window.speechSynthesis`) to provide immediate auditory feedback.

Visuals:
- Screenshot of the active/inactive UI Button: `/home/jules/verification/screenshots/tts_proofread.png`

Implementation Journey:
- Brainstormed and validated that no duplicate feature (e.g. `browser-tts`, `proofread`) existed in remote branches.
- Identified the optimal placement for the button: next to the "Clear" button in the `textInput` mode section of `page.tsx`.
- Implemented state `isPlayingNativeTTS` to toggle the UI and manage the TTS lifecycle.
- Created `handleNativeTTSPreview` to instantiate `SpeechSynthesisUtterance`, sync the reading rate with the global `speed` state, and handle `onend`/`onerror` cleanup.
- Added a `useEffect` cleanup hook on component unmount to call `window.speechSynthesis.cancel()`, ensuring audio doesn't keep playing if the user navigates away.
- Validated styling utilizing standard Tailwind classes and the `Ear` icon from `lucide-react`.

Tradeoffs & Assumptions:
- **Lateral Path Brainstorming:**
  1. Standard: Add a button to read text using `window.speechSynthesis`.
  2. Minimalist: Just read the text automatically when pasted (too intrusive).
  3. Lateral: Upload the text to a faster, lower-quality backend model for preview.
- **Decision:** I chose the Standard path. It introduces zero backend dependency, negligible latency, and perfectly solves the need for quick proofreading.
- **Assumption:** I assumed that the user's selected `speed` modifier should apply to the browser TTS preview, so I passed it to `utterance.rate = speed`. Note: Headless CI environments might not have a full browser TTS engine installed, but modern graphical browsers will handle it seamlessly.

Testing Instructions:
1. Start the web UI (`npm run dev`).
2. Navigate to `http://localhost:3000`.
3. Switch the Configuration card to "Text Input".
4. Type or paste several sentences into the textarea.
5. Click the "Proofread (Browser TTS)" button located at the bottom right of the textarea.
6. Verify that your browser begins reading the text aloud and the button changes state to "Stop Proofread" with a blue background.
7. Click "Stop Proofread" to interrupt playback and verify it halts immediately.

Action Item: git push origin HEAD
