import type { Avatar } from "../types";

/**
 * Predefiniowana lista avatarów do wyboru
 * Pliki graficzne należy umieścić w: public/avatars/
 */
export const AVATARS: Avatar[] = [
  { id: "avatar-1", emoji: "👤", label: "Avatar 1" },
  { id: "avatar-2", emoji: "👤", label: "Avatar 2" },
  { id: "avatar-3", emoji: "👤", label: "Avatar 3" },
  { id: "avatar-4", emoji: "👤", label: "Avatar 4" },
  { id: "avatar-5", emoji: "👤", label: "Avatar 5" },
  { id: "avatar-6", emoji: "👤", label: "Avatar 6" },
];

/**
 * Pobierz avatar po ID
 */
export function getAvatarById(id: string): Avatar | undefined {
  return AVATARS.find((avatar) => avatar.id === id);
}

/**
 * Pobierz ścieżkę do pliku avatara
 * Pliki powinny być w formacie: public/avatars/{id}.png
 */
export function getAvatarSrc(id: string): string {
  return `/avatars/${id}.png`;
}

/**
 * Pobierz emoji avatara jako fallback (gdy brak pliku)
 */
export function getAvatarEmoji(id: string): string {
  return getAvatarById(id)?.emoji ?? "👤";
}
