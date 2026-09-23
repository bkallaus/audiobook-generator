PR Title: feat: Export Status Log to File

The Problem Solved: Allows users to download the generation status history log directly to a `.txt` file via a download icon button in the Output Console. This is useful for saving debugging contexts or tracking the timeline of background generation processes.

Visuals:
- Status Log Download Icon: `/home/jules/verification/screenshots/status_log_with_download_button.png`

Implementation Journey:
- Scanned git branches to verify the feature doesn't already exist.
- Investigated `web-ui/src/app/page.tsx` for the "Status Log" section.
- Added a `handleDownloadLog` handler that converts `statusLog` into a Blob-based text file and triggers a synthetic download.
- Extracted a `Download` icon from `lucide-react` and placed it smoothly next to the "Status Log" header.
- Wrote and executed a headless Python Playwright script to mock a fast generation API, trigger the download, and save visual proof via a screenshot.
- Verified build and lint tests pass correctly.
- Removed auto-generated scripts and local test files to adhere to surgical commit policies.

Tradeoffs & Assumptions:
- **Lateral Path Brainstorming:**
  1. Standard: A small download icon button that converts the state array into a raw blob for downloading.
  2. Minimalist: A "Copy" clipboard button.
  3. Lateral: Automatically downloading upon completion or error.
- **Decision:** Chose the standard Path 1 because explicit user control (via standard browser downloads) respects standard UX patterns better than polluting the clipboard or triggering unsolicited file downloads.
- **Assumption:** Assumed it is acceptable to generate the plain-text timestamps locally at the time of download by mapping over the array.

Testing Instructions:
1. Run `npm run dev` and navigate to `http://localhost:3000`.
2. Provide input (e.g. text or file) and click `Start Generation`.
3. Notice a `Download` icon appears in the Status Log header.
4. Click the icon to immediately download `generation-log.txt`.
5. Open the downloaded file to view the timestamped status history logs.
Action Item: git push origin HEAD
