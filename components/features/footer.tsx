import Link from "next/link";

const LINKS = [
  { href: "/about", label: "Tentang" },
  { href: "/privacy", label: "Privasi" },
  { href: "/terms", label: "Ketentuan" },
  { href: "/help", label: "Bantuan" },
];

/**
 * Compact footer carrying the mandatory TMDB attribution (SRS G06). Keep
 * small — this is a streaming product, not a marketing site (MASTER_DESIGN
 * section 21).
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-border px-6 py-9 pb-24 text-xs text-muted md:px-16 md:pb-9">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-sm font-bold text-white">Nontonin</p>
          <p className="mt-1 max-w-sm">
            Data film &amp; series disediakan oleh{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-text"
            >
              TMDB
            </a>
            . Nontonin tidak memiliki atau meng-host film penuh; hanya trailer resmi dari
            YouTube. This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
        <nav className="flex gap-5">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-text">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
