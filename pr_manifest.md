PR Title: feat: User Preference Persistence

The Problem Solved: Users previously had to re-select their preferred voice, speed, and format every time they visited the application. This feature uses `localStorage` to persist those settings automatically, streamlining the user experience.

Visuals:
![Before Reload](/home/jules/verification/screenshots/before_reload.png)
![After Reload](/home/jules/verification/screenshots/after_reload.png)

Implementation Journey:
* Added a `useRef` and `useEffect` in `web-ui/src/app/page.tsx` to read `localStorage` values on the client-side after the initial mount, preventing hydration errors.
* Added a second `useEffect` to watch the state variables and write to `localStorage`, skipping the very first mount cycle to avoid overwriting saved data with defaults.
* Verified the persistence manually via Playwright script testing.
* Maintained surgical precision by keeping all existing un-related code intact.

Tradeoffs & Assumptions:
* Assumption: We only want to persist basic UI states. Things like input text or files are ephemeral and should not be saved.
* Standard Approach: Use a full state management library like Zustand with persistence middleware. (Overkill)
* Minimalist Approach (Chosen): React `useEffect` + raw `localStorage`. Simple, zero new dependencies, effectively solves the immediate problem.
* Lateral Approach: Save settings to server-side cookies or a database. (Adds unnecessary complexity for a local-first application).

Testing Instructions:
1. Run `npm run dev` in the `web-ui` folder.
2. Go to `http://localhost:3000`.
3. Change the voice, speed, and format from their defaults.
4. Reload the page.
5. Verify that your selections remain exactly as you left them.

Action Item: `git push origin feature/persist-settings`
