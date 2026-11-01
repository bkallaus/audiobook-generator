PR Title: feat: Offline Network Status Indicator

The Problem Solved: Generating audiobooks is highly dependent on backend connectivity. If the user loses their local network connection during or before generation, the system will silently fail or become unresponsive. This feature provides immediate, clear visual feedback via a red warning banner when the user's browser goes offline.

Visuals:
- [Screenshot: Offline Banner](/home/jules/verification/screenshots/verification.png)
- [Video: Offline Toggle](/home/jules/verification/videos/verification.webm)

Implementation Journey:
- Scanned repository for existing feature branches to avoid duplication.
- Brainstormed and evaluated multiple features against the repository baseline, confirming `Offline Status Indicator` as a novel addition.
- Injected `isOffline` state and an offline-checking `useEffect` inside `web-ui/src/app/page.tsx` to handle browser network change events safely without causing Next.js hydration mismatches.
- Handled the UI update by dynamically rendering a fixed, highly visible red banner at the top of the application utilizing `WifiOff` from `lucide-react`.
- Used headless Playwright to toggle context `set_offline(True)` and verify the rendering.

Tradeoffs & Assumptions:
- *Assumption*: We assumed a Next.js environment running with client-side interactions (`'use client'`), allowing `window.navigator` and event listeners directly on the window.
- *Tradeoff*: Did not use a 3rd party hook library (like `react-use`), opting instead to write a clean, native `useEffect` for zero overhead.
- *Brainstorm Paths*:
  1. Add warning toast on generate click (Minimalist).
  2. Implement an always-visible top banner when offline (Standard - Chosen for better visibility).
  3. Lock the entire UI when offline (Lateral - Rejected, too intrusive).

Testing Instructions:
1. Start the Next.js server (`npm run dev`) and open the application.
2. Turn off your Wi-Fi or toggle the network connection via Browser DevTools -> Network -> Offline.
3. Observe the red banner "You are offline..." appearing at the top.
4. Turn the network back on; the banner should instantly disappear.

Action Item: `git push -u origin feature/offline-status-indicator && gh pr create --fill`
