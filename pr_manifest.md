PR Title: feat: Auto-Scroll to Output Console on Generation

The Problem Solved:
Enhances the mobile and small-screen user experience by automatically scrolling the page down to the "Output Console" whenever a new generation process starts, ensuring the progress bar and status logs are immediately visible without manual scrolling.

Visuals:
![Auto-Scroll Verification](/home/jules/verification/verification.png)

Implementation Journey:
- Imported `useRef` in `web-ui/src/app/page.tsx`.
- Instantiated an `outputRef` and attached it to the root wrapper of the Output Section.
- Added a `setTimeout` inside `handleGenerate` to invoke `scrollIntoView({ behavior: 'smooth', block: 'start' })` shortly after state changes trigger re-renders.

Tradeoffs & Assumptions:
- Brainstormed approaches: (1) Auto-scroll on start (Standard), (2) Sticky progress banner (Minimalist), (3) Swap layout components (Lateral).
- Chose the Standard approach as it involves minimal code changes (`useRef` + `scrollIntoView`), matches typical web app behaviors, and avoids overly complex DOM manipulation.
- Assumption: 100ms `setTimeout` is sufficient to let React's initial state updates (like showing the loading state) settle before scrolling accurately.

Testing Instructions:
1. Start the dev server (`npm run dev`).
2. Shrink the browser window or use mobile view.
3. Paste text into the text area.
4. Click 'Start Generation'.
5. Verify the window smoothly scrolls down to display the output console.

Action Item: git checkout -b feature/auto-scroll-to-output-console && git add . && git commit -m "feat: Auto-Scroll to Output Console on Generation"
