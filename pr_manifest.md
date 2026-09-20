PR Title: feat: Prevent Accidental Generation Cancellation

The Problem Solved: Users could accidentally click the prominent "Stop Generation" button, instantly cancelling a long-running audiobook generation with no way to resume. This feature requires a secondary confirmation click within 3 seconds to ensure intent.

Visuals:
![Stop Confirm](/home/jules/verification/screenshots/confirm_stop_button.png)

Implementation Journey:
* Confirmed no duplication (checked existing branches).
* Brainstormed approaches: Standard (`window.confirm`), Lateral (Slide to cancel), Minimalist (Inline state toggle).
* Chose Minimalist approach for best UX.
* Added `stopConfirm` boolean state to `Home` component.
* Modified the "Stop Generation" button `onClick` handler to intercept the first click and set a 3-second reset timeout.
* Updated the button styling (red-700 background and ring) and text ("Click again to confirm stop") to visually communicate the confirmation state.
* Verified functionality locally using a Playwright script covering the timeout reset and actual abort flows.

Tradeoffs & Assumptions:
* Standard Approach: `window.confirm`. Rejected because it blocks the UI thread and feels outdated.
* Lateral Approach: A "Hold to Stop" button. Rejected because holding on mobile/web can inadvertently trigger text selection or context menus.
* Minimalist Approach (Chosen): Inline state toggle. Fits perfectly into the existing flow and requires only local state changes without external libraries.
* Assumption: 3 seconds is enough time for a user to read the confirmation and click again if intended, but short enough to auto-dismiss if accidental.

Testing Instructions:
1. Run `npm run dev` in the `web-ui` directory.
2. Go to `http://localhost:3000`.
3. Switch to "Text Input", paste some text, and click "Start Generation".
4. While generating, click "Stop Generation".
5. Verify the button turns darker red with a ring and says "Click again to confirm stop".
6. Wait 3 seconds and verify it resets.
7. Click "Stop Generation" again, then click it a second time immediately.
8. Verify the generation actually stops and the status updates to "Generation stopped by user."

Action Item: git checkout -b feature/prevent-accidental-cancellation && git add web-ui/src/app/page.tsx && git commit -m "feat: Prevent Accidental Generation Cancellation" && gh pr create -F pr_manifest.md
