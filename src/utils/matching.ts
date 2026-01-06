import type { Swipe, User } from "../types";

import { SUBJECTS } from "../data";

/**
 * Wynik dopasowania - użytkownik z jego wynikiem podobieństwa
 */
export interface MatchResult {
  user: User;
  similarity: number; // liczba wspólnych zainteresowań
  commonInterests: string[]; // ID wspólnych przedmiotów
  calculation: CalculationStep[]; // kroki obliczeń do wizualizacji
}

/**
 * Krok obliczenia - do wizualizacji mnożenia wektorów
 */
export interface CalculationStep {
  subjectId: string;
  currentUserValue: number; // 0 lub 1
  otherUserValue: number; // 0 lub 1
  product: number; // wynik mnożenia
}

/**
 * Tworzy wektor zainteresowań dla użytkownika
 * Wektor ma długość = liczba przedmiotów, wartości 0/1
 */
export function createInterestVector(user: User): number[] {
  return SUBJECTS.map((subject) =>
    user.interests.includes(subject.id) ? 1 : 0
  );
}

/**
 * Oblicza iloczyn skalarny dwóch wektorów (dot product)
 * Jest to podstawa obliczenia podobieństwa w macierzy U × Uᵀ
 */
export function dotProduct(vec1: number[], vec2: number[]): number {
  return vec1.reduce((sum, val, idx) => sum + val * vec2[idx], 0);
}

/**
 * Oblicza szczegółowe podobieństwo między dwoma użytkownikami
 * Zwraca kroki obliczeń do wizualizacji
 */
export function calculateDetailedSimilarity(
  currentUser: User,
  otherUser: User
): MatchResult {
  const calculation: CalculationStep[] = [];
  const commonInterests: string[] = [];
  let similarity = 0;

  for (const subject of SUBJECTS) {
    const currentUserValue = currentUser.interests.includes(subject.id) ? 1 : 0;
    const otherUserValue = otherUser.interests.includes(subject.id) ? 1 : 0;
    const product = currentUserValue * otherUserValue;

    calculation.push({
      subjectId: subject.id,
      currentUserValue,
      otherUserValue,
      product,
    });

    if (product === 1) {
      commonInterests.push(subject.id);
      similarity++;
    }
  }

  return {
    user: otherUser,
    similarity,
    commonInterests,
    calculation,
  };
}

/**
 * Sortuje użytkowników według dopasowania do aktualnego użytkownika
 * Wykorzystuje mnożenie macierzy: S = U × Uᵀ
 *
 * @param currentUser - aktualny użytkownik
 * @param allUsers - wszyscy użytkownicy w puli (bez aktualnego)
 * @returns lista użytkowników posortowana od najlepiej do najgorzej dopasowanych
 */
export function getSortedMatches(
  currentUser: User,
  allUsers: User[]
): MatchResult[] {
  // Filtrujemy aktualnego użytkownika
  const otherUsers = allUsers.filter((u) => u.id !== currentUser.id);

  // Obliczamy podobieństwo dla każdego użytkownika
  const results = otherUsers.map((user) =>
    calculateDetailedSimilarity(currentUser, user)
  );

  // Sortujemy malejąco według podobieństwa
  return results.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Tworzy pełną macierz podobieństwa wszystkich użytkowników
 * Macierz S = U × Uᵀ
 */
export function createSimilarityMatrix(users: User[]): number[][] {
  const matrix: number[][] = [];

  for (const user1 of users) {
    const row: number[] = [];
    for (const user2 of users) {
      if (user1.id === user2.id) {
        // Przekątna - użytkownik z samym sobą
        row.push(user1.interests.length);
      } else {
        const vec1 = createInterestVector(user1);
        const vec2 = createInterestVector(user2);
        row.push(dotProduct(vec1, vec2));
      }
    }
    matrix.push(row);
  }

  return matrix;
}

/**
 * Sprawdza czy istnieje swipe od jednego użytkownika do drugiego
 */
export function getSwipe(
  swipes: Swipe[],
  fromId: string,
  toId: string
): Swipe | undefined {
  return swipes.find((s) => s.visitorId === fromId && s.targetId === toId);
}

/**
 * Sprawdza czy jest match między dwoma użytkownikami
 * Match występuje gdy oba warunki są spełnione: L[i][j] = 1 AND L[j][i] = 1
 */
export function isMatch(
  swipes: Swipe[],
  user1Id: string,
  user2Id: string
): boolean {
  const swipe1 = getSwipe(swipes, user1Id, user2Id);
  const swipe2 = getSwipe(swipes, user2Id, user1Id);
  return swipe1?.liked === true && swipe2?.liked === true;
}

/**
 * Generuje losowe swipes od innych użytkowników do aktualnego użytkownika
 * Trzeci użytkownik (index 2) zawsze lubi aktualnego użytkownika - gwarantuje match
 */
export function generateMockSwipes(
  mockUsers: User[],
  currentUserId: string,
  guaranteeMatchAtIndex: number = 2
): Swipe[] {
  const swipes: Swipe[] = [];

  mockUsers.forEach((user, index) => {
    // Trzeci użytkownik (lub wskazany index) zawsze lubi
    const liked = index === guaranteeMatchAtIndex ? true : Math.random() > 0.5;

    swipes.push({
      visitorId: user.id,
      targetId: currentUserId,
      liked,
      timestamp: Date.now() - Math.random() * 86400000,
    });
  });

  return swipes;
}

/**
 * Tworzy nowy swipe
 */
export function createSwipe(
  visitorId: string,
  targetId: string,
  liked: boolean
): Swipe {
  return {
    visitorId,
    targetId,
    liked,
    timestamp: Date.now(),
  };
}
