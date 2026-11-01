PR Title: feat: Copy API Request (cURL)

The Problem Solved: Adds a small utility for developers integrating with the backend to easily generate and copy the underlying cURL command mirroring the current UI settings.

Visuals: No screenshot attached, added a small Terminal icon button next to Configuration header.

Implementation Journey:
- Updated `lucide-react` imports with the `Terminal` icon.
- Created local state (`copiedCurl`) to provide feedback when the copy succeeds.
- Wrote `handleCopyCurl` that reads `inputMode`, `textInput`, `file`, `voice`, `speed`, and `format` to construct the CLI command.
- Integrated the new button smoothly into the Configuration panel header.
- Fixed a minor string parsing issue during AST compilation.
- Wrote a local Playwright script to test the interaction and verify accurate clipboard transfer.

Tradeoffs & Assumptions:
- Evaluated multiple distinct ideas: "Voice Pitch Control", "Text to Speech presets", and "Copy API Request". Chose "Copy API Request" due to high value for developers without requiring sweeping/bloated backend modifications (violates Surgical Changes), effectively providing an "API snippet" feature.
- Assumptions: The text length of the `multipart/form-data` `-F text="..."` should be limited if the user pastes very large text, replacing large inputs with `YOUR_TEXT_HERE`. Escaped small texts gracefully.

Testing Instructions:
1. Open the UI locally (http://localhost:3000).
2. Adjust your speed, format, voice, and input settings.
3. Click "Copy cURL" in the Configuration header.
4. Verify your clipboard now contains the correctly formatted multi-part curl request matching your local configuration.

Action Item: Used the standard submission tool.
