PR Title: feat: Inline Audio Preview

The Problem Solved: Users lacked a way to quickly listen to generated audio without downloading the file entirely. This feature adds an inline HTML5 audio preview to the download card, enabling immediate feedback upon audiobook generation.

Visuals:
![UI Screenshot Validation](/home/jules/verification.png)

Implementation Journey:
* Added a flex-col layout to the success card in `web-ui/src/app/page.tsx`.
* Inserted a native `<audio controls src={downloadUrl} />` element under the download button.

Tradeoffs & Assumptions:
* Assumption: We want the simplest approach to add audio playback.
* Standard Approach: Add a custom React player (Too much boilerplate).
* Minimalist Approach (Chosen): Native `<audio controls>`. Fast, zero dependencies, uses existing browser API.
* Lateral Approach: Web Audio API waveform visualization (Too complex).

Testing Instructions:
1. Run `npm run dev` in the `web-ui` folder.
2. Go to `http://localhost:3000`.
3. Input text on the Text Input tab and hit Start Generation.
4. When complete, you should see the download card now contains an audio player.
