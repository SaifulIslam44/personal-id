"use client";

import { usePathname } from "next/navigation";

export default function ConditionalFooter() {
  const pathname = usePathname();

  const showFooter =
    pathname === "/loading" || pathname === "/profile";

  if (!showFooter) return null;

  return (
    <footer className="app-footer">
      Developed by ST Lifestyle
    </footer>
  );
}
