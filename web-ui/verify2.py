from playwright.sync_api import sync_playwright
import time
import os

os.makedirs('/home/jules/verification/screenshots', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()

    print("Waiting for dev server...")
    time.sleep(15)

    print("Navigating to http://localhost:3000...")
    page.goto('http://localhost:3000')

    page.wait_for_selector('text="Start Generation"')

    # Take screenshot of the new UI
    screenshot_path = '/home/jules/verification/screenshots/voice-preview-volume-final.png'
    page.screenshot(path=screenshot_path, full_page=True)
    print(f"Screenshot saved to {screenshot_path}")

    browser.close()
