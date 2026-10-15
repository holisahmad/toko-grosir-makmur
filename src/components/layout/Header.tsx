"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems, siteConfig, waLink } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-text-primary">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <MessageCircle className="h-4 w-4" />
            Order via WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-button p-3 text-text-primary md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "border-t border-border bg-surface md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav aria-label="Navigasi mobile" className="container-page flex flex-col gap-1 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-button px-3 py-3 text-sm font-medium text-text-primary hover:bg-background"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-2"
          >
            <MessageCircle className="h-4 w-4" />
            Order via WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
