"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function LinkedInFooter() {
  const links = [
    { label: "About", href: "#" },
    { label: "Accessibility", href: "#" },
    { label: "Help Center", href: "#" },
    {
      label: "Privacy & Terms",
      href: "#",
      hasDropdown: true,
    },
    { label: "Ad Choices", href: "#" },
    { label: "Advertising", href: "#" },
    {
      label: "Business Services",
      href: "#",
      hasDropdown: true,
    },
    { label: "Get the LinkedIn app", href: "#" },
    { label: "More", href: "#" },
  ];

  return (
    <footer className="w-full max-w-92.5 px-4 py-2 flex flex-col items-center gap-3 text-xs text-[#a0a6ac]">
      {/* Havolalar ro'yxati */}
      <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 text-center">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hover:text-[#70b5f9] hover:underline transition-colors flex items-center gap-0.5"
          >
            <span>{link.label}</span>
            {link.hasDropdown && (
              <ChevronDown className="w-3 h-3 text-[#a0a6ac]" />
            )}
          </Link>
        ))}
      </div>

      {/* Mualliflik huquqi va Logo */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-[#e8e6e3] pt-1">
        <span className="font-bold text-white tracking-tight flex items-center gap-1">
          LinkedIn
        </span>
        <span className="text-[#a0a6ac]">
          LinkedIn Corporation © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
