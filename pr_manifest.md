PR Title: feat: Dynamic Document Title

The Problem Solved:
Users lack visibility into the background progress when processing a large audiobook in another tab or window. This feature dynamically updates the browser tab title to show current generation status (`(42%) Generating...`), success, and error states, improving the user experience and multi-tasking capability.

Visuals:
![UI Screenshot Validation](/home/jules/verification/verification.png)

Implementation Journey:
* Updated `layout.tsx` to set a more descriptive default title for the app ("Audiobook Generator").
* Implemented a `useEffect` hook in `page.tsx` to reactively update `document.title` corresponding to the application's current processing phase (`loading`, `error`, `downloadUrl` logic).

Tradeoffs & Assumptions:
* Assumption: We want an easily trackable way for users to know if generation finished without constantly checking the specific browser tab.
* Standard Approach: Push notifications via Notification API (Requires permissions, heavy).
* Minimalist Approach (Chosen): Dynamically updating `document.title`. Cross-browser compatible, zero dependencies, minimal codebase footprint.
* Lateral Approach: Favicon progress indicator updates (Fun, but complex to render dynamic image/SVG frames on the fly for Next.js).

Testing Instructions:
1. Run `npm run dev` in the `web-ui` folder.
2. Go to `http://localhost:3000`.
3. Provide text into the text field and click "Start Generation".
4. Observe the browser tab title change to show the generation progress (e.g. `(0%) Generating...`).
5. After it finishes, observe the tab title becomes `✅ Ready! | Audiobook Generator`.
