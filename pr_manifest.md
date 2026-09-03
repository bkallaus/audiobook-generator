PR Title: feat: Drag and Drop TXT support in Text Input

The Problem Solved: Users previously had to manually open their text files and copy-paste the contents into the text area. This feature adds direct drag-and-drop support for `.txt` files in the Text Input mode, instantly loading the file's content into the text area.

Visuals:
![Text Input Dropped](/home/jules/verification/screenshots/text_input_dropped.png)

Implementation Journey:
* Confirmed no duplication (checked existing branches).
* Added `isTextDragActive` state to track drag events on the text area wrapper.
* Added `onDragOver`, `onDragLeave`, and `onDrop` handlers to seamlessly capture `.txt` files.
* Integrated `FileReader` to read dropped file contents directly into the `textInput` state.
* Updated styling to provide visual feedback (blue dashed border and background) when dragging over the area.
* Verified functionality locally using a headless Playwright script.
* Ensured clean commit without local build artifacts.

Tradeoffs & Assumptions:
* Assumption: Users want a fast way to load text files without switching back to the "File Upload" mode if they only have raw text.
* Standard Approach: Wrap the entire text area in a `react-dropzone` component. (Requires more dependency wiring).
* Minimalist Approach (Chosen): Native HTML5 Drag and Drop events directly on the wrapper `div`. Clean, zero-dependency, surgical change.
* Lateral Approach: Unify the "File Upload" and "Text Input" tabs completely into a single dropzone. (Scope creep, changes too much UI).

Testing Instructions:
1. Run `npm run dev` in the `web-ui` directory.
2. Go to `http://localhost:3000`.
3. Switch the toggle to "Text Input".
4. Drag a `.txt` file from your computer and drop it directly onto the textarea.
5. Verify the textarea highlights while dragging.
6. Verify the file's contents populate the textarea upon dropping.

Action Item: git push origin feature/drag-drop-txt-into-textarea && gh pr create -F pr_manifest.md
