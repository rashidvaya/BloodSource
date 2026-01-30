from playwright.sync_api import sync_playwright, expect
import os

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Check HomePage
        page.goto("http://localhost:5173")
        desktop_toggle = page.locator('button[aria-label="Show password"]').first
        expect(desktop_toggle).to_be_visible()
        desktop_toggle.click()
        expect(page.locator('button[aria-label="Hide password"]').first).to_be_visible()

        # Check SignupPage
        page.goto("http://localhost:5173/signup")

        # Mocking API responses
        page.route("**/api/verify-invitation", lambda route: route.fulfill(
            status=200,
            body='{"valid": true, "message": "Code verified successfully"}'
        ))

        page.fill('input[placeholder="Invitation code"]', "123456")
        page.locator('button[aria-label="Verify invitation code"]').click()

        # Satisfy step 1
        page.fill('input[placeholder="Full name"]', "John Doe")
        page.fill('input[placeholder="Username"]', "johndoe")
        page.fill('input[placeholder="Email address"]', "test@example.com")
        page.fill('input[placeholder="1xxxxxxxxx"]', "1234567890")
        page.wait_for_selector('input[placeholder="Enter 4-digit code"]')
        page.fill('input[placeholder="Enter 4-digit code"]', "1234")
        page.wait_for_timeout(2000)
        page.get_by_role("button", name="Next").click()

        # Step 2 password toggles
        expect(page.get_by_text("You are on step 2 out of 2")).to_be_visible()
        password_toggle = page.locator('button[aria-label="Show password"]')
        expect(password_toggle).to_be_visible()
        password_toggle.click()
        expect(page.locator('button[aria-label="Hide password"]')).to_be_visible()

        print("Final verification successful.")
        browser.close()

if __name__ == "__main__":
    run_verification()
