PR Title: feat: Dynamic Favicon Status Indicator

The Problem Solved:
Audiobook generation can take minutes. Users often switch tabs while waiting. By updating the browser tab's favicon dynamically based on the generation state (idle, generating, success, error), users can monitor progress without keeping the app in the foreground.

Visuals:
- [Screenshot](/home/jules/verification/screenshots/verification.png)
- [Video](/home/jules/verification/videos/verification.webm)

Implementation Journey:
- Created a `useEffect` hook in `web-ui/src/app/page.tsx` to handle the favicon rendering logic.
- Utilized an HTML5 canvas to dynamically draw standard circular state indicators (Blue spinner for loading, Green check for success, Red cross for error).
- Encoded the canvas via `toDataURL` to inject as a custom data-uri `<link rel="icon">`.

Tradeoffs & Assumptions:
- **Assumption:** Next.js allows dynamically appending a `link[rel="icon"]` to override the static `/favicon.ico`. We implemented it as a canvas injection to avoid downloading or managing multiple static icon assets.
- **Tradeoff (Simplicity First):** I chose to implement the hook directly in `page.tsx` rather than creating a separate file abstraction `useDynamicFavicon.ts`, prioritizing surgical simplicity and minimizing touched files.

Testing Instructions:
1. Start the Next.js server (`npm run dev`).
2. Input some text in the application and click "Start Generation".
3. Observe the browser tab: The favicon should change to a blue indicator.
4. When finished, it will switch to a green checkmark. (Test errors to see the red X).

Action Item: `git push origin HEAD:feature/dynamic-favicon-status-indicator && gh pr create --title "feat: Dynamic Favicon Status Indicator" --body-file pr_manifest.md`
