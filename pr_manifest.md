PR Title: feat: WAV Output Format Support

The Problem Solved: Added support for generating audiobooks in standard uncompressed WAV format for users needing lossless quality output.

Visuals: UI screenshot and video recorded during playwright testing.

Implementation Journey:
- Updated frontend state in `page.tsx` to support 'wav' format option
- Added WAV to the format selection UI with proper layout adjustments
- Updated backend API route in `route.ts` to parse 'wav' format
- Modified `AudioProcessor` in `audio.ts` to handle wav merging using ffmpeg by copying the stream
- Configured Kokoro TTS client in `kokoro.ts` to request 'wav' instead of 'mp3' when wav is selected

Tradeoffs & Assumptions:
- Made Kokoro response format dynamic based on the selected output format. When WAV is selected, Kokoro directly outputs WAV, keeping it lossless end-to-end.
- Assumed standard PCM 16-bit WAV is sufficient for most use cases without extra ffmpeg options.
- The UI format selection grid was refactored to use standard flex columns instead of grid columns to accommodate 3 items cleanly on mobile and desktop without awkward 2x1 grid gaps.

Testing Instructions:
- Start the server `npm run dev` in `web-ui`
- Select 'WAV (Lossless)' from Output Format options
- Provide text and generate audio
- Check that the downloaded file is a valid `.wav` file

Action Item: Used `submit` tool to open PR.
