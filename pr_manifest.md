PR Title: feat: Voice Preview Volume Control

The Problem Solved: Adds a dedicated volume slider and mute toggle to the Voice Picker component, allowing users to control the playback volume of voice sample previews.

Visuals:
- [Screenshot](/home/jules/verification/screenshots/voice-preview-volume.png)

Implementation Journey:
- Added `previewVolume` state to track desired volume.
- Synchronized `audioRef.current.volume` with state via `useEffect`.
- Set initial volume on `new Audio()` creation.
- Implemented a volume slider input and a mute/unmute toggle button using Lucide icons (`Volume2`, `VolumeX`).

Tradeoffs & Assumptions:
- Assumed users want granular control via a slider.
- Standard Approach (slider + state) chosen over Minimalist (hardcoded volume) for flexibility.
- Assumed the volume preference is session-based and scoped to the Voice Picker component.

Testing Instructions:
1. Start the Next.js dev server: `cd web-ui && npm run dev`
2. Open `http://localhost:3000`
3. Locate the Voice Picker component (under "Voice Model").
4. Adjust the new volume slider.
5. Click the Play button next to a voice to verify playback at the selected volume.
6. Click the speaker icon to toggle mute/unmute.

Action Item: `git push origin feature/voice-preview-volume-control`
