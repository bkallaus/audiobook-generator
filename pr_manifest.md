PR Title: feat: URL State Syncing for Bookmarking & Sharing Configurations

The Problem Solved: Allows users to bookmark or share their exact Voice, Speed, and Format configurations by syncing the UI state to URL parameters in real-time, complete with a convenient 'Share Config' copy button.

Visuals: (No screenshots added natively, verified via Playwright headless)

Implementation Journey:
- Refactored `page.tsx` to read `window.location.search` parameters on mount.
- Added a `useEffect` hook to update the URL via `window.history.replaceState` whenever configuration options change.
- Added a "Share Config" button next to the Options Grid to instantly copy the exact current configuration URL.
- Added temporary "Copied Link!" visual feedback.

Tradeoffs & Assumptions:
- **Assumption:** Browser clipboard APIs (`navigator.clipboard`) will be available. We added a try-catch for error boundaries.
- **Tradeoff:** Instead of using Next.js `useRouter` and `useSearchParams` which require complex `<Suspense>` boundaries for static compilation, I chose the native `window.location.search` DOM approach for simplicity and zero impact on Next.js server/static rendering mechanics.
- **Paths brainstormed:** 1. Next.js native hooks (heavy/complex), 2. Native DOM API (chosen), 3. JSON configuration import/export snippet (too complex for user).

Testing Instructions:
1. Start the application locally.
2. Select a new Voice Model, adjust the Speed, or change Output Format.
3. Observe the URL in your browser updating automatically without refreshing the page.
4. Click "Share Config" to copy the URL.
5. Open a new tab and paste the URL. The application should load your chosen configuration immediately.

Action Item: git push origin feature/url-state-syncing-nova-8934521487 && gh pr create --title "feat: URL State Syncing for Bookmarking & Sharing Configurations" --body "$(cat pr_manifest.md)"
