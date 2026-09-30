"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

const INITIAL_STATE: AuthActionState = { error: null };

/** S03. Field-level errors from Zod (SRS 2.3), plus "Email sudah terdaftar" on conflict. */
export function RegisterForm() {
  const [state, formAction, pending] = useActionState(signUp, INITIAL_STATE);

  return (
    <div className="w-full max-w-[420px] rounded-xl border border-border bg-surface p-8">
      <h1 className="mb-1 text-2xl font-bold text-text">Buat akun Nontonin</h1>
      <p className="mb-6 text-xs text-muted">Mulai jelajahi film dan series favoritmu.</p>

      <form action={formAction}>
        <label htmlFor="email" className="mb-1.5 block text-xs text-[#c8c8d0]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="nama@email.com"
          required
          className="mb-1 h-11 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        {state.fieldErrors?.email && (
          <p className="mb-3 text-xs text-error">{state.fieldErrors.email}</p>
        )}

        <label htmlFor="password" className="mb-1.5 mt-3 block text-xs text-[#c8c8d0]">
          Kata sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="mb-1 h-11 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        {state.fieldErrors?.password && (
          <p className="mb-3 text-xs text-error">{state.fieldErrors.password}</p>
        )}

        <label
          htmlFor="confirmPassword"
          className="mb-1.5 mt-3 block text-xs text-[#c8c8d0]"
        >
          Konfirmasi kata sandi
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          className="mb-2 h-11 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        {state.fieldErrors?.confirmPassword && (
          <p className="mb-3 text-xs text-error">{state.fieldErrors.confirmPassword}</p>
        )}

        {state.error && <p className="mb-4 text-sm text-error">{state.error}</p>}

        <Button type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "Memproses..." : "Daftar"}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-muted">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
