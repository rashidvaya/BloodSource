## 2024-05-22 - [Accessibility Polish for Forms and Buttons]
**Learning:** This application frequently uses icons and placeholders as the primary way to identify form fields and button actions, which is inaccessible for screen reader users. Specifically, password visibility toggles and login inputs lacked associated accessible names.
**Action:** Always verify that form inputs have a corresponding `FormLabel` (using `sr-only` if visual labels are not desired) and that icon-only buttons have descriptive `aria-label` attributes.
