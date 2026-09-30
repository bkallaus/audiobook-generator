PR Title: feat: Collapsible Configuration Panel

The Problem Solved: When generation starts, the UI can feel cramped, especially on smaller screens. This feature adds a collapsible configuration panel that automatically hides when generation begins to focus the UI on the status log and progress bar.

Visuals:
- [Expanded State](/home/jules/verification/screenshots/expanded-fixed.png)
- [Collapsed State](/home/jules/verification/screenshots/collapsed-fixed.png)

Implementation Journey:
- Verified no existing branch implemented this specific feature.
- Replaced the Configuration header with a clickable button incorporating `ChevronUp` and `ChevronDown` from `lucide-react`.
- Added state `isConfigExpanded` to manage visibility.
- Auto-collapse the panel upon starting generation.
- Ensured container does not stretch artificially within the CSS grid by adding `h-fit` to the container class list.

Tradeoffs & Assumptions:
- **Assumed** that users would want the config to collapse automatically when clicking generate to shift focus downward to progress.
- **Paths brainstormed:** 1) Wrapper state + toggle button (Chosen for best UX), 2) Just auto-hide (Too aggressive, user can't re-check settings), 3) Tabbed interface (Breaks desktop view).
- **Chosen path:** Conditional rendering wrapper linked to `isConfigExpanded`, as it balances user control (they can re-expand it manually) and smart defaults (auto-collapses on action).

Testing Instructions:
1. Start the next.js development server locally.
2. Click the Configuration pane header; observe it collapses into just the header bar.
3. Click it again to expand.
4. Input text and click "Start Generation", verify that the config panel automatically collapses.

Action Item: `git push origin feature/collapsible-config-panel-1790751162`
