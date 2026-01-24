import type { User } from "../../types";
import { useMemo } from "react";

import { createFullMatchMatrix } from "../../utils";

interface CombinedMatrixProps {
  users: User[];
  currentUserId?: string;
  highlightedUserId?: string;
}

/**
 * Transponuje macierz (zamienia wiersze z kolumnami)
 */
function transposeMatrix(matrix: number[][]): number[][] {
  if (matrix.length === 0) return [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  const transposed: number[][] = [];

  for (let j = 0; j < cols; j++) {
    const newRow: number[] = [];
    for (let i = 0; i < rows; i++) {
      newRow.push(matrix[i][j]);
    }
    transposed.push(newRow);
  }

  return transposed;
}

/**
 * Mała macierz użytkownik-cecha (A)
 */
function MiniFeatureMatrix({
  matrix,
  currentUserIndex,
  label,
  color,
}: {
  matrix: number[][];
  currentUserIndex: number;
  label: string;
  color: "pink" | "purple";
}) {
  const colorClasses = {
    pink: {
      border: "border-pink-dark",
      cell: "text-pink-dark",
      bg: "bg-pink-100/50",
    },
    purple: {
      border: "border-purple-500",
      cell: "text-purple-600",
      bg: "bg-purple-100/50",
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-medium text-text-dark/70 mb-1">{label}</p>
      <div className="flex items-stretch">
        <div
          className={`w-1.5 border-l-2 border-t-2 border-b-2 ${colors.border} rounded-l-sm`}
        />
        <div className={`${colors.bg} px-1 py-0.5`}>
          {matrix.map((row, rowIdx) => {
            const isCurrentUser = rowIdx === currentUserIndex;
            return (
              <div
                key={rowIdx}
                className={`flex ${isCurrentUser ? "bg-white/60" : ""}`}
              >
                {row.map((value, colIdx) => (
                  <div
                    key={colIdx}
                    className={`
                      w-4 h-4 text-[9px] font-mono flex items-center justify-center
                      ${value > 0 ? colors.cell : "text-text-dark/20"}
                      ${isCurrentUser && value > 0 ? "font-bold" : ""}
                    `}
                  >
                    {value}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div
          className={`w-1.5 border-r-2 border-t-2 border-b-2 ${colors.border} rounded-r-sm`}
        />
      </div>
    </div>
  );
}

/**
 * Mała macierz transponowana Pᵀ (wiersze = cechy, kolumny = użytkownicy)
 */
function MiniTransposedMatrix({
  matrix,
  currentUserIndex,
  label,
}: {
  matrix: number[][];
  currentUserIndex: number;
  label: string;
}) {
  const transposed = transposeMatrix(matrix);

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-medium text-text-dark/70 mb-1">{label}</p>
      <div className="flex items-stretch">
        <div className="w-1.5 border-l-2 border-t-2 border-b-2 border-purple-500 rounded-l-sm" />
        <div className="bg-purple-100/50 px-1 py-0.5">
          {transposed.map((row, rowIdx) => (
            <div key={rowIdx} className="flex">
              {row.map((value, colIdx) => {
                const isCurrentUser = colIdx === currentUserIndex;
                return (
                  <div
                    key={colIdx}
                    className={`
                      w-4 h-4 text-[9px] font-mono flex items-center justify-center
                      ${value > 0 ? "text-purple-600" : "text-text-dark/20"}
                      ${isCurrentUser && value > 0 ? "font-bold bg-white/60" : ""}
                    `}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="w-1.5 border-r-2 border-t-2 border-b-2 border-purple-500 rounded-r-sm" />
      </div>
    </div>
  );
}

/**
 * Mała macierz dopasowań (M = A × Pᵀ)
 */
function MiniMatchMatrix({
  matrix,
  currentUserIndex,
  highlightedUserIndex,
}: {
  matrix: number[][];
  currentUserIndex: number;
  highlightedUserIndex: number;
}) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-medium text-text-dark/70 mb-1">M = A × Pᵀ</p>
      <div className="flex items-stretch">
        <div className="w-1.5 border-l-2 border-t-2 border-b-2 border-pink-dark rounded-l-sm" />
        <div className="bg-gradient-to-r from-pink-100/50 to-purple-100/50 px-1 py-0.5">
          {matrix.map((row, rowIdx) => (
            <div key={rowIdx} className="flex">
              {row.map((value, colIdx) => {
                const isDiagonal = rowIdx === colIdx;
                const isHighlighted =
                  (rowIdx === currentUserIndex &&
                    colIdx === highlightedUserIndex) ||
                  (rowIdx === highlightedUserIndex &&
                    colIdx === currentUserIndex);

                return (
                  <div
                    key={colIdx}
                    className={`
                      w-5 h-5 text-[10px] font-mono flex items-center justify-center
                      ${
                        isHighlighted
                          ? "text-pink-dark font-bold bg-white/60 rounded"
                          : isDiagonal
                          ? "text-text-dark/20"
                          : value > 0
                          ? "text-pink-dark"
                          : "text-text-dark/20"
                      }
                    `}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="w-1.5 border-r-2 border-t-2 border-b-2 border-pink-dark rounded-r-sm" />
      </div>
    </div>
  );
}

/**
 * Prosty przykład mnożenia macierzy A × Pᵀ
 */
function MatrixMultiplicationExample() {
  return (
    <div className="bg-white/60 rounded-xl p-4 space-y-4">
      <p className="text-xs text-text-dark/60 text-center font-medium">
        Przykład: jak obliczyć M[1][2] (czy Anna pasuje do preferencji Bartka)?
      </p>

      {/* Wizualizacja mnożenia */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
        {/* Wiersz z A (cechy Anny) */}
        <div className="text-center">
          <p className="text-text-dark/50 mb-1">Cechy Anny (wiersz A₁)</p>
          <div className="flex items-center">
            <span className="text-lg text-pink-dark font-light">[</span>
            <div className="flex gap-1 px-1">
              <span className="w-5 text-center font-mono text-pink-dark font-bold">1</span>
              <span className="w-5 text-center font-mono text-text-dark/40">0</span>
              <span className="w-5 text-center font-mono text-pink-dark font-bold">1</span>
            </div>
            <span className="text-lg text-pink-dark font-light">]</span>
          </div>
        </div>

        <span className="text-text-dark/40">·</span>

        {/* Kolumna z Pᵀ (preferencje Bartka) */}
        <div className="text-center">
          <p className="text-text-dark/50 mb-1">Pref. Bartka (kolumna Pᵀ₂)</p>
          <div className="flex items-center">
            <span className="text-lg text-purple-500 font-light">[</span>
            <div className="flex flex-col gap-0.5 px-1">
              <span className="w-5 text-center font-mono text-purple-600 font-bold">1</span>
              <span className="w-5 text-center font-mono text-purple-600 font-bold">1</span>
              <span className="w-5 text-center font-mono text-text-dark/40">0</span>
            </div>
            <span className="text-lg text-purple-500 font-light">]</span>
          </div>
        </div>
      </div>

      {/* Obliczenie */}
      <div className="border-t border-gray-200 pt-3">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="font-medium text-text-dark/70">M[1][2] =</span>
          <span className="text-pink-dark">1</span>
          <span>×</span>
          <span className="text-purple-600">1</span>
          <span>+</span>
          <span className="text-pink-dark">0</span>
          <span>×</span>
          <span className="text-purple-600">1</span>
          <span>+</span>
          <span className="text-pink-dark">1</span>
          <span>×</span>
          <span className="text-purple-600">0</span>
          <span>=</span>
          <span className="font-bold text-pink-dark bg-pink-100 px-2 py-0.5 rounded">1</span>
        </div>
        <p className="text-[10px] text-text-dark/50 text-center mt-2">
          Anna ma 1 cechę, której szuka Bartek
        </p>
      </div>
    </div>
  );
}

export function CombinedMatrix({
  users,
  currentUserId,
  highlightedUserId,
}: CombinedMatrixProps) {
  // Oblicz wszystkie macierze: A (cechy), P (preferencje), M = A × Pᵀ
  const matrices = useMemo(() => createFullMatchMatrix(users), [users]);

  const currentUserIndex = users.findIndex((u) => u.id === currentUserId);
  const highlightedUserIndex = users.findIndex(
    (u) => u.id === highlightedUserId
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Wyjaśnienie wzoru */}
      <div className="bg-gradient-to-r from-pink-50/50 to-purple-50/50 rounded-xl p-4 space-y-3">
        <p className="text-sm text-text-dark/70 text-center">
          Wzór:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-mono">
          <span className="text-pink-dark font-bold">M</span>
          <span>=</span>
          <span className="bg-pink-100 px-2 py-0.5 rounded text-pink-dark">
            A
          </span>
          <span>×</span>
          <span className="bg-purple-100 px-2 py-0.5 rounded text-purple-600">
            Pᵀ
          </span>
        </div>
        <p className="text-xs text-text-dark/60 text-center">
          M[i][j] = ile cech użytkownika i pasuje do preferencji użytkownika j
        </p>
      </div>

      {/* Przykład mnożenia */}
      <MatrixMultiplicationExample />

      {/* Tytuł sekcji */}
      <p className="text-sm text-text-dark/70 text-center">
          Obliczenia:
        </p>

      {/* Wizualizacja trzech macierzy: A, Pᵀ, M */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <MiniFeatureMatrix
          matrix={matrices.userFeatureMatrix}
          currentUserIndex={currentUserIndex}
          label="A (cechy)"
          color="pink"
        />

        <span className="text-text-dark/40 text-lg">×</span>

        <MiniTransposedMatrix
          matrix={matrices.preferenceMatrix}
          currentUserIndex={currentUserIndex}
          label="Pᵀ (preferencje)"
        />

        <span className="text-text-dark/40 text-lg">=</span>

        <MiniMatchMatrix
          matrix={matrices.matchMatrix}
          currentUserIndex={currentUserIndex}
          highlightedUserIndex={highlightedUserIndex}
        />
      </div>

      {/* Pełna macierz wynikowa M z etykietami */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-center bg-gradient-to-r from-pink-dark to-purple-600 bg-clip-text text-transparent">
          Macierz Dopasowań (M)
        </h3>

        <div className="flex items-stretch justify-start md:justify-center overflow-x-auto pb-2">
          {/* Nazwy użytkowników (wiersze) - czyje cechy */}
          <div className="flex flex-col justify-end pr-2 text-right">
            <div className="h-8" />
            {users.map((user) => (
              <div
                key={user.id}
                className="h-8 flex items-center justify-end text-sm font-medium whitespace-nowrap text-text-dark"
              >
                {user.name}
              </div>
            ))}
          </div>

          {/* Lewy nawias */}
          <div className="flex flex-col justify-end">
            <div className="h-8" />
            <div className="flex-1 w-3 border-l-3 border-t-3 border-b-3 border-pink-dark rounded-l-md" />
          </div>

          {/* Zawartość macierzy */}
          <div className="flex flex-col">
            {/* Nagłówek - czyje preferencje (kolumna = czyje preferencje) */}
            <div className="flex h-8 items-end pb-1 px-2">
              {users.map((user, colIdx) => {
                const isCurrentUserCol = colIdx === currentUserIndex;
                const isHighlightedCol = colIdx === highlightedUserIndex;
                return (
                  <div
                    key={user.id}
                    className={`
                      w-10 text-center text-sm font-medium
                      ${isCurrentUserCol ? "text-pink-dark" : isHighlightedCol ? "text-purple-600" : "text-text-dark/70"}
                    `}
                    title={user.name}
                  >
                    {user.name.charAt(0).toUpperCase()}
                    {isCurrentUserCol && <span className="ml-0.5">✨</span>}
                  </div>
                );
              })}
            </div>

            {/* Wartości macierzy */}
            <div className="flex flex-col bg-white/30 px-2">
              {users.map((rowUser, rowIdx) => (
                <div
                  key={rowUser.id}
                  className="flex h-8 items-center"
                >
                  {matrices.matchMatrix[rowIdx].map((value, colIdx) => {
                    const isDiagonal = rowIdx === colIdx;
                    const isCurrentUserCol = colIdx === currentUserIndex;
                    const isHighlightedCell =
                      rowIdx === highlightedUserIndex &&
                      colIdx === currentUserIndex;

                    // Gradient koloru w zależności od wartości
                    const maxVal = Math.max(
                      ...matrices.matchMatrix.flat().filter((v) => v > 0)
                    );
                    const intensity = maxVal > 0 ? value / maxVal : 0;

                    return (
                      <div
                        key={colIdx}
                        className={`
                          w-10 text-center font-mono text-sm
                          ${
                            isHighlightedCell
                              ? "text-white font-bold bg-gradient-to-r from-pink-dark to-purple-600 rounded"
                              : isDiagonal
                              ? "text-text-dark/30 bg-gray-100/40 rounded"
                              : isCurrentUserCol
                              ? "bg-pink-100/60 font-semibold text-pink-dark"
                              : value > 0
                              ? "font-semibold"
                              : "text-text-dark/30"
                          }
                        `}
                        style={
                          !isHighlightedCell && !isDiagonal && !isCurrentUserCol && value > 0
                            ? {
                                color: `rgb(${Math.round(
                                  219 - intensity * 60
                                )}, ${Math.round(39 + intensity * 40)}, ${Math.round(
                                  119 + intensity * 20
                                )})`,
                              }
                            : undefined
                        }
                      >
                        {value}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Prawy nawias */}
          <div className="flex flex-col justify-end">
            <div className="h-8" />
            <div className="flex-1 w-3 border-r-3 border-t-3 border-b-3 border-pink-dark rounded-r-md" />
          </div>
        </div>

        {/* Wyjaśnienie jak czytać macierz */}
        <div className="text-xs text-text-dark/60 text-center bg-white/40 rounded-lg p-2">
          <p>
            <strong>Wiersz</strong> = czyje cechy |{" "}
            <strong>Kolumna</strong> = czyje preferencje
          </p>
        </div>
      </div>

      {/* Ranking - kto najlepiej pasuje do MOICH preferencji */}
      {currentUserId && currentUserIndex >= 0 && (
        <div className="bg-white/60 rounded-lg p-3">
          <p className="text-xs text-text-dark/60 text-center mb-2">
            Kto najlepiej pasuje do <strong>Twoich</strong> preferencji (kolumna M[*][Ty]):
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {(() => {
              // Patrzymy na kolumnę currentUserIndex - kto najlepiej pasuje do MOICH preferencji
              // M[j][i] = jak cechy user_j pasują do preferencji user_i (mnie)
              const matches = users
                .map((user, idx) => ({
                  user,
                  score: matrices.matchMatrix[idx][currentUserIndex], // M[j][i]
                  idx,
                }))
                .filter((item) => item.idx !== currentUserIndex)
                .sort((a, b) => b.score - a.score);

              return matches.map((item, rank) => (
                <div
                  key={item.user.id}
                  className={`
                    flex items-center gap-1 px-3 py-2 rounded-xl text-xs
                    ${
                      rank === 0
                        ? "bg-gradient-to-r from-pink-100 to-purple-100 font-semibold"
                        : "bg-white/70"
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
                  <span
                    className={
                      rank === 0 ? "text-pink-dark" : "text-text-dark/70"
                    }
                  >
                    {item.user.name}
                  </span>
                  <span className="text-text-dark/40">({item.score})</span>
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
