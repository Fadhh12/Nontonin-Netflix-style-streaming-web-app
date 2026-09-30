import { z } from "zod";

// Exact rules and Indonesian messages from PROJECT_PLAN.md SRS 2.3.
const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Format email tidak valid")
  .email("Format email tidak valid");

const password = z
  .string()
  .min(8, "Kata sandi minimal 8 karakter dan memuat huruf dan angka")
  .max(72, "Kata sandi minimal 8 karakter dan memuat huruf dan angka")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d).+$/,
    "Kata sandi minimal 8 karakter dan memuat huruf dan angka",
  );

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Email atau kata sandi salah"),
});

export const registerSchema = z
  .object({
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak sama",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
