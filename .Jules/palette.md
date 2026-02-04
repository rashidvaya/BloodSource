## 2025-05-15 - [Accessible Input Icon Buttons]
**Learning:** For inputs with absolutely positioned icon buttons (like password toggles), using `sr-only` labels on the `FormItem` and increasing the input's `pr-14` while setting the button to `right-1` ensures a large (44x44px) touch target without overlapping text or cluttering the UI.
**Action:** Use `FormLabel className="sr-only"`, `Input className="pr-14"`, and `button className="right-1 min-w-[44px] min-h-[44px]"` for all future input-internal action buttons.
