import type React from "react";
import Link from "next/link";

/** Shared chrome for /login and /register: cinematic background, wordmark, centered card. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-16"
      style={{
        backgroundImage:
          "linear-gradient(rgba(11,11,15,.85), rgba(11,11,15,.95)), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=85')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Link
        href="/"
        className="mb-8 font-heading text-xl font-extrabold tracking-tight text-white"
      >
        Nonton<span className="text-primary">in</span>
      </Link>
      {children}
    </div>
  );
}
