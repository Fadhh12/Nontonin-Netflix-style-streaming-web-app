import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { searchMulti } from "@/lib/tmdb/queries";
import { TmdbError } from "@/lib/tmdb/client";
import { isRateLimited } from "@/lib/rate-limit";

// SDD 3.4: GET /api/search — no auth, q (2-100), page (1-500, else 1).
const querySchema = z.object({
  q: z.string().trim().min(2).max(100),
  page: z.coerce.number().int().min(1).max(500).catch(1),
});

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: { code: "rate_limited", message: "Terlalu banyak permintaan, coba sebentar lagi" } },
      { status: 429 },
    );
  }

  const { searchParams } = request.nextUrl;
  const parsed = querySchema.safeParse({
    q: searchParams.get("q") ?? "",
    page: searchParams.get("page") ?? "1",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "invalid_request", message: "Permintaan tidak valid" } },
      { status: 400 },
    );
  }

  try {
    const result = await searchMulti(parsed.data.q, parsed.data.page);
    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof TmdbError ? 502 : 500;
    return NextResponse.json(
      { error: { code: "tmdb_error", message: "Gagal memuat hasil pencarian" } },
      { status },
    );
  }
}
