## 2025-02-01 - Redundant Global Components
**Learning:** Some components (like FloatingAIButton) might be defined globally in App.tsx but also manually added to specific pages, causing duplication and potential accessibility issues (duplicate IDs/labels).
**Action:** Always check App.tsx or global layout components before adding or modifying a component that appears to be "global".
