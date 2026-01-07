import type { Avatar } from "../types";

/**
 * Predefiniowana lista avatarów do wyboru
 * Pliki graficzne w: public/avatars/
 */
export const AVATARS: Avatar[] = [
  { id: "woman1", emoji: "👩", label: "Kobieta 1" },
  { id: "woman2", emoji: "👩", label: "Kobieta 2" },
  { id: "woman3", emoji: "👩", label: "Kobieta 3" },
  { id: "men1", emoji: "👨", label: "Mężczyzna 1" },
  { id: "men2", emoji: "👨", label: "Mężczyzna 2" },
  { id: "men3", emoji: "👨", label: "Mężczyzna 3" },
];

/**
 * Pobierz avatar po ID
 */
export function getAvatarById(id: string): Avatar | undefined {
  return AVATARS.find((avatar) => avatar.id === id);
}

/**
 * Pobierz ścieżkę do pliku avatara
 * Pliki w formacie: public/avatars/{id}.jpg
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
