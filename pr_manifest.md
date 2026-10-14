PR Title: feat: Download Text Draft

The Problem Solved: Users typing or pasting text into the Text Input area previously had no way to save their draft directly from the interface. This feature adds a simple "Save" button to download the textarea content as a `.txt` file, preventing potential data loss before generation.

Visuals:
[save_button_visible.png](/home/jules/verification/screenshots/save_button_visible.png)

Implementation Journey:
* Checked existing branches to avoid duplicating a feature.
* Identified that a "Save Text Draft" feature was missing and highly useful.
* Brainstormed architectural options (standard download button vs minimalist icon vs auto-saving to local storage).
* Implemented a surgical, single-file change in `web-ui/src/app/page.tsx` adding a minimalist text-based "Save" button identical in style to the adjacent "Clear" button.
* Wrote and executed a Playwright verification script to confirm the button triggers a download containing the correct text content.
* Cleaned up orphaned scratchpad files and unnecessary dependencies added during brainstorming.

Tradeoffs & Assumptions:
* **Assumed** users want a standard file download for their text draft.
* **Paths Brainstormed:**
    1. Standard: Add a manual "Save" button to download `.txt`.
    2. Minimalist: Use a save icon next to the "Clear" button.
    3. Lateral: Auto-save drafts to local storage continuously.
* **Why this route:** Standard button using simple text perfectly matches the adjacent "Clear" button's styling and functionality. It requires absolutely minimum code (just native Blob creation and download link) with no new dependencies or complex state management.

Testing Instructions:
1. Start the Next.js dev server (`npm run dev`).
2. Navigate to `localhost:3000`.
3. Switch the configuration mode to "Text Input".
4. Type or paste text into the text area.
5. Notice the new "Save" button appear next to the "Clear" button at the bottom right.
6. Click "Save" and verify that a `.txt` file is downloaded and its contents match what you typed.

Action Item: `git commit -am "feat: Download Text Draft"`
