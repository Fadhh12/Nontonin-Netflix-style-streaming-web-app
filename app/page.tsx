import Link from "next/link";
import { Compass, Play, Bookmark } from "lucide-react";
import { Navbar } from "@/components/features/navbar";
import { Footer } from "@/components/features/footer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signInDemo } from "@/lib/actions/auth";

const FEATURES = [
  {
    icon: Compass,
    title: "Jelajahi film",
    body: "Temukan film dan series berdasarkan popularitas, rating, dan genre favoritmu.",
  },
  {
    icon: Play,
    title: "Putar trailer",
    body: "Lihat trailer resmi sebelum memutuskan judul mana yang ingin kamu tonton.",
  },
  {
    icon: Bookmark,
    title: "Simpan favorit",
    body: "Tambahkan judul ke My List dan kembali lagi kapan saja.",
  },
];

/** S01 Landing — guest-facing pitch. Logged-in users are redirected to /browse (SRS 4.2). */
export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <section
          className="relative flex min-h-[560px] items-center overflow-hidden px-6 pb-16 pt-32 md:px-16"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #0B0B0F 0%, rgba(11,11,15,.87) 24%, rgba(11,11,15,.28) 66%, rgba(11,11,15,.65) 100%), linear-gradient(0deg, #0B0B0F 0%, transparent 40%), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=85')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-[1] max-w-[600px]">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-primary">
              Featured · Nontonin Original Concept
            </p>
            <h1 className="font-heading text-[clamp(40px,5.2vw,64px)] font-extrabold leading-[1.03] tracking-[-0.03em] text-white">
              Temukan tontonan berikutnya.
            </h1>
            <p className="mt-5 max-w-[530px] text-[15px] leading-[1.75] text-[#c0c0ca]">
              Jelajahi film dan series, putar trailer, dan simpan judul favoritmu dalam satu
              pengalaman streaming yang sederhana dan sinematik.
            </p>
            <div className="mt-7 flex gap-3">
              <Link href="/browse" className={buttonVariants({ variant: "primary" })}>
                Jelajahi
              </Link>
              <form action={signInDemo}>
                <button
                  type="submit"
                  className={cn(buttonVariants({ variant: "secondary" }))}
                >
                  Coba Demo
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-5 border-t border-border px-6 py-14 md:grid-cols-3 md:px-16">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-[10px] border border-border bg-surface p-6"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[10px] bg-primary/15 text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mb-1.5 text-base font-bold text-text">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
