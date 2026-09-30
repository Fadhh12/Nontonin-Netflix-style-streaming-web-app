import Image from "next/image";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import type { Title } from "@/lib/tmdb/mappers";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Full-bleed hero billboard (MASTER_DESIGN sections 07-09): the image fills
 * the section, no card frame, left-to-right + bottom dark gradient so text
 * stays readable over any backdrop.
 *
 * The backdrop is a real next/image with `priority`, not a CSS
 * background-image: a background-image is only discovered after the
 * browser parses the stylesheet, which delayed LCP by seconds in
 * Lighthouse. `priority` emits an eager <link rel="preload"> so the
 * browser starts fetching it immediately.
 */
export function HeroBanner({ title }: { title: Title }) {
  const detailHref = `/title/${title.mediaType}/${title.id}`;

  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden px-6 pb-20 pt-32 md:min-h-[620px] md:px-16">
      {title.backdropUrl && (
        <Image
          src={title.backdropUrl}
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #0B0B0F 0%, rgba(11,11,15,.90) 18%, rgba(11,11,15,.55) 43%, rgba(11,11,15,.10) 70%, rgba(11,11,15,.35) 100%), linear-gradient(0deg, #0B0B0F 0%, transparent 45%)",
        }}
      />

      <div className="relative z-[1] max-w-[600px]">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-primary">
          Featured · Nontonin Original Concept
        </p>
        <h1 className="font-heading text-[clamp(40px,5vw,64px)] font-extrabold leading-[1.03] tracking-[-0.03em] text-white">
          {title.title}
        </h1>
        <div className="mt-4 flex items-center gap-2.5 text-sm text-[#d8d8df]">
          <span>{title.year}</span>
          <span className="h-1 w-1 rounded-full bg-[#777]" />
          <span className="capitalize">
            {title.mediaType === "movie" ? "Movie" : "Series"}
          </span>
          <span className="h-1 w-1 rounded-full bg-[#777]" />
          <span>⭐ {title.rating.toFixed(1)}</span>
        </div>
        <p className="mt-5 max-w-[530px] text-[15px] leading-[1.75] text-[#c0c0ca]">
          {title.overview}
        </p>
        <div className="mt-7 flex gap-3">
          <Link href={detailHref} className={buttonVariants({ variant: "primary" })}>
            <Play className="h-4 w-4 fill-current" strokeWidth={0} />
            Putar Trailer
          </Link>
          <Link
            href={detailHref}
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            <Info className="h-4 w-4" strokeWidth={1.75} />
            Info
          </Link>
        </div>
      </div>
    </section>
  );
}
