PR Title: feat: Clear Selected File

The Problem Solved: Users lacked an intuitive way to clear a mistakenly uploaded file from the dropzone without reloading the page or uploading a dummy file. A clear "X" button was added for better UX.

Visuals:
- Before Selection: `/home/jules/verification/screenshots/1-before-selection.png`
- After Selection: `/home/jules/verification/screenshots/2-after-selection.png`
- After Clear: `/home/jules/verification/screenshots/3-after-clear.png`

Implementation Journey:
- Set up a feature branch `feature/clear-selected-file-nova`.
- Evaluated missing feature based on current application state and user needs.
- Added a "Clear file" button with an 'X' icon (from `lucide-react`) when a file is actively selected.
- Styled the button with Tailwind CSS.
- Implemented clearing the `file`, `downloadUrl`, and `status` variables in `web-ui/src/app/page.tsx` upon button click.
- Ensured click event propagation was stopped so the dropzone would not open when clicking "X".
- Verified functionality via Playwright script (`verify.mjs`).
- Reverted dev-environment noise from `package.json`, `package-lock.json`, and `next-env.d.ts` before staging.

Tradeoffs & Assumptions:
- Assumption: The UI was missing a dedicated way to reset the file dropzone to its initial state without triggering a new upload prompt or page reload.
- Brainstormed 3 approaches:
  1) Standard: Add an "X" icon button inside the dropzone when a file is selected.
  2) Minimalist: Make the file name itself clickable to remove the file.
  3) Lateral: A global "Reset Application State" button.
- Chosen Route: Path 1 (Standard). The "X" button is the most universally understood UX pattern for removing an item from a selection area, ensuring low cognitive load for the user.

Testing Instructions:
1. Start the Next.js development server: `cd web-ui && npm run dev`
2. Open `http://localhost:3000` in a browser.
3. Select "File Upload" mode.
4. Click or drag-and-drop an EPUB or TXT file into the designated area.
5. Observe the new "X" button in the top right corner of the file upload zone.
6. Click the "X" button.
7. Verify that the file is cleared, the original dropzone prompt returns, and no file picker dialog opens.

Action Item: git push origin feature/clear-selected-file-nova && gh pr create -F pr_manifest.md
