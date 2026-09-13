PR Title: feat: Format Info Descriptions

The Problem Solved: Users often don't know the practical difference between M4B and MP3 output formats. This adds helpful subtext describing the tradeoffs (chapter support vs standard flat audio) directly underneath the radio selections, along with visually highlighting the active selection using a blue border and background to make the active state obvious.

Visuals:
![M4B Selected](/home/jules/verification/screenshots/format-m4b-selected.png)
![MP3 Selected](/home/jules/verification/screenshots/format-mp3-selected.png)

Implementation Journey:
* Confirmed no existing branches tackled this specific UI/UX enhancement.
* Updated `page.tsx` format selection area to use a vertical flex layout.
* Added concise descriptive paragraphs for M4B and MP3.
* Implemented dynamic Tailwind CSS classes to highlight the selected format option.
* Verified the visual changes locally using a Playwright script.

Tradeoffs & Assumptions:
* Assumption: Users want to know the difference between the formats without navigating away from the form or hovering over obscure icons.
* Standard Approach: Tooltips on hover.
* Minimalist Approach (Chosen): Inline subtext and enhanced active state styling. This avoids hiding critical information and takes advantage of the horizontal space efficiently.
* Lateral Approach: A single toggle switch (M4B / MP3) with dynamic help text displayed below.

Testing Instructions:
1. Run `npm run dev` in the `web-ui` directory.
2. Go to `http://localhost:3000`.
3. In the "Output Format" section, observe the new descriptive text below "M4B (Audiobook)" and "MP3 (Flat)".
4. Click between the two options and verify the blue border and background highlight properly shifts to the selected format.

Action Item: git push origin feature/format-descriptions && gh pr create -F pr_manifest.md
