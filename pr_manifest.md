PR Title: feat: Show Generation Time Stats (and fix closure bug)

The Problem Solved: Users previously had no way to know the total time taken to generate an audiobook after it finished. Additionally, the `startTime` tracking for the progress UI was susceptible to a React state closure bug inside the async handler loop. This PR fixes the closure issue and adds a clear "Audiobook successfully generated in Xm Ys" output string upon successful completion.

Visuals:
![Final Stats Preview](/home/jules/verification/screenshots/generation_time_stats.png)

Implementation Journey:
* Identified React closure issue with `startTime` state in `handleGenerate`.
* Replaced `startTime` state variable with local `currentStartTime` for safety inside the async function.
* Added `finalTime` state to capture the elapsed time upon successful completion.
* Display the elapsed generation time in the "Ready for Download" section.
* Created a temporary Playwright script to verify UI and manually captured screenshots.

Tradeoffs & Assumptions:
* Assumption: The actual total generation time is meaningful context to the user.
* Minimalist Approach (Chosen): I appended the calculated time string directly to the existing "Ready for Download" card UI rather than creating a new component or statistics table to remain lightweight and unobtrusive.
* Handled the risk of Next.js hydration issues by strictly relying on state updates driven by the server's SSE completion response rather than local interval clocks alone.

Testing Instructions:
1. Run `docker-compose up` to start Kokoro and Web UI.
2. Go to `http://localhost:3000`.
3. Select "Text Input" and enter some dummy text.
4. Click "Start Generation".
5. Wait for it to complete. The final status should read "Audiobook successfully generated in [Elapsed Time]".

Action Item: git push origin feature/show-generation-time-stats && gh pr create -F pr_manifest.md
