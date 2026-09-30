import type { Metadata, Viewport } from "next";
import type React from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Nontonin — Temukan tontonan berikutnya",
  description:
    "Nontonin adalah web streaming bergaya sinematik yang memakai data film dan trailer dari TMDB. Jelajahi film dan series, putar trailer, dan simpan judul favoritmu.",
  appleWebApp: { title: "Nontonin", statusBarStyle: "black-translucent" },
};

// F17: theme-color for the PWA install UI / browser chrome.
export const viewport: Viewport = {
  themeColor: "#0B0B0F",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        {children}
      </body>
    </html>
  );
}
