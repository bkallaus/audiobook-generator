PR Title: feat: Contextual Voice Previews

The Problem Solved: Users lacked context when previewing a voice model. Instead of listening to a generic pre-baked string ("Hello, this is a sample of my voice"), users can now instantly hear the selected voice speak the exact words they just typed in the Text Input area, significantly improving voice selection confidence.

Visuals: No UI changes; pure functionality enhancement.

Implementation Journey:
- Updated the backend `/api/sample` route to safely extract and truncate a custom `text` query parameter, ensuring fast and robust on-the-fly preview generation.
- Expanded the `VoicePickerProps` to optionally accept `previewText` and intelligently injected it into the sample audio URL.
- Modified the main `page.tsx` UI to dynamically slice the first ~15 words of the user's active `textInput` and pass it to the `VoicePicker`.

Tradeoffs & Assumptions:
- Explored 3 paths: 1) Standard Approach (Add an explicit secondary text box for preview text), 2) Minimalist Approach (Hardcode a better default generic string), 3) Lateral Approach (Implicitly use the main text context when in Text Mode). Chose the Lateral Approach as it provides a magical UX with zero added UI clutter, keeping the interface perfectly clean.
- We deliberately truncated the custom text at the UI layer to ~15 words to prevent overly long network request URLs and slow TTS generation times for samples.
- The backend route explicitly limits the string processing to 100 characters to prevent potential abuse and ensure high-performance on-the-fly generation even if hit directly.

Testing Instructions:
1. Start the Next.js development server: `cd web-ui && npm run dev`
2. Open `http://localhost:3000`
3. Switch to "Text Input" mode and type: "This is my brand new audiobook and it sounds amazing."
4. Click the Play button next to any voice in the Voice Model list.
5. Verify you hear the voice speak your custom text instead of the generic sample string.

Action Item: `git push -u origin feature/contextual-voice-previews-nova && gh pr create --title "feat: Contextual Voice Previews" --body-file pr_manifest.md`
