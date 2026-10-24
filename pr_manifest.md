PR Title: feat: Add Paste from Clipboard button

The Problem Solved: Users often need to paste text into the generation field from external sources. Instead of relying solely on keyboard shortcuts, a dedicated "Paste" button improves UX (especially on mobile) and provides a clear call-to-action right next to the "Clear" button.

Visuals:
- Local verification screenshots captured during testing.

Implementation Journey:
- Verified existing branches to avoid duplication.
- Appended a new Paste button beside the existing Clear button.
- Used `navigator.clipboard.readText()` within a user-initiated `onClick` event to bypass strict clipboard permissions.
- Added logic to intelligently append a newline before pasting if the current text block doesn't already end in a space or newline.
- Validated UI rendering and functional behavior locally using an automated Python Playwright script.

Tradeoffs & Assumptions:
- *Interpretations:* Considered whether to completely replace existing text or append. Decided to append (with an automatic newline where appropriate) because it's a safer default that prevents accidental data loss.
- *Paths Brainstormed:* (1) A standard paste button that appends text. (2) A minimalist approach showing Paste only when text is empty. (3) A lateral approach with a floating action button that replaces text.
- *Chosen Path:* Standard approach (1) with intelligent newline appending for safety and simplicity.

Testing Instructions:
1. Run `npm run dev` in the `web-ui` directory.
2. Open `http://localhost:3000` in your browser.
3. Switch to the "Text Input" mode.
4. Copy some text to your system clipboard.
5. Click the "Paste" button at the bottom right of the text area.
6. Verify that the copied text appears in the text area. If text already existed, ensure a newline separates the existing and newly pasted text.

Action Item: Using submit tool to commit and submit changes.
