PR Title: feat: Expand and Collapse Status Log History

The Problem Solved: Improves visibility into long-running tasks by allowing users to expand the Output Console's status log. This provides access to the full history of generation events rather than artificially limiting the view to the last 6 entries.

Visuals:
- Expanded Log: `/home/jules/verification/screenshots/expanded_log.png`
- Video Demo: `/home/jules/verification/videos/ec61a44437e16435560609e4052091c2.webm`

Implementation Journey:
- Verified that no existing branch duplicates this functionality.
- Added `isLogExpanded` state to `page.tsx`.
- Imported `Maximize2` and `Minimize2` icons from `lucide-react`.
- Updated the "Status Log" header to include an icon button that toggles the expansion state.
- Modified the rendering logic to show all elements when expanded, or slice to the last 6 when collapsed.
- Adjusted container CSS (`overflow-y-auto`, `max-h-[300px]`, and `justify-start`) to enable scrolling and prevent negative-flex-space clipping when expanded.

Tradeoffs & Assumptions:
- **Lateral Path Brainstorming:**
  1. Standard: Toggle state that expands the inline container, mapping all items and adding `overflow-y-auto`.
  2. Minimalist: Hardcode the log to always show 20 items and make it scrollable permanently.
  3. Lateral: Open a floating modal or separate page for the full log history.
- **Decision:** I chose the Standard path. It preserves the clean, minimalist "terminal" look by default, but provides power users the ability to expand the view inline without jarring context switches.
- **Assumption:** Assumed that rendering the full array inline is performant enough given that the typical generation process produces under 100 log events.

Testing Instructions:
1. Start the web UI (`npm run dev`).
2. Navigate to `http://localhost:3000`.
3. Switch to "Text Input", enter some text, and click "Start Generation".
4. Once logs begin appearing, click the expand icon (Maximize2) next to the "Status Log" header.
5. Verify that the container expands, becomes scrollable if logs exceed `max-h-[300px]`, and shows all previous entries.
6. Click the collapse icon (Minimize2) to verify it shrinks back to the last 6 items.

Action Item: git push origin HEAD
