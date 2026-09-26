PR Title: feat: Text Input Font Size Controls

The Problem Solved: Users pasting long text into the application for generation might struggle with readability; this feature provides inline "A-" and "A+" buttons to quickly scale the textarea font size up and down.

Visuals:
* [UI Screenshot (Large Font)](/home/jules/verification/screenshots/verification_large.png)
* [UI Screenshot (Small Font)](/home/jules/verification/screenshots/verification_small.png)
* [UI Verification Video](/home/jules/verification/videos/87f4df6853e5dae7ac1321c856c16400.webm)

Implementation Journey:
* Explored codebase and verified no pre-existing duplication for this feature.
* Decided on the "Minimalist" architectural approach (inline +/- buttons scaling inline style) to minimize UI clutter and abstract logic.
* Added `fontSize` state to `web-ui/src/app/page.tsx` default to 14px.
* Injected `A-` and `A+` buttons into the absolute positioned bottom right corner of the text input panel.
* Bound buttons to scale the state between 10px and 24px, applying it to the textarea via inline style.
* Executed Playwright UI automation script to capture screenshots/videos and verified functionality.

Tradeoffs & Assumptions:
* Assumption: Font size adjustment only matters for the text input box, not the global application UI.
* Brainstormed paths: 1) Tailwind class toggling, 2) Minimalist inline styling (Chosen), 3) Global CSS variable slider.
* Tradeoff: Chosen inline styling limits the design system consistency slightly but keeps the PR extremely simple, targeted, and localized exactly to the user's focus area without needing new context providers or complex CSS injection.

Testing Instructions:
1. Run `npm run dev` in `web-ui`.
2. Visit `http://localhost:3000`.
3. Switch input mode to "Text Input".
4. Type some text into the box.
5. Click the "A+" and "A-" buttons in the bottom right corner of the textarea block to confirm the text scales appropriately without breaking layout.
