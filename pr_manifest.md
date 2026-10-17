PR Title: feat: Lock UI During Generation

The Problem Solved: Prevents users from accidentally changing settings, uploading a new file, or typing in the text area while a generation process is actively running, thereby avoiding confusing UI states where changes might seem part of the current job.

Visuals:
- Local Playwright tests were run to generate screenshots of the locked and unlocked state. They were verified to work properly.

Implementation Journey:
- Wrapped the configuration settings in a container div with Tailwind classes (`opacity-50 pointer-events-none`) toggled by the `loading` state.
- Passed `disabled: loading` explicitly to the `useDropzone` configuration.
- Passed `disabled={loading}` to the text area input for added tab-focus protection.

Tradeoffs & Assumptions:
- **Assumption:** Disabling the dropzone completely and making the components un-clickable is better than letting users "queue" up next jobs while the current one is running (which wasn't supported anyway).
- **Paths brainstormed:**
  1. Add `disabled` prop to all individual components (requires editing `VoicePicker`).
  2. Use a Tailwind overlay / pointer-events-none class on a container wrapper.
  3. Hide the configuration completely and show a skeleton.
- **Why Path 2 was chosen:** It provides visual feedback (faded out inputs) and effectively locks the components without requiring modifications to any internal child components like `VoicePicker`.

Testing Instructions:
1. Start the Next.js development server locally.
2. Visit `http://localhost:3000`.
3. Drop an EPUB file or paste text, select your desired voice/speed/format.
4. Click 'Start Generation'.
5. Observe that the entire configuration panel fades slightly (`opacity-50`) and prevents you from making any changes to text, voice, speed, format, or uploading a new file until the generation completes or is stopped.
6. Click 'Stop Generation' and observe the inputs unlock.

Action Item: git push origin feature/lock-ui-during-generation-nova && gh pr create -F pr_manifest.md
