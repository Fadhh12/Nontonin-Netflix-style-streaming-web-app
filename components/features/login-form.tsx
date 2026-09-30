"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

const INITIAL_STATE: AuthActionState = { error: null };

/** S02. Generic "Email atau kata sandi salah" on failure (SRS FR-A2) — never reveals which field. */
export function LoginForm({ returnTo }: { returnTo?: string }) {
  const [state, formAction, pending] = useActionState(signIn, INITIAL_STATE);

  return (
    <div className="w-full max-w-[420px] rounded-xl border border-border bg-surface p-8">
      <h1 className="mb-1 text-2xl font-bold text-text">Masuk ke Nontonin</h1>
      <p className="mb-6 text-xs text-muted">Lanjutkan pengalaman menontonmu.</p>

      <form action={formAction}>
        {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}

        <label htmlFor="email" className="mb-1.5 block text-xs text-[#c8c8d0]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="nama@email.com"
          required
          className="mb-4 h-11 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />

        <label htmlFor="password" className="mb-1.5 block text-xs text-[#c8c8d0]">
          Kata sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="mb-2 h-11 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />

        {state.error && <p className="mb-4 text-sm text-error">{state.error}</p>}

        <Button type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "Memproses..." : "Masuk"}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-muted">
        Belum punya akun?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Daftar
        </Link>
      </p>
    </div>
  );
}
