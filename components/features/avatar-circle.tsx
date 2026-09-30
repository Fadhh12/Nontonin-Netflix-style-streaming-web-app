import { AVATAR_GRADIENTS } from "@/lib/avatar-colors";
import type { AVATAR_KEYS } from "@/lib/validators/profile";
import { cn } from "@/lib/utils";

interface AvatarCircleProps {
  avatarKey: (typeof AVATAR_KEYS)[number];
  size?: number;
  className?: string;
}

export function AvatarCircle({ avatarKey, size = 120, className }: AvatarCircleProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "rounded-full bg-gradient-to-br",
        AVATAR_GRADIENTS[avatarKey],
        className,
      )}
    />
  );
}
