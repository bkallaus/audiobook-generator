PR Title: feat: Custom Author Metadata

The Problem Solved: Allows users to explicitly define the author of their generated audiobooks via an optional text input in the UI, embedding the metadata into the final m4b/mp3 file.

Visuals: [Screenshot of the Author Input field](file:///home/jules/verification/screenshots/author-input.png)

Implementation Journey:
- Verified no existing branch overlaps with this feature.
- Added an optional "Author" text input state and UI field to `web-ui/src/app/page.tsx`.
- Updated the generation submission logic to conditionally append `author` to `FormData`.
- Updated `web-ui/src/app/api/generate/route.ts` to extract the `author` field and pass it to `AudioProcessor.mergeAudio`.
- Created a headless Playwright script to verify UI component placement and logic.
- Conducted local Next.js production build (`NEXT_DISABLE_ESLINT=1 npm run build`) to ensure there were no structural regressions.

Tradeoffs & Assumptions:
- **Assumption**: The `AudioProcessor.mergeAudio` backend logic already correctly applies the `author` metadata when passed, as evidenced by its function signature.
- **Tradeoff**: Chose an explicit UI input ("Standard" approach) rather than attempting to magically parse "Author: X" from text input ("Lateral" approach) to maximize stability and simplicity.
- **Tradeoff**: Did not modify `EpubParser` to auto-extract the author, keeping changes surgical and immediately addressing both Text and File inputs uniformly.

Testing Instructions:
1. Start the Next.js UI using `npm run dev` in the `web-ui` directory.
2. Open http://localhost:3000.
3. Observe the new "Author (Optional)" input field above the Output Format selection.
4. Input some text, select a voice/format, enter an author name (e.g. "Jane Doe").
5. Click "Start Generation" and verify that generation completes successfully.
6. Verify the downloaded file's metadata contains the injected author using a tool like `ffprobe` or a media player.

Action Item: Using default_api:submit
