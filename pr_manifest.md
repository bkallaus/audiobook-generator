PR Title: feat: Speed Presets

The Problem Solved: Allows users to quickly select common playback speeds (1.0x, 1.2x, 1.5x, 2.0x) without having to manually drag the slider, improving usability and saving time.

Visuals:
[UI Screenshot Validation](/home/jules/verification/screenshots/speed-preset.png)
[UI Video Validation](/home/jules/verification/videos/e0dd399837a495e63ea9f2aa6125605c.webm)

Implementation Journey:
* Added a flex container to the Speed label header.
* Implemented preset buttons mapped to the `setSpeed` state.
* Added active/inactive styling to highlight the currently selected speed.

Tradeoffs & Assumptions:
* Assumption: Users frequently choose standard speed increments rather than arbitrary granular numbers.
* Standard Approach: Add buttons underneath the slider (uses too much vertical space).
* Minimalist Approach (Chosen): Add small chips next to the label. Preserves space and fits the clean UI perfectly.
* Lateral Approach: Replace slider with a dropdown (removes granular control).

Testing Instructions:
1. Run `npm run dev` in the `web-ui` folder.
2. Go to `http://localhost:3000`.
3. Locate the "SPEED" section in the options grid.
4. Click any of the preset chips (1.0x, 1.2x, etc.) and observe that the slider moves and the state updates.

Action Item: Using submit tool
