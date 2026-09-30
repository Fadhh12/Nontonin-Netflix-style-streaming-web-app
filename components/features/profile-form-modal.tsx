"use client";

import { useActionState, useEffect, useState } from "react";
import { X } from "lucide-react";
import { AVATAR_KEYS } from "@/lib/validators/profile";
import { AvatarCircle } from "./avatar-circle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  createProfile,
  deleteProfile,
  updateProfile,
  type ProfileActionState,
} from "@/lib/actions/profiles";

const INITIAL_STATE: ProfileActionState = { error: null };

interface ProfileFormModalProps {
  mode: "create" | "edit";
  profile?: { id: string; name: string; avatarKey: string; isKids: boolean };
  onClose: () => void;
}

/** S05 profile form: create or edit, 8 avatar presets, profil-anak switch, delete with confirm. */
export function ProfileFormModal({ mode, profile, onClose }: ProfileFormModalProps) {
  const action = mode === "edit" && profile ? updateProfile.bind(null, profile.id) : createProfile;
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);
  const [avatarKey, setAvatarKey] = useState(profile?.avatarKey ?? AVATAR_KEYS[0]);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (state.error === null && !state.fieldErrors) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  async function handleDelete() {
    if (!profile) return;
    const result = await deleteProfile(profile.id);
    if (result.error) {
      setDeleteError(result.error);
      setConfirmingDelete(false);
    } else {
      onClose();
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={mode === "create" ? "Tambah profil" : "Ubah profil"}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-overlay p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[420px] rounded-xl border border-border bg-surface p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text">
            {mode === "create" ? "Tambah profil" : "Ubah profil"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="text-muted hover:text-text"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {confirmingDelete ? (
          <div>
            <p className="mb-4 text-sm text-text">Hapus profil ini?</p>
            {deleteError && <p className="mb-3 text-sm text-error">{deleteError}</p>}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setConfirmingDelete(false)}>
                Batal
              </Button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex h-11 items-center justify-center rounded-[8px] bg-error px-5 text-sm font-semibold text-white hover:opacity-90"
              >
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <form action={formAction}>
            <label htmlFor="name" className="mb-1.5 block text-xs text-[#c8c8d0]">
              Nama profil
            </label>
            <input
              id="name"
              name="name"
              defaultValue={profile?.name}
              maxLength={20}
              required
              className="mb-1 h-11 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            {state.fieldErrors?.name && (
              <p className="mb-3 text-xs text-error">{state.fieldErrors.name}</p>
            )}

            <p className="mb-2 mt-4 text-xs text-[#c8c8d0]">Avatar</p>
            <input type="hidden" name="avatarKey" value={avatarKey} />
            <div className="mb-4 grid grid-cols-4 gap-3">
              {AVATAR_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-label={key}
                  aria-pressed={avatarKey === key}
                  onClick={() => setAvatarKey(key)}
                  className="rounded-full focus-visible:outline-none"
                >
                  <AvatarCircle
                    avatarKey={key}
                    size={48}
                    className={cn(
                      "border-2",
                      avatarKey === key ? "border-primary" : "border-transparent",
                    )}
                  />
                </button>
              ))}
            </div>
            {state.fieldErrors?.avatarKey && (
              <p className="mb-3 text-xs text-error">{state.fieldErrors.avatarKey}</p>
            )}

            <label className="mb-5 flex items-center gap-2.5 text-sm text-text">
              <input
                type="checkbox"
                name="isKids"
                defaultChecked={profile?.isKids}
                className="h-4 w-4 accent-primary"
              />
              Profil anak
            </label>

            {state.error && <p className="mb-3 text-sm text-error">{state.error}</p>}

            <div className="flex items-center justify-between gap-3">
              <Button type="submit" disabled={pending}>
                Simpan
              </Button>
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="text-sm font-semibold text-error hover:underline"
                >
                  Hapus profil
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
