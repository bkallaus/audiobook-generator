import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();

  console.log("Mocking backend...");
  await page.route('**/api/generate', route => {
    // We just need a slow request so we can click Stop
    return new Promise(resolve => setTimeout(() => {
        route.fulfill({
            status: 200,
            contentType: 'text/event-stream',
            body: '{"type":"progress","progress":10,"chapterIndex":1,"totalChapters":1,"chapterTitle":"Chapter 1"}\n'
        });
        resolve();
    }, 5000));
  });

  console.log("Navigating to app...");
  await page.goto('http://localhost:3000');

  // Wait for the app to load
  await page.waitForSelector('text=Kokoro Audiobook Generator');

  // Input some text
  console.log("Switching to text input...");
  await page.click('button:has-text("Text Input")');
  await page.fill('textarea', 'Hello world, this is a test.');

  // Start generation
  console.log("Starting generation...");
  await page.click('button:has-text("Start Generation")');

  // Wait for Stop Generation to appear
  await page.waitForSelector('button:has-text("Stop Generation")');

  // Take screenshot of normal stop state
  const screenshotDir = path.join(process.cwd(), '../verification/screenshots');
  if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
  }
  await page.screenshot({ path: path.join(screenshotDir, 'normal_stop_button.png') });

  // Click Stop Generation (first time)
  console.log("Clicking Stop Generation (1st time)...");
  await page.click('button:has-text("Stop Generation")');

  // Verify text changed to "Click again to confirm stop"
  console.log("Verifying confirmation text...");
  await page.waitForSelector('button:has-text("Click again to confirm stop")');
  await page.screenshot({ path: path.join(screenshotDir, 'confirm_stop_button.png') });

  // Wait 3 seconds for reset
  console.log("Waiting for timeout to reset...");
  await new Promise(r => setTimeout(r, 3100));

  // Verify text changed back to "Stop Generation"
  console.log("Verifying reset text...");
  await page.waitForSelector('button:has-text("Stop Generation")');

  // Now test actual stop
  console.log("Testing actual abort...");
  await page.click('button:has-text("Stop Generation")');
  await page.click('button:has-text("Click again to confirm stop")');

  // Wait for status to be "Generation stopped by user."
  await page.waitForSelector('text=Generation stopped by user.');

  console.log("Verification complete!");
  await browser.close();
}

run().catch(e => {
  console.error("Test failed:", e);
  process.exit(1);
});
