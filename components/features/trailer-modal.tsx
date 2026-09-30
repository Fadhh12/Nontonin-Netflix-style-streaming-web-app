"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface TrailerModalProps {
  open: boolean;
  onClose: () => void;
  /** YouTube embed URL, or null when no trailer exists (SRS FR-D2). */
  embedUrl: string | null;
  title: string;
}

/**
 * S09 Trailer modal. Traps focus, closes on Esc or backdrop click, and
 * returns focus to the trigger on close (PROJECT_PLAN.md 4.5).
 */
export function TrailerModal({ open, onClose, embedUrl, title }: TrailerModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement;
      closeButtonRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Trailer ${title}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-overlay p-5 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[960px] overflow-hidden rounded-xl border border-border bg-black shadow-2xl">
        <div className="relative aspect-video bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`Trailer ${title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted">
              Trailer belum tersedia
            </div>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
        <div className="px-5 py-4">
          <p className="text-sm font-semibold text-text">{title}</p>
        </div>
      </div>
    </div>
  );
}
