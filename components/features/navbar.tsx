"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const LINKS = [
  { href: "/browse", label: "Beranda" },
  { href: "/browse?type=movie", label: "Film" },
  { href: "/browse?type=tv", label: "Series" },
  { href: "/my-list", label: "My List" },
];

/**
 * Fixed navbar: transparent over the hero, solid surface after scrolling
 * (PROJECT_PLAN.md 4.1, MASTER_DESIGN section 06). 68px tall, logo left,
 * actions right, no boxed pill menu.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 30);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-30 flex h-[68px] items-center gap-8 px-6 transition-colors duration-200 md:px-16",
        scrolled
          ? "bg-bg/96 backdrop-blur-md border-b border-border"
          : "bg-gradient-to-b from-bg/90 to-transparent",
      )}
    >
      <Link
        href="/browse"
        className="font-heading text-xl font-extrabold tracking-tight text-white"
      >
        Nonton<span className="text-primary">in</span>
      </Link>

      <nav className="hidden items-center gap-6 text-sm text-[#c7c7d0] md:flex">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-white">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/search"
          aria-label="Cari"
          className="flex h-10 w-10 items-center justify-center rounded-[8px] text-white hover:bg-white/10"
        >
          <Search className="h-5 w-5" strokeWidth={1.75} />
        </Link>
        <Link
          href="/profiles"
          aria-label="Profil"
          className="hidden h-8 w-8 items-center justify-center rounded-full border-2 border-white/40 bg-gradient-to-br from-[#ff9a62] to-[#6d3e9e] text-white md:flex"
        >
          <UserRound className="h-4 w-4" strokeWidth={2} />
        </Link>
        <Link
          href="/login"
          className={cn(buttonVariants({ size: "sm" }), "hidden md:inline-flex")}
        >
          Coba Demo
        </Link>
      </div>
    </header>
  );
}
