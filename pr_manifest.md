PR Title: feat: Random Voice Selector

The Problem Solved: Users faced with a list of high-quality Kokoro voices may experience choice paralysis. This feature adds a simple, one-click "Shuffle" button to randomly select a voice, aiding discovery.

Visuals:
![Random Voice Selector](/home/jules/verification/screenshots/random_voice_selector.png)

Implementation Journey:
* Confirmed no duplication (checked existing branches).
* Logged thought process (Minimalist approach chosen).
* Updated `VoicePicker.tsx` to include a `handleShuffle` function that picks a random voice from the currently filtered list.
* Added a `Dices` icon button next to the gender filter pills, matching the existing UI style.
* Verified functionality locally using a Playwright script and Next.js development server.
* Ran lint and build to ensure no regressions.

Tradeoffs & Assumptions:
* Assumption: Users may suffer from choice paralysis given multiple high-quality voices. A random selector aids discovery.
* Approaches considered:
  1. Standard: Add a button in the main page.tsx that calls a function exposed by VoicePicker. Complex because state lives in both.
  2. Minimalist (Chosen): Add a "Shuffle" button directly inside the VoicePicker component next to the gender filters. Selects a random voice from the currently filtered view. Simplest, self-contained, high visibility.
  3. Lateral: Add a "Surprise Me" option as an actual voice entry at the top of the list that randomly assigns a voice at generation time. Harder to preview, hides the actual voice being used.

Testing Instructions:
1. Run `npm run dev` in the `web-ui` directory.
2. Go to `http://localhost:3000`.
3. In the "Voice Model" section, locate the dice icon next to the "Male"/"Female"/"All" filter.
4. Click the dice icon.
5. Verify that a random voice in the list is selected.
6. Change the gender filter (e.g., to "Female") and click the dice again. Verify it only selects female voices.

Action Item: git push origin feature/random-voice-selector && gh pr create -F pr_manifest.md
