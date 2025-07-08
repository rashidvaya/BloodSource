import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";

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
  "Advertising",
  "Developers",
  "Settings",
];

export default function Footer() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <footer className="w-full bg-white border-t border-facebook-border py-4">
      <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-neutral-400">
        {links.map((link, idx) => (
          <React.Fragment key={link}>
            {link === "Careers" ? (
              <Link href="/career" className="hover:underline">{t(link)}</Link>
            ) : (
              <a href="#" className="hover:underline">{t(link)}</a>
            )}
            {idx < links.length - 1 && <span className="mx-1">|</span>}
          </React.Fragment>
        ))}
        <span className="mx-1">|</span>
        <span className="text-neutral-500">© 2025 RedByte Corp.</span>
      </div>
    </footer>
  );
} 