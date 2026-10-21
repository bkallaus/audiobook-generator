PR Title: feat: Speed Reset Button

The Problem Solved: Adds a convenient reset button next to the Speed control label that allows users to quickly revert the generation playback speed back to 1.0x with a single click.

Visuals: ![Verification Image](/home/jules/verification/verification.png)

Implementation Journey:
* Added a new `RotateCcw` icon import from `lucide-react` in `src/app/page.tsx`.
* Replaced the standard Speed label with a flex container housing both the label and a conditional reset button.
* Configured the button to only render when `speed !== 1.0`.
* Configured the button's onClick event to `setSpeed(1.0)`.

Tradeoffs & Assumptions:
* Assumption: Users frequently experiment with speed but often want to quickly return to normal.
* Tradeoff/Alternative 1 (Standard): Double-click slider to reset. This is less discoverable but cleaner UI.
* Tradeoff/Alternative 2 (Minimalist): A simple icon button beside the label (Chosen). Most discoverable, uses minimal space, and follows existing design language.
* Tradeoff/Alternative 3 (Lateral): A global "Reset Defaults" button. Too destructive when only speed adjustment was desired.

Testing Instructions:
1. Start the Next.js dev server with `npm run dev` in the `web-ui` directory.
2. Open `http://localhost:3000` in your browser.
3. Slide the Speed control away from 1.0x.
4. Verify a reset icon button appears next to the "Speed" label.
5. Click the reset button and verify the slider and value return to exactly 1.0x.

Action Item: use the \`submit\` tool with the branch name \`feature/speed-reset-button\` to push the changes.
