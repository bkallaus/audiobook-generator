from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('http://localhost:3000')
        page.wait_for_selector('text="Start Generation"')

        # Click the "Text Input" button
        page.click('text="Text Input"')

        # Wait for a moment to ensure state updates
        page.wait_for_timeout(500)

        # Check active element
        is_focused = page.evaluate('document.activeElement.tagName === "TEXTAREA"')
        print(f"Is textarea focused? {is_focused}")

        browser.close()

if __name__ == '__main__':
    test()
