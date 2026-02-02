## 2025-05-22 - [Password Toggle Usability]
**Learning:** Increasing the touch target of an absolutely positioned button within an input (like a password toggle) to 44x44px often requires increasing the input's horizontal padding (e.g., to `pr-14`) and adjusting the button's horizontal offset (e.g., to `right-1`) to prevent visual overlap with input text.
**Action:** Always check the input's right padding when implementing standard-compliant touch targets for internal buttons.
