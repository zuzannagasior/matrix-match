import type { Avatar } from "../types";

/**
 * Predefiniowana lista avatarów do wyboru
 * Pliki graficzne w: public/avatars/
 */
export const AVATARS: Avatar[] = [
  { id: "woman4", emoji: "👤", label: "Avatar 1" },
  { id: "man4", emoji: "👤", label: "Avatar 2" },
  { id: "woman5", emoji: "👤", label: "Avatar 3" },
  { id: "man5", emoji: "👤", label: "Avatar 4" },
  { id: "woman6", emoji: "👤", label: "Avatar 5" },
  { id: "man6", emoji: "👤", label: "Avatar 6" },
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
  return `${import.meta.env.BASE_URL}avatars/${id}.jpg`;
}

/**
 * Pobierz emoji avatara jako fallback (gdy brak pliku)
 */
export function getAvatarEmoji(id: string): string {
  return getAvatarById(id)?.emoji ?? "👤";
}
