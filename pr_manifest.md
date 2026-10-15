PR Title: feat: Keep Screen Awake during Generation

The Problem Solved: Prevents the device screen from going to sleep during long audiobook generations, ensuring the process isn't interrupted by system power-saving features.

Visuals:
- `awake_icon.png` (captured during Playwright verification)

Implementation Journey:
- Imported `Zap` icon and `useRef` hook.
- Implemented `WakeLockSentinel` logic tied to the `loading` state using `useEffect`.
- Request wake lock when `loading` is true; release it when false.
- Added visual indicator (Awake text and Zap icon) in the status log header when active.

Tradeoffs & Assumptions:
- Assumed `navigator.wakeLock` is available in modern browsers.
- Explored 3 paths: (1) Request on mount (2) Request only while loading (3) Request via manual toggle. Chosen minimalist path 2: Request only while loading and show a subtle visual indicator.
- Used `unknown` for catch blocks to adhere to ESLint `@typescript-eslint/no-explicit-any` rule.

Testing Instructions:
1. Start the application locally with `npm run dev`.
2. Open in a compatible browser (e.g. Chrome/Edge/Safari).
3. Paste text and click "Start Generation".
4. Ensure the "Awake" text and `Zap` icon appear in the status bar next to the elapsed time.
5. Wait for the generation to finish or cancel it, and verify the "Awake" icon disappears, thereby releasing the lock.

Action Item: `git push origin HEAD && gh pr create -F pr_manifest.md`
