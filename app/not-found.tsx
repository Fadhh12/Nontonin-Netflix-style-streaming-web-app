import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

/** SRS: "Judul tidak ada di TMDB (404): Halaman 404 khusus dengan tombol kembali ke beranda." */
export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 bg-bg px-6 text-center">
      <p className="font-heading text-6xl font-extrabold text-primary">404</p>
      <h1 className="text-xl font-bold text-text">Halaman tidak ditemukan</h1>
      <p className="max-w-sm text-sm text-muted">
        Judul atau halaman yang kamu cari tidak tersedia.
      </p>
      <Link href="/browse" className={buttonVariants({ variant: "primary" })}>
        Kembali ke beranda
      </Link>
    </div>
  );
}
