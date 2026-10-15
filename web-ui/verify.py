from playwright.sync_api import sync_playwright
import time
import os

os.makedirs('/home/jules/verification/screenshots', exist_ok=True)
os.makedirs('/home/jules/verification/videos', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(record_video_dir="/home/jules/verification/videos")
    page = context.new_page()

    page.goto("http://localhost:3000")
    page.wait_for_selector('text="Start Generation"')

    # Switch to Text Input mode
    page.click('text="Text Input"')

    # Enter text
    page.fill('textarea[placeholder="Paste your text here..."]', "Test text")

    page.evaluate("""
        const originalFetch = window.fetch;
        window.fetch = (url, options) => {
            if (url && typeof url === 'string' && url.includes('/api/generate')) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        // Hang
                    }, 60000);
                });
            }
            return originalFetch(url, options); // fallback
        }
    """)

    # Click generate
    page.click('text="Start Generation"')

    # Wait a bit to ensure state updates
    page.wait_for_timeout(2000)

    # Take screenshot of the "Awake" icon area
    page.screenshot(path="/home/jules/verification/screenshots/awake_icon_final.png", full_page=True)

    context.close()
    browser.close()
