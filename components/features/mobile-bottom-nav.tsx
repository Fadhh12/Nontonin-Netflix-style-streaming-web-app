"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bookmark, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/browse", label: "Beranda", icon: Home },
  { href: "/search", label: "Cari", icon: Search },
  { href: "/my-list", label: "My List", icon: Bookmark },
  { href: "/profiles", label: "Profil", icon: UserRound },
];

/** Fixed bottom nav replacing the desktop navbar links on mobile (SRS 4.4). */
export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex h-[62px] items-center justify-around border-t border-border bg-bg/97 md:hidden"
      aria-label="Navigasi utama"
    >
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-1 text-[10px]",
              active ? "text-primary" : "text-[#92929e]",
            )}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
