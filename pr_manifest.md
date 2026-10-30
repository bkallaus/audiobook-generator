PR Title: feat: Speed Fine-Tuning Controls

The Problem Solved: Users lacked fine-grained control over the playback speed, making it tedious to accurately dial in specific decimal values using just the range slider. We've introduced small - and + adjustment buttons for precise 0.1x steps.

Visuals: [Speed Controls Screenshot](/home/jules/verification/speed_controls.png)

Implementation Journey:
- Imported `Minus` and `Plus` from `lucide-react`.
- Converted the static `{speed}x` label into a flex container wrapping the speed value with `-` and `+` icon buttons.
- Wired the buttons to increment/decrement the `speed` state by exactly 0.1, clamping between 0.5 and 2.0.

Tradeoffs & Assumptions:
- Explored 3 paths: 1) Standard +/- buttons, 2) Number input box, 3) Mouse scroll support. Chose Standard because it perfectly blends with the current styling and is highly discoverable without complex state handling.
- Kept the underlying range slider fully intact for rapid sweeping adjustments.
- Leveraged existing `lucide-react` library so no new dependencies were required.

Testing Instructions:
1. Start the next.js development server: `cd web-ui && npm run dev`.
2. Open `http://localhost:3000`.
3. Locate the "Speed" configuration.
4. Click the `-` and `+` buttons to verify the speed increments or decrements by 0.1x accurately, clamping precisely between 0.5x and 2.0x.

Action Item: `git push -u origin feature/speed-fine-tuning-nova && gh pr create --title "feat: Speed Fine-Tuning Controls" --body-file pr_manifest.md`
