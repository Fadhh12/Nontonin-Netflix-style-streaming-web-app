import { z } from "zod";

// 8 preset avatars (SRS 2.3 "Avatar"). Keys map to /public/avatars/<key>.svg.
export const AVATAR_KEYS = [
  "coral",
  "violet",
  "teal",
  "amber",
  "rose",
  "indigo",
  "lime",
  "sky",
] as const;

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama profil 1 sampai 20 karakter")
    .max(20, "Nama profil 1 sampai 20 karakter")
    .regex(/^[a-zA-Z0-9 _-]+$/, "Nama profil 1 sampai 20 karakter"),
  avatarKey: z.enum(AVATAR_KEYS, {
    message: "Pilih avatar yang tersedia",
  }),
  isKids: z.boolean().default(false),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const MAX_PROFILES_PER_ACCOUNT = 5;
export const MAX_MY_LIST_ITEMS = 200;
export const MAX_HISTORY_ITEMS = 50;
