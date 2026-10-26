1. **Add Edit Text feature for uploaded TXT files**:
   - In `web-ui/src/app/page.tsx`, find the dropzone UI that displays the selected file (`file ? (...)`).
   - Modify the UI to show an "Edit Text" button if the uploaded file is a `.txt` file (`file.name.toLowerCase().endsWith('.txt')`).
   - When clicked, this button will:
     - Stop event propagation.
     - Read the file content as text using `await file.text()`.
     - Set the text content into the `textInput` state.
     - Switch the UI mode to `inputMode = 'text'`.
     - Clear the selected file (`setFile(null)`).
   - Use the `FileText` icon from `lucide-react` (already imported) for the button.

2. **Verify changes using a Playwright script**:
   - Write a `verify.py` script in the `web-ui` directory.
   - The script will start the Next.js dev server, wait for it to initialize, and navigate to the local page.
   - It will mock a `.txt` file upload by setting a mock file on the file input element.
   - It will verify the "Edit Text" button appears and contains the `FileText` icon.
   - It will click the button and verify that the `inputMode` switches to "Text Input" and the textarea contains the file's text.
   - It will also capture a screenshot of the "Edit Text" button.

3. **Complete pre-commit steps**:
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

4. **Submit the PR**:
   - Generate the final `pr_manifest.md` as per the Nova protocol.
   - Submit the branch using the required format and tool.
