from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            permissions=['clipboard-read', 'clipboard-write'],
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()

        print("Navigating to localhost:3000")
        page.goto("http://localhost:3000")

        # Switch to Text Input
        print("Clicking Text Input mode")
        page.click("text=Text Input")

        # Enter some text
        print("Entering text")
        text = "This is a test of the text saving feature. We want to see if the draft can be saved correctly."
        page.fill("textarea", text)

        # Verify the Save button is visible
        print("Waiting for Save button")
        page.wait_for_selector("button:has-text('Save')", state="visible")

        # Take screenshot of the button
        page.screenshot(path="/home/jules/verification/screenshots/save_button_visible.png")
        print("Screenshot saved to /home/jules/verification/screenshots/save_button_visible.png")

        # Click the Save button and intercept download
        print("Clicking Save button")
        with page.expect_download() as download_info:
            page.click("button:has-text('Save')")

        download = download_info.value
        filename = download.suggested_filename
        print(f"Download suggested filename: {filename}")

        assert filename.startswith("draft-")
        assert filename.endswith(".txt")

        # Read download
        download_path = os.path.join("/home/jules", filename)
        download.save_as(download_path)

        with open(download_path, "r") as f:
            content = f.read()
            assert content == text

        print("Content matches!")
        print("Verification successful.")

        context.close()
        browser.close()

if __name__ == "__main__":
    run()
