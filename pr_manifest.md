PR Title: feat: Custom Output Title

The Problem Solved: Users had no way to name their generated audiobook other than relying on the source file name or a default timestamp. This feature adds an optional "Custom Title" field that overrides the default filename and automatically updates the output file's ID3 metadata and directory name.

Visuals:
![UI Validation Screenshot Before](/home/jules/verification/screenshots/ui_before_submit.png)
![UI Validation Screenshot After](/home/jules/verification/screenshots/ui_after_submit.png)

Implementation Journey:
* Added a `customTitle` state variable and a text input field in the Configuration panel of the UI (`web-ui/src/app/page.tsx`).
* Updated the `handleGenerate` method to append `customTitle` to the `FormData` payload if provided.
* Modified the `/api/generate` endpoint (`web-ui/src/app/api/generate/route.ts`) to intercept the `customTitle` from `FormData`.
* Successfully overridden the default parsed filename with the custom title, letting the existing logic seamlessly handle path generation, file naming, and ID3 metadata stamping.

Tradeoffs & Assumptions:
* Assumption: We want a direct approach that solves both user-facing filenames and ID3 metadata cleanly.
* Standard Approach (Chosen): Append title to FormData and handle naming server-side before processing. Solves all requirements cleanly without duplicate processing.
* Minimalist Approach: Only allow renaming the final downloaded file on the client-side. Rejected because it fails to update the internal ID3 metadata.
* Lateral Approach: Use an LLM to auto-extract a title from the text content. Rejected due to complexity, added latency, and going out of scope of the user request.

Testing Instructions:
1. Run `npm run dev` in the `web-ui` directory.
2. Navigate to `http://localhost:3000`.
3. Select "Text Input" and enter some dummy text.
4. Fill out the new "Custom Title (Optional)" field.
5. Click "Start Generation".
6. Verify the download link and the downloaded file have your custom title, and check the file's ID3 metadata if desired.

Action Item: `gh pr create --title "feat: Custom Output Title" --body-file pr_manifest.md`
