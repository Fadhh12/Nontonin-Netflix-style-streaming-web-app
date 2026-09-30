"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type React from "react";

/**
 * S07 modal shell for the intercepted title-detail route (T2.2). Esc or a
 * backdrop click calls router.back() — since this route only exists via
 * interception, going back returns to whatever page (/browse, /search, ...)
 * the user opened it from, per the SDD's parallel/intercepting design.
 */
export function DetailModalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      // A nested overlay (e.g. TrailerModal, opened from inside this one)
      // also listens for Escape on `document`. Since this shell mounted
      // first, its listener would otherwise fire first and navigate back,
      // closing both at once instead of just the topmost one. Back off
      // when something else is stacked on top and let its own handler
      // close itself instead.
      const openDialogs = document.querySelectorAll('[role="dialog"]').length;
      if (openDialogs > 1) return;
      router.back();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [router]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Detail judul"
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-overlay p-5 pt-16 md:pt-20"
      onClick={(e) => {
        if (e.target === e.currentTarget) router.back();
      }}
    >
      <div className="relative w-full max-w-[850px] rounded-xl border border-border bg-surface shadow-2xl">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => router.back()}
          aria-label="Tutup"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>
        {children}
      </div>
    </div>
  );
}
