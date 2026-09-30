import type React from "react";
import { Navbar } from "@/components/features/navbar";
import { Footer } from "@/components/features/footer";
import { MobileBottomNav } from "@/components/features/mobile-bottom-nav";

/** Shared chrome for every public/app screen: navbar, footer, mobile bottom nav. */
export default function AppLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  /** @modal parallel route (T2.2) — the intercepted title-detail modal, or nothing. */
  modal: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileBottomNav />
      {modal}
    </div>
  );
}
