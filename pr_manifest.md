PR Title: feat: Recent Generations History

The Problem Solved: Users lose access to their previously generated audiobooks if they refresh the page. This feature adds a simple "Recent Generations" history, allowing users to re-download previously generated files during their session.

Visuals:
![Recent Generations History](/home/jules/verification/screenshots/history2.png)

Implementation Journey:
* Defined a `HistoryItem` interface and added state for history in `web-ui/src/app/page.tsx`.
* Added a `useEffect` to safely read `localStorage` for `kokoro_history` on component mount to avoid SSR hydration mismatches.
* Updated the `handleGenerate` success block (`data.type === 'result'`) to create a new `HistoryItem` and append it to the state.
* Capped the history limit to 5 recent items and stored the updated state in `localStorage`.
* Appended the "Recent Generations" UI elements below the Download Card in the "Output Console", conditionally rendering if there are history items.
* Included a "Clear" button that resets the local state and wipes `localStorage`.
* Used Tailwind CSS and Lucide icons to match the pre-existing visual design.

Tradeoffs & Assumptions:
* Assumption: Users want a quick way to find files they recently generated without digging into their file system.
* Standard Approach: Create a global React Context for history, maybe even sync with a database. (Too complex)
* Lateral Approach: Create a new API route to scan `public/downloads` and return available files. (Adds backend surface area)
* Minimalist Approach (Chosen): Store a list of generated files (name, url, timestamp) in `localStorage` when generation succeeds. Read this list in a `useEffect` and render a small list in the UI. Very minimal risk, no backend changes needed.

Testing Instructions:
1. Run `npm run dev` in the `web-ui` directory.
2. Go to `http://localhost:3000`.
3. Input some text on the Text Input tab and hit Start Generation.
4. When complete, the download card will appear, and below it, the "Recent Generations" history will appear with the new file.
5. Refresh the page to verify that the history persists.
6. Generate another file to see the new item appended at the top of the history list.
7. Click the "Clear" button to verify that the history is wiped.

Action Item: `git commit -am "feat: Recent Generations History"` and push to `origin feature/recent-generations-history`.
