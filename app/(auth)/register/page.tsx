import type { Metadata } from "next";
import { RegisterForm } from "@/components/features/register-form";

export const metadata: Metadata = { title: "Daftar — Nontonin" };

export default function RegisterPage() {
  return <RegisterForm />;
}
