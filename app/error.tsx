"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/** SDD 3.5: one error boundary so an unexpected crash never shows a raw stack trace. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 bg-bg px-6 text-center">
      <h1 className="text-xl font-bold text-text">Terjadi kesalahan</h1>
      <p className="max-w-sm text-sm text-muted">
        Ada yang tidak berjalan sesuai rencana. Coba lagi sebentar.
      </p>
      <Button onClick={reset}>Coba lagi</Button>
    </div>
  );
}
