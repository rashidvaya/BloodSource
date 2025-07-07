import React from "react";

const links = [
  "About",
  "Download the app",
  "Boka AI",
  "Help Center",
  "Terms of Service",
  "Privacy Policy",
  "Cookie Policy",
  "Accessibility",
  "Ads info",
  "Blog",
  "Careers",
  "English",
  "Bangla",
  "Advertising",
  "Developers",
  "Settings",
  "© 2025 RedByte Corp.",
];

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-facebook-border py-4">
      <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-neutral-400">
        {links.map((link, idx) => (
          <React.Fragment key={link}>
            <a href="#" className="hover:underline">{link}</a>
            {idx < links.length - 1 && <span className="mx-1">|</span>}
          </React.Fragment>
        ))}
        <span className="mx-1">|</span>
        <span className="text-neutral-500">© 2025 X Corp.</span>
      </div>
    </footer>
  );
} 