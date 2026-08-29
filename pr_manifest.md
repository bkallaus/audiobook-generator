PR Title: feat: Voice Gender Filter

The Problem Solved: Users had to scroll through the full list of voices to find a specific gender. This feature adds a simple, inline toggle to filter the voice list by 'All', 'Female', or 'Male', improving selection speed and usability.

Visuals:
![All Voices](/home/jules/verification/screenshots/voice_picker_all.png)
![Female Voices](/home/jules/verification/screenshots/voice_picker_female.png)
![Male Voices](/home/jules/verification/screenshots/voice_picker_male.png)

Implementation Journey:
* Confirmed no duplication (checked existing branches).
* Added `genderFilter` state to `VoicePicker`.
* Applied filtering logic to the `VOICES` array before mapping.
* Added a minimalist UI toggle using pill buttons above the voice list.
* Verified functionality locally using a Playwright script.

Tradeoffs & Assumptions:
* Assumption: Users often have a preference for voice gender before selecting a specific model.
* Standard Approach: A dropdown filter (Requires more clicks).
* Minimalist Approach (Chosen): Inline pill buttons. Faster interaction, visible state, fits perfectly in the existing UI block.
* Lateral Approach: Advanced search/filter modal (Overkill for a small list).

Testing Instructions:
1. Run `npm run dev` in the `web-ui` directory.
2. Go to `http://localhost:3000`.
3. In the "Voice Model" section, test clicking the "Female" and "Male" buttons.
4. Verify the list updates immediately to show only the corresponding voices.
5. Verify clicking "All" resets the list.

Action Item: git push origin feature/voice-gender-filter && gh pr create -F pr_manifest.md
