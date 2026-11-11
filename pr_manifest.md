PR Title: feat: Voice Picker Search Filter

The Problem Solved: Users previously had to scroll through the entire list of voices to find a specific one. This feature adds a search input field directly in the Voice Picker component, allowing users to instantly filter the list by typing the voice name, drastically improving navigation speed and ease of use.

Visuals:
- Local Screenshot verification available in logs showing the search input filtering down to "Heart".

Implementation Journey:
- Created the feature branch `feature/voice-search-filter`.
- Analyzed existing VoicePicker component structure and states.
- Inserted a text input using the `Search` icon from `lucide-react`.
- Added new `searchQuery` state.
- Updated `filteredVoices` logic to filter both by the existing gender logic and by matching the search query case-insensitively against the voice name.
- Created robust Playwright verification script to confirm visually.

Tradeoffs & Assumptions:
- **Assumption:** Users know the name of the voice they want, or at least a part of it.
- **Architectural approach 1 (Standard):** Create a heavy overarching global search mechanism spanning the app.
- **Architectural approach 2 (Minimalist):** A localized search input strictly living inside `VoicePicker.tsx`, filtering local state before render.
- **Architectural approach 3 (Lateral):** Move the voice list entirely to a full-screen modal with categorization and infinite scrolling.
- **Choice:** Opted for the Minimalist approach. Modifying `VoicePicker.tsx` directly surgically adds the feature where it's needed most without over-engineering complex global state or massive UI shifts, perfectly aligned with the "simplicity first" rule.

Testing Instructions:
1. Start the next dev server via `cd web-ui && npm run dev`.
2. Open http://localhost:3000 in your browser.
3. Observe the "Voice Model" section on the left.
4. Click into the new "Search voices..." input.
5. Type "Sky" or "Adam".
6. Verify the list narrows to just those voices and that their playback features still function identically.

Action Item: git push origin feature/voice-search-filter && gh pr create --title "feat: Voice Picker Search Filter" --body-file pr_manifest.md
