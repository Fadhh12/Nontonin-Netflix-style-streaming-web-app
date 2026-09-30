import { AVATAR_KEYS } from "@/lib/validators/profile";

/** Gradient per preset avatar key — no image assets needed for the 8 presets (SRS 2.3). */
export const AVATAR_GRADIENTS: Record<(typeof AVATAR_KEYS)[number], string> = {
  coral: "from-[#ff9a62] to-[#ff5f6d]",
  violet: "from-[#a78bfa] to-[#6d3e9e]",
  teal: "from-[#5eead4] to-[#0f766e]",
  amber: "from-[#fcd34d] to-[#d97706]",
  rose: "from-[#fda4af] to-[#be123c]",
  indigo: "from-[#818cf8] to-[#3730a3]",
  lime: "from-[#bef264] to-[#4d7c0f]",
  sky: "from-[#7dd3fc] to-[#0369a1]",
};
