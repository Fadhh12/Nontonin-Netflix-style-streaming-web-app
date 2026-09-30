import type { Metadata } from "next";
import { LoginForm } from "@/components/features/login-form";

export const metadata: Metadata = { title: "Masuk — Nontonin" };

interface PageProps {
  searchParams: Promise<{ returnTo?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { returnTo } = await searchParams;
  return <LoginForm returnTo={returnTo} />;
}
