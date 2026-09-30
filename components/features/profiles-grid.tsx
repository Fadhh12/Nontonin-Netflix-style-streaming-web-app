"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AvatarCircle } from "./avatar-circle";
import { ProfileFormModal } from "./profile-form-modal";
import { selectProfile } from "@/lib/actions/profiles";
import { MAX_PROFILES_PER_ACCOUNT } from "@/lib/validators/profile";
import type { ActiveProfile } from "@/lib/actions/profile-cookie";

type ProfileRow = Omit<ActiveProfile, "avatarKey"> & {
  avatarKey: ActiveProfile["avatarKey"];
};

/** S04 "Siapa yang menonton?" grid, plus S05 create/edit as a modal on top. */
export function ProfilesGrid({ profiles }: { profiles: ProfileRow[] }) {
  const [managing, setManaging] = useState(false);
  const [modal, setModal] = useState<
    { mode: "create" } | { mode: "edit"; profile: ProfileRow } | null
  >(null);

  const atLimit = profiles.length >= MAX_PROFILES_PER_ACCOUNT;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="mb-2 font-heading text-lg font-extrabold text-white">
        Nonton<span className="text-primary">in</span>
      </p>
      <h1 className="mb-10 text-3xl font-bold text-text">Siapa yang menonton?</h1>

      <div className="flex flex-wrap justify-center gap-7">
        {profiles.map((profile) =>
          managing ? (
            <button
              key={profile.id}
              type="button"
              onClick={() => setModal({ mode: "edit", profile })}
              className="w-[110px] text-center text-xs text-[#d8d8df]"
            >
              <AvatarCircle
                avatarKey={profile.avatarKey}
                className="mx-auto mb-2.5 border-2 border-primary"
              />
              {profile.name}
            </button>
          ) : (
            <form key={profile.id} action={selectProfile.bind(null, profile.id)}>
              <button
                type="submit"
                className="group w-[110px] text-center text-xs text-[#d8d8df] focus-visible:outline-none"
              >
                <AvatarCircle
                  avatarKey={profile.avatarKey}
                  className="mx-auto mb-2.5 border-2 border-transparent transition-colors group-hover:border-primary group-focus-visible:border-primary"
                />
                {profile.name}
              </button>
            </form>
          ),
        )}

        <button
          type="button"
          disabled={atLimit}
          onClick={() => setModal({ mode: "create" })}
          className="w-[110px] text-center text-xs text-muted disabled:opacity-40"
        >
          <div className="mx-auto mb-2.5 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-surface-alt">
            <Plus className="h-8 w-8" strokeWidth={1.75} />
          </div>
          Tambah profil
        </button>
      </div>

      {atLimit && (
        <p className="mt-6 text-xs text-muted">
          Maksimal {MAX_PROFILES_PER_ACCOUNT} profil per akun.
        </p>
      )}

      <button
        type="button"
        onClick={() => setManaging((v) => !v)}
        className="mt-10 rounded-[8px] border border-border px-5 py-2.5 text-sm text-text hover:bg-white/5"
      >
        {managing ? "Selesai" : "Kelola profil"}
      </button>

      {modal && (
        <ProfileFormModal
          mode={modal.mode}
          profile={modal.mode === "edit" ? modal.profile : undefined}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
