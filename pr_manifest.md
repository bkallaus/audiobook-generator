PR Title: feat: M4B Bitrate Selector

The Problem Solved: Adds a UI selector for users to customize the audio encoding bitrate (64k, 128k, 192k) when generating M4B audiobooks, allowing them to balance file size vs audio quality.

Visuals:
- [M4B Selected / Bitrate Visible](/home/jules/verification/screenshots/verification.png)
- [Video Demonstration](/home/jules/verification/videos/a016613017967c2eaa64a6b549576375.webm)

Implementation Journey:
- Updated `web-ui/src/lib/audio.ts` to accept an optional `bitrate` in the metadata parameter and pass it to `.audioBitrate()` in the ffmpeg command.
- Updated `web-ui/src/app/api/generate/route.ts` to extract `bitrate` from the incoming `FormData` and pass it to `AudioProcessor.mergeAudio`.
- Updated `web-ui/src/app/page.tsx` to include a new `bitrate` state, pass it to the backend via `FormData`, and render a `<select>` dropdown conditionally when the M4B format is selected.
- Verified the UI dynamically shows/hides the bitrate dropdown based on the format selection via Playwright automated testing.

Tradeoffs & Assumptions:
- **Assumption:** The user wanted a net-new feature that adds value without introducing duplication. Since bitrate control wasn't found in existing branches, it was chosen.
- **Approaches:**
    1. Standard: Add a full bitrate selection UI and pipe it to ffmpeg.
    2. Minimalist: Add a simple checkbox for "Low Quality" that hardcodes 64k vs 128k.
    3. Lateral: Automatically choose bitrate based on input size.
- **Decision:** The Standard approach was chosen because a `<select>` dropdown is equally simple to implement on the frontend but provides more value (allowing for 192k high quality as well as 64k low quality) while keeping the backend implementation exactly the same.

Testing Instructions:
1. Start the Next.js dev server with `npm run dev`.
2. Navigate to `http://localhost:3000`.
3. Switch between the 'M4B' and 'MP3' output formats.
4. Verify that the 'Bitrate' dropdown appears ONLY when 'M4B' is selected.
5. Select a bitrate (e.g. 64k), enter some text, and start generation.
6. Verify the audio generates successfully and the resulting file is encoded at the selected bitrate.

Action Item: git push origin HEAD && gh pr create -F pr_manifest.md
