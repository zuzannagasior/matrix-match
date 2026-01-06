import type { User } from "../../types";
import { useMemo } from "react";

import { createSimilarityMatrix } from "../../utils";

interface SimilarityMatrixProps {
  users: User[];
  currentUserId?: string; // podświetl wiersz aktualnego użytkownika
  highlightedUserId?: string; // podświetl kolumnę wybranej propozycji
}

/**
 * Komponent przykładu mnożenia macierzy 2x2
 */
function MatrixExample() {
  return (
    <div className="bg-white/50 rounded-xl p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
        {/* Macierz U */}
        <div className="text-center">
          <p className="text-text-dark/60 mb-1 font-medium">U</p>
          <div className="flex items-center">
            <span className="text-2xl text-pink-medium font-light">[</span>
            <div className="grid grid-cols-3 gap-1 px-1">
              <span className="w-5 text-center font-mono text-pink-dark">
                1
              </span>
              <span className="w-5 text-center font-mono text-pink-dark">
                1
              </span>
              <span className="w-5 text-center font-mono text-text-dark/40">
                0
              </span>
              <span className="w-5 text-center font-mono text-pink-dark">
                1
              </span>
              <span className="w-5 text-center font-mono text-text-dark/40">
                0
              </span>
              <span className="w-5 text-center font-mono text-pink-dark">
                1
              </span>
            </div>
            <span className="text-2xl text-pink-medium font-light">]</span>
          </div>
          <p className="text-[10px] text-text-dark/50 mt-1">2×3</p>
        </div>

        {/* Znak transpozycji */}
        <div className="flex flex-col justify-center">
          <span className="text-lg text-text-dark/50">→</span>
        </div>

        {/* Macierz Uᵀ */}
        <div className="text-center">
          <p className="text-text-dark/60 mb-1 font-medium">
            Uᵀ <span className="text-[10px]">(transpozycja)</span>
          </p>
          <div className="flex items-center justify-center">
            <span className="text-2xl text-pink-medium font-light">[</span>
            <div className="grid grid-cols-2 gap-1 px-1">
              <span className="w-5 text-center font-mono text-pink-dark">
                1
              </span>
              <span className="w-5 text-center font-mono text-pink-dark">
                1
              </span>
              <span className="w-5 text-center font-mono text-pink-dark">
                1
              </span>
              <span className="w-5 text-center font-mono text-text-dark/40">
                0
              </span>
              <span className="w-5 text-center font-mono text-text-dark/40">
                0
              </span>
              <span className="w-5 text-center font-mono text-pink-dark">
                1
              </span>
            </div>
            <span className="text-2xl text-pink-medium font-light">]</span>
          </div>
          <p className="text-[10px] text-text-dark/50 mt-1">3×2</p>
        </div>
      </div>

      {/* Mnożenie */}
      <div className="border-t border-pink-medium/20 pt-3">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          {/* U */}
          <div className="text-center">
            <div className="flex items-center">
              <span className="text-xl text-pink-medium font-light">[</span>
              <div className="grid grid-cols-3 gap-0.5 px-0.5">
                <span className="w-4 text-center font-mono text-pink-dark text-[11px]">
                  1
                </span>
                <span className="w-4 text-center font-mono text-pink-dark text-[11px]">
                  1
                </span>
                <span className="w-4 text-center font-mono text-text-dark/40 text-[11px]">
                  0
                </span>
                <span className="w-4 text-center font-mono text-pink-dark text-[11px]">
                  1
                </span>
                <span className="w-4 text-center font-mono text-text-dark/40 text-[11px]">
                  0
                </span>
                <span className="w-4 text-center font-mono text-pink-dark text-[11px]">
                  1
                </span>
              </div>
              <span className="text-xl text-pink-medium font-light">]</span>
            </div>
          </div>

          <span className="text-text-dark/50">×</span>

          {/* Uᵀ */}
          <div className="text-center">
            <div className="flex items-stretch">
              <span className="text-2xl text-pink-medium font-light leading-none flex items-center">
                [
              </span>
              <div className="grid grid-cols-2 gap-0.5 px-0.5 py-0.5">
                <span className="w-4 text-center font-mono text-pink-dark text-[11px]">
                  1
                </span>
                <span className="w-4 text-center font-mono text-pink-dark text-[11px]">
                  1
                </span>
                <span className="w-4 text-center font-mono text-pink-dark text-[11px]">
                  1
                </span>
                <span className="w-4 text-center font-mono text-text-dark/40 text-[11px]">
                  0
                </span>
                <span className="w-4 text-center font-mono text-text-dark/40 text-[11px]">
                  0
                </span>
                <span className="w-4 text-center font-mono text-pink-dark text-[11px]">
                  1
                </span>
              </div>
              <span className="text-2xl text-pink-medium font-light leading-none flex items-center">
                ]
              </span>
            </div>
          </div>

          <span className="text-text-dark/50">=</span>

          {/* Wynik S */}
          <div className="text-center">
            <div className="flex items-center">
              <span className="text-xl text-pink-medium font-light">[</span>
              <div className="grid grid-cols-2 gap-0.5 px-0.5">
                <span className="w-4 text-center font-mono font-bold text-pink-dark text-[11px]">
                  2
                </span>
                <span className="w-4 text-center font-mono font-bold text-pink-dark text-[11px]">
                  1
                </span>
                <span className="w-4 text-center font-mono font-bold text-pink-dark text-[11px]">
                  1
                </span>
                <span className="w-4 text-center font-mono font-bold text-pink-dark text-[11px]">
                  2
                </span>
              </div>
              <span className="text-xl text-pink-medium font-light">]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SimilarityMatrix({
  users,
  currentUserId,
  highlightedUserId,
}: SimilarityMatrixProps) {
  // Oblicz macierz podobieństwa S = U × Uᵀ
  const similarityMatrix = useMemo(
    () => createSimilarityMatrix(users),
    [users]
  );

  // Znajdź indeksy do podświetlenia
  const currentUserIndex = users.findIndex((u) => u.id === currentUserId);
  const highlightedUserIndex = users.findIndex(
    (u) => u.id === highlightedUserId
  );

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Wyjaśnienie matematyczne */}
      <div className="bg-purple-soft/30 rounded-xl p-4 space-y-3">
        <p className="text-sm text-text-dark/70 text-center">
          Wynik mnożenia: <strong className="text-pink-dark">S = U × Uᵀ</strong>
        </p>

        {/* Przykład 2x2 */}
        <MatrixExample />
      </div>

      {/* Macierz podobieństwa - styl z nawiasami jak UserMatrix */}
      <div className="space-y-4">
        {/* Macierz z nawiasami */}
        <div className="flex items-stretch justify-start md:justify-center overflow-x-auto pb-2">
          {/* Nazwy użytkowników (wiersze) */}
          <div className="flex flex-col justify-end pr-2 text-right">
            {/* Pusta przestrzeń nad nazwami (na wysokość nagłówka kolumn) */}
            <div className="h-8" />
            {users.map((user) => {
              const isHighlighted = user.id === currentUserId;
              return (
                <div
                  key={user.id}
                  className={`
                    h-8 flex items-center justify-end text-sm font-medium whitespace-nowrap
                    ${isHighlighted ? "text-pink-dark" : "text-text-dark"}
                  `}
                >
                  {user.name}
                  {isHighlighted && <span className="ml-1">✨</span>}
                </div>
              );
            })}
          </div>

          {/* Lewy nawias */}
          <div className="flex flex-col justify-end">
            {/* Pusta przestrzeń na wysokość nagłówka */}
            <div className="h-8" />
            <div className="flex-1 w-3 border-l-3 border-t-3 border-b-3 border-pink-dark rounded-l-md" />
          </div>

          {/* Zawartość macierzy z nagłówkiem */}
          <div className="flex flex-col">
            {/* Nagłówek z pierwszymi literami imion (kolumny) */}
            <div className="flex h-8 items-end pb-1 px-2">
              {users.map((user, colIdx) => {
                const isHighlightedCol = colIdx === highlightedUserIndex;
                return (
                  <div
                    key={user.id}
                    className={`
                      w-8 text-center text-sm font-medium
                      ${
                        isHighlightedCol
                          ? "text-pink-dark"
                          : "text-text-dark/70"
                      }
                    `}
                    title={user.name}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                );
              })}
            </div>

            {/* Wartości macierzy */}
            <div className="flex flex-col bg-white/30 px-2">
              {users.map((rowUser, rowIdx) => {
                const isHighlighted = rowUser.id === currentUserId;
                return (
                  <div
                    key={rowUser.id}
                    className={`
                      flex h-8 items-center
                      ${isHighlighted ? "bg-pink-light/50" : ""}
                    `}
                  >
                    {similarityMatrix[rowIdx].map((value, colIdx) => {
                      const isDiagonal = rowIdx === colIdx;
                      const isHighlightedCell =
                        (rowIdx === currentUserIndex &&
                          colIdx === highlightedUserIndex) ||
                        (rowIdx === highlightedUserIndex &&
                          colIdx === currentUserIndex);

                      return (
                        <div
                          key={colIdx}
                          className={`
                            w-8 text-center font-mono text-sm
                            ${
                              isHighlightedCell
                                ? "text-pink-dark font-bold bg-pink-medium/40 rounded"
                                : isDiagonal
                                ? "text-text-dark/30 bg-gray-100/40 rounded"
                                : value > 0
                                ? "text-pink-dark font-bold"
                                : "text-text-dark/30"
                            }
                          `}
                        >
                          {value}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prawy nawias */}
          <div className="flex flex-col justify-end">
            {/* Pusta przestrzeń na wysokość nagłówka */}
            <div className="h-8" />
            <div className="flex-1 w-3 border-r-3 border-t-3 border-b-3 border-pink-dark rounded-r-md" />
          </div>
        </div>
      </div>

      {/* Lista użytkowników posortowana według podobieństwa */}
      {currentUserId && currentUserIndex >= 0 && (
        <div className="bg-white/60 rounded-lg p-3">
          <p className="text-xs text-text-dark/60 text-center mb-2">
            Ranking podobieństwa:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {(() => {
              // Pobierz podobieństwa i posortuj malejąco
              const similarities = users
                .map((user, idx) => ({
                  user,
                  similarity: similarityMatrix[currentUserIndex][idx],
                  idx,
                }))
                .filter((item) => item.idx !== currentUserIndex)
                .sort((a, b) => b.similarity - a.similarity);

              return similarities.map((item, rank) => (
                <div
                  key={item.user.id}
                  className={`
                    flex items-center gap-1 px-2 py-1 rounded-full text-xs
                    ${
                      rank === 0
                        ? "bg-pink-light text-pink-dark font-semibold"
                        : "bg-white/70 text-text-dark/70"
                    }
                  `}
                >
                  <span>
                    {rank === 0
                      ? "🥇"
                      : rank === 1
                      ? "🥈"
                      : rank === 2
                      ? "🥉"
                      : `${rank + 1}.`}
                  </span>
                  <span>{item.user.name}</span>
                  <span className="text-text-dark/40">({item.similarity})</span>
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
