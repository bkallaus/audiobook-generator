PR Title: feat: Word Count Display for Text Input

The Problem Solved: Users pasting text previously only saw a rough time estimate. This feature displays the exact word count alongside the time estimate, giving users concrete feedback on the length of their text input.

Visuals: [Word Count Verification Screenshot](/home/jules/verification/screenshots/verification.png)

Implementation Journey:
- Located the badge rendering logic inside the `textInput` container in `web-ui/src/app/page.tsx`.
- Refactored the inline JSX function to capture the word count logic and prepend it directly to the estimated time string (e.g. `1,250 words (~1m 20s)`).
- Ensured grammatical correctness (e.g., '1 word' vs '2 words').

Tradeoffs & Assumptions:
- Evaluated 3 paths: 1) Standard: integrate word count into the existing time badge. 2) Minimalist: replace time estimate completely. 3) Lateral: show progress bar. Chose Standard to add concrete value without destroying the existing useful time estimate feature.
- Kept the code perfectly inline within the existing Immediately Invoked Function Expression (IIFE) to avoid cluttering the parent component state or introducing new single-use helper functions.

Testing Instructions:
1. Start the next.js development server: `cd web-ui && npm run dev`.
2. Open `http://localhost:3000`.
3. Click on the "Text Input" tab.
4. Type or paste some text into the text area.
5. Look at the bottom right of the text area to see the exact word count alongside the estimated time (e.g., "10 words (~4s)").

Action Item: `git checkout -b feature/word-count-display && git commit -m "feat: Word Count Display for Text Input" && git push -u origin HEAD && gh pr create --title "feat: Word Count Display for Text Input" --body-file pr_manifest.md`
