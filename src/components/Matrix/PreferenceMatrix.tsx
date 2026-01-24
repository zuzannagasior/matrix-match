import { SUBJECTS } from "../../data";

import type { User } from "../../types";

interface PreferenceMatrixProps {
  users: User[];
  highlightUserId?: string;
}

export function PreferenceMatrix({
  users,
  highlightUserId,
}: PreferenceMatrixProps) {

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Sekcja 1: Macierz preferencji P */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-purple-600 text-center">
          Czego szukam u partnera
        </h3>

        {/* Macierz P z nawiasami */}
        <div className="flex items-stretch justify-start md:justify-center overflow-x-auto pb-2">
          {/* Nazwy użytkowników */}
          <div className="flex flex-col justify-end pr-2 text-right">
            <div className="h-8" />
            {users.map((user) => {
              const isHighlighted = user.id === highlightUserId;
              return (
                <div
                  key={user.id}
                  className={`
                    h-8 flex items-center justify-end text-sm font-medium whitespace-nowrap
                    ${isHighlighted ? "text-purple-600" : "text-text-dark"}
                  `}
                >
                  {user.name}
                  {isHighlighted && <span className="ml-1">🔍</span>}
                </div>
              );
            })}
          </div>

          {/* Lewy nawias */}
          <div className="flex flex-col justify-end">
            <div className="h-8" />
            <div className="flex-1 w-3 border-l-3 border-t-3 border-b-3 border-purple-500 rounded-l-md" />
          </div>

          {/* Zawartość macierzy */}
          <div className="flex flex-col">
            {/* Nagłówek z emoji przedmiotów */}
            <div className="flex h-8 items-end pb-1 px-2">
              {SUBJECTS.map((subject) => (
                <div
                  key={subject.id}
                  className="w-8 text-center text-sm"
                  title={subject.name}
                >
                  {subject.emoji}
                </div>
              ))}
            </div>

            {/* Wartości macierzy */}
            <div className="flex flex-col bg-white/30 px-2">
              {users.map((user) => {
                const isHighlighted = user.id === highlightUserId;
                return (
                  <div
                    key={user.id}
                    className={`
                      flex h-8 items-center
                      ${isHighlighted ? "bg-purple-100/50" : ""}
                    `}
                  >
                    {SUBJECTS.map((subject) => {
                      const prefersThis = user.preferences?.includes(
                        subject.id
                      );
                      return (
                        <div
                          key={subject.id}
                          className={`
                            w-8 text-center font-mono text-sm
                            ${
                              prefersThis
                                ? "text-purple-600 font-bold"
                                : "text-text-dark/30"
                            }
                          `}
                        >
                          {prefersThis ? "1" : "0"}
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
            <div className="h-8" />
            <div className="flex-1 w-3 border-r-3 border-t-3 border-b-3 border-purple-500 rounded-r-md" />
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-text-dark/60">
        <span className="font-semibold">Legenda:</span>
        {SUBJECTS.map((subject) => (
          <span key={subject.id} className="flex items-center gap-1">
            <span>{subject.emoji}</span>
            <span className="hidden sm:inline">{subject.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
