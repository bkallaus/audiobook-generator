PR Title: feat: Add M4B bitrate selector

The Problem Solved: This feature allows users to configure the audio bitrate when generating M4B files to balance between file size and audio quality.

Visuals: N/A

Implementation Journey:
- Updated `audio.ts` to accept `bitrate` in `metadata` and apply it to the ffmpeg command using `audioBitrate`.
- Updated `route.ts` API endpoint to extract `bitrate` from `FormData` and pass it to the audio processor.
- Updated `page.tsx` to include a new state variable for `bitrate`, append it to the generation request, and render a dropdown to select the bitrate (64k, 96k, 128k, 192k) when the output format is set to M4B.

Tradeoffs & Assumptions:
- Standard approach: Added the selector next to the format selection only when M4B is chosen.
- Minimalist approach: Hardcode a specific bitrate. Rejected because the prompt implies an explicit selection feature.
- Lateral approach: Let users type any bitrate string. Rejected because it could cause unexpected issues, it is safer to limit to standard values like 64k, 96k, 128k, 192k.
- Chose standard approach to allow safe, validated control.
- Assumed standard bitrates are 64k, 96k, 128k, and 192k based on common audiobook qualities.

Testing Instructions:
1. Run `npm run dev` in `web-ui`.
2. Visit `http://localhost:3000`.
3. The format defaults to M4B. Notice the dropdown to the right of "Output Format" with values like "128 kbps (High)".
4. Select "MP3" and ensure the dropdown is hidden.
5. Select "M4B" and change the bitrate to "64k".
6. Generate an audiobook and ensure the output uses the selected bitrate (this can be checked by file size or metadata).

Action Item: git push origin HEAD && gh pr create --fill