"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/** Per-row failure state — one row failing must not crash the page (SRS AC7). */
export function RowError({ heading }: { heading: string }) {
  const router = useRouter();

  return (
    <section className="mt-9">
      <h2 className="mb-4 text-xl font-bold tracking-tight text-text">{heading}</h2>
      <div className="flex items-center justify-between rounded-[8px] border border-border bg-surface px-5 py-4">
        <p className="text-sm text-muted">Gagal memuat.</p>
        <Button variant="outline" size="sm" onClick={() => router.refresh()}>
          Coba lagi
        </Button>
      </div>
    </section>
  );
}
