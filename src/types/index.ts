/**
 * Przedmiot/zainteresowanie na studiach
 */
export interface Subject {
  id: string;
  name: string;
  emoji: string;
}

/**
 * Użytkownik w systemie
 */
export interface User {
  id: string;
  name: string;
  avatar: string; // identyfikator avatara
  interests: string[]; // lista ID przedmiotów
  createdAt: number;
}

/**
 * Swipe - ocena użytkownika przez innego użytkownika
 */
export interface Swipe {
  visitorId: string; // kto ocenia
  targetId: string; // kogo ocenia
  liked: boolean; // true = polubił, false = odrzucił
  timestamp: number;
}

/**
 * Match - wzajemne polubienie
 */
export interface Match {
  user1Id: string;
  user2Id: string;
  matchedAt: number;
}

/**
 * Avatar dostępny do wyboru
 * Pliki graficzne: public/avatars/{id}.png
 */
export interface Avatar {
  id: string;
  emoji: string; // fallback gdy brak pliku
  label: string;
}

/**
 * Stan aplikacji w LocalStorage
 */
export interface AppState {
  users: User[];
  swipes: Swipe[];
  matches: Match[];
  currentUserId: string | null;
}
