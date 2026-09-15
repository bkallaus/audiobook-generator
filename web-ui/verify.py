from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Mock the API route to simulate an error response
    def handle_route(route):
        # Respond with an SSE error chunk
        chunks = [
            '{"type":"status","message":"Starting..."}\n',
            '{"type":"error","error":"Simulated backend error"}\n'
        ]
        route.fulfill(
            status=200,
            headers={"Content-Type": "text/event-stream"},
            body="".join(chunks)
        )

    page.route("**/api/generate", handle_route)

    page.goto("http://localhost:3000")
    page.wait_for_timeout(500)

    # Enter text mode and input
    page.get_by_role("button", name="Text Input").click()
    page.wait_for_timeout(500)
    page.get_by_placeholder("Paste your text here...").fill("Hello world")
    page.wait_for_timeout(500)

    # Start generation
    page.get_by_role("button", name="Start Generation").click()
    page.wait_for_timeout(1000)

    # Wait for the "Retry Generation" button to appear
    page.wait_for_selector('button:has-text("Retry Generation")', timeout=10000)
    page.wait_for_timeout(500)

    # Take screenshot of the final error state
    page.screenshot(path="/home/jules/verification/screenshots/retry-button.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    import os
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
