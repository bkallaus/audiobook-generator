PR Title: feat: Voice Search Filter

The Problem Solved: As the list of available Kokoro voices scales, manually scrolling to find a specific voice becomes inefficient. This feature adds a search input to instantly filter the voice list by name or ID, significantly improving voice selection speed.

Visuals:
![Search Initial](/home/jules/verification/screenshots/voice_search_initial.png)
![Search Active](/home/jules/verification/screenshots/voice_search_active.png)
![Search with Gender Filter](/home/jules/verification/screenshots/voice_search_male.png)

Implementation Journey:
* Confirmed no duplication (checked existing branches).
* Decided on a minimalist inline search input directly above the gender filters.
* Added `searchQuery` state to `VoicePicker`.
* Updated `filteredVoices` logic to filter by search query (matching name or ID, case-insensitive) in addition to the gender filter.
* Verified functionality locally using Playwright (captured screenshots of empty, active, and combined filter states).
* Verified no linting or build errors were introduced.

Tradeoffs & Assumptions:
* Assumption: Users know the name or partial name of the voice they want, making a text search highly valuable.
* Standard Approach: A large, debounced search bar. (Overly complex given the small dataset size).
* Minimalist Approach (Chosen): A small, integrated search input above the gender pills that filters instantly in-memory. Fits existing UI well and is fast.
* Lateral Approach: Keyboard-first filtering without a dedicated input field (Less discoverable for average users).

Testing Instructions:
1. Run `npm run dev` in the `web-ui` directory.
2. Go to `http://localhost:3000`.
3. In the "Voice Model" section, type a name like "Bella" or an ID snippet like "sky" in the search box.
4. Verify the list updates instantly to show matching voices.
5. Combine the search with a gender filter (e.g., search "Adam", click "Female" -> list should be empty; click "Male" -> list should show Adam).

Action Item: git push origin HEAD:refs/heads/feature/voice-search-filter
