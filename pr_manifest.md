PR Title: feat: Audio Player Skip Controls

The Problem Solved: Added 15-second skip backward and skip forward controls to the generated audio player, dramatically improving the user experience for navigating long audiobooks.

Visuals: [Screenshot](/home/jules/verification/screenshots/audio_skip_controls.png)

Implementation Journey:
- Scanned repository for existing features to avoid duplication.
- Brainstormed and logged assumptions to choose the simplest, highest value user-facing feature.
- Imported `RotateCcw` and `RotateCw` icons from `lucide-react` and added `useRef` to React imports.
- Added a `skipAudio` function to manipulate the `currentTime` of the native HTML5 audio element.
- Attached a `ref` to the `<audio>` element.
- Integrated the new buttons beneath the player in the Success Card.
- Wrote and executed a headless Playwright script to verify visual changes.
- Tested compilation using NEXT_DISABLE_ESLINT to bypass unrelated lint errors.

Tradeoffs & Assumptions:
- Brainstormed 3 paths: Standard (add skip buttons under the native player), Minimalist (keyboard shortcuts only), and Lateral (build a completely custom audio player hiding the native controls).
- Chose the Standard path to strictly adhere to the "Simplicity First" directive, matching the current UI footprint while maximizing feature utility for audiobook navigation without reinventing native playback mechanisms.
- Assumed standard HTML5 audio APIs are sufficient and did not add external playback libraries.

Testing Instructions:
1. Navigate to the main page and upload a small text snippet.
2. Click Generate and wait for the "Ready for Download" card to appear.
3. Start playing the audio and click the "15s backward" and "15s forward" buttons to verify the playback time jumps forward and backward accurately.

Action Item: git push origin feature/audio-skip-controls && gh pr create --title "feat: Audio Player Skip Controls" --body-file pr_manifest.md
