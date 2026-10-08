PR Title: feat: Distraction-Free Focus Mode for Text Input

The Problem Solved: Improves the UX of pasting and editing long chunks of text by allowing the user to maximize the text area into a full-screen, distraction-free overlay.

Visuals:
- Normal View Screenshot: `/home/jules/verification/screenshots/verification.png`
- Focus View Screenshot: `/home/jules/verification/screenshots/verification.png`
- Focus View Video: `/home/jules/verification/videos/a1b4d361872be98f58f62204e2781efb.webm`

Implementation Journey:
- Ran `git branch -a` to ensure the feature did not duplicate existing work.
- Reviewed `page.tsx` and brainstormed several new UX features.
- Selected "Focus Mode" and identified the simplest technical path: adding an `isFullScreenText` React state and modifying the text input's wrapper classes conditionally.
- Imported `Maximize2` and `Minimize2` icons from `lucide-react`.
- Implemented the overlay using Tailwind CSS (`fixed inset-0 z-50 bg-white/95 backdrop-blur-sm`).
- Verified via a Python Playwright script locally, capturing both video and image evidence of the transition.
- Cleaned up development artifacts to ensure a pristine PR.

Tradeoffs & Assumptions:
- **Lateral Path Brainstorming:**
  1. Standard: Add `isFullScreenText` state and use conditional classes (`fixed inset-0`).
  2. Minimalist: Just expand the textarea height to `h-screen` inline (rejected as it breaks grid layout).
  3. Lateral: Render a separate `<dialog>` modal component that syncs text state with the main textarea (rejected as overly complex).
- **Decision:** Chose the Standard path because it is simple, surgical, and leverages Tailwind's utility classes beautifully for the overlay and positioning.
- **Assumption:** Assumed that the text input mode is a primary use case for many users and that they need a way to focus purely on the text without UI clutter.

Testing Instructions:
1. Start the web UI (`npm run dev`).
2. Navigate to `http://localhost:3000`.
3. Click on the "Text Input" tab in the Configuration panel.
4. Hover over the text area. You will see a Maximize icon appear in the top right.
5. Click the Maximize icon to enter Distraction-Free Focus Mode. The textarea will span the entire window.
6. Click the Minimize icon to exit.

Action Item: git push origin HEAD
