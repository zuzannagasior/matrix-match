import type { Avatar } from "../types";

/**
 * Predefiniowana lista avatarów do wyboru
 * Pliki graficzne w: public/avatars/
 */
export const AVATARS: Avatar[] = [
  { id: "avatar1", emoji: "👤", label: "Avatar 1" },
  { id: "avatar2", emoji: "👤", label: "Avatar 2" },
  { id: "avatar3", emoji: "👤", label: "Avatar 3" },
  { id: "avatar4", emoji: "👤", label: "Avatar 4" },
  { id: "avatar5", emoji: "👤", label: "Avatar 5" },
  { id: "avatar6", emoji: "👤", label: "Avatar 6" },
];

/**
 * Pobierz avatar po ID
 */
export function getAvatarById(id: string): Avatar | undefined {
  return AVATARS.find((avatar) => avatar.id === id);
}

/**
 * Pobierz ścieżkę do pliku avatara
 * Pliki w formacie: public/avatars/{id}.png (dla avatar1-6) lub .jpg (dla woman/men)
 */
export function getAvatarSrc(id: string): string {
  const extension = id.startsWith("avatar") ? "png" : "jpg";
  return `${import.meta.env.BASE_URL}avatars/${id}.${extension}`;
}

/**
 * Pobierz emoji avatara jako fallback (gdy brak pliku)
 */
export function getAvatarEmoji(id: string): string {
  return getAvatarById(id)?.emoji ?? "👤";
}
