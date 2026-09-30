"use client";

import { useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { MediaCard } from "@/components/features/media-card";
import { Button } from "@/components/ui/button";
import type { Title } from "@/lib/tmdb/mappers";

type SearchStatus = "idle" | "loading" | "success" | "empty" | "error";

interface SearchResponse {
  page: number;
  totalPages: number;
  results: Title[];
}

const DEBOUNCE_MS = 400;

/** S10 Search — 400ms debounce, 20/page, "Muat lebih banyak" (SRS FR-S1). */
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [results, setResults] = useState<Title[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function runSearch(q: string, pageToLoad: number, append: boolean) {
    setStatus("loading");
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&page=${pageToLoad}`,
      );
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const data: SearchResponse = await res.json();
      setResults((prev) => (append ? [...prev, ...data.results] : data.results));
      setPage(data.page);
      setTotalPages(data.totalPages);
      setStatus(data.results.length === 0 && !append ? "empty" : "success");
    } catch {
      setStatus("error");
    }
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setStatus("idle");
      setResults([]);
    }
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    debounceRef.current = setTimeout(() => {
      void runSearch(trimmed, 1, false);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-28 md:px-16">
      <div className="relative mx-auto mb-10 max-w-xl">
        <SearchIcon
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          strokeWidth={1.75}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Cari film atau series..."
          aria-label="Cari film atau series"
          className="h-12 w-full rounded-[8px] border border-border bg-surface pl-12 pr-4 text-sm text-text outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      {status === "idle" && (
        <p className="text-center text-sm text-muted">
          Ketik minimal 2 karakter untuk mulai mencari.
        </p>
      )}

      {status === "error" && (
        <p className="text-center text-sm text-muted">
          Gagal memuat hasil pencarian. Coba lagi.
        </p>
      )}

      {status === "empty" && (
        <p className="text-center text-sm text-muted">
          Tidak ada hasil untuk &quot;{query.trim()}&quot;
        </p>
      )}

      {(status === "success" || (status === "loading" && results.length > 0)) && (
        <>
          <h2 className="mb-4 text-sm font-bold text-text">Hasil pencarian</h2>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
            {results.map((title) => (
              <MediaCard
                key={`${title.mediaType}-${title.id}`}
                title={title}
                className="w-full"
              />
            ))}
          </div>

          {page < totalPages && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                disabled={status === "loading"}
                onClick={() => void runSearch(query.trim(), page + 1, true)}
              >
                Muat lebih banyak
              </Button>
            </div>
          )}
        </>
      )}

      {status === "loading" && results.length === 0 && (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-2/3 w-full animate-pulse rounded-[8px] bg-surface"
            />
          ))}
        </div>
      )}
    </div>
  );
}
