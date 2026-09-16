PR Title: feat: Auto-Resizing Textarea for Text Input

The Problem Solved: Users pasting large amounts of text into the "Text Input" area were confined to a small, fixed-height box, making it difficult to review or edit their text. This feature introduces a dynamically resizing textarea that grows with the content, providing a vastly improved reading and editing experience.

Visuals:
![Auto-Resizing Textarea](/home/jules/verification/textarea_resize.png)

Implementation Journey:
* Confirmed no duplication (checked existing branches).
* Added `useRef` and `useEffect` to `page.tsx` to monitor `textInput` changes.
* Dynamically set the `textarea` inline height to `scrollHeight`.
* Replaced fixed `h-48` Tailwind class with `min-h-[12rem]`, `max-h-[30rem]`, and `overflow-y-auto` to cap the growth and allow scrolling beyond the maximum height.
* Verified UI locally using a Playwright script.

Tradeoffs & Assumptions:
* Assumption: Users want the textarea to expand but not infinitely, to avoid breaking the page layout.
* Standard Approach: Simple inline style updates via `useEffect`.
* Minimalist Approach (Chosen): Combined `useEffect` with Tailwind `max-h-[30rem]` which relies on CSS constraints rather than complex JS measurement logic to enforce the ceiling.
* Lateral Approach: Using a `contenteditable` div (discarded as it breaks React's native controlled input binding too easily).

Testing Instructions:
1. Run `npm run dev` in the `web-ui` directory.
2. Go to `http://localhost:3000`.
3. Switch to the "Text Input" mode.
4. Paste a large block of text (multiple paragraphs).
5. Verify the textarea expands vertically up to a reasonable maximum limit before showing a scrollbar.

Action Item: git push origin feature/auto-resizing-textarea && gh pr create -F pr_manifest.md
