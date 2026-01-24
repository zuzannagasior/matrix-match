import type { Swipe, User } from "../../types";

interface SwipeMatrixProps {
  users: User[];
  swipes: Swipe[];
  currentUserId: string;
  highlightedUserId?: string;
}

/**
 * Macierz Polubień - uproszczona wersja dla aktualnego użytkownika
 * Pokazuje: Ty → Oni oraz Oni → Ty
 */
export function SwipeMatrix({
  users,
  swipes,
  currentUserId,
  highlightedUserId,
}: SwipeMatrixProps) {
  // Znajdź aktualnego użytkownika
  const currentUser = users.find((u) => u.id === currentUserId);
  
  // Inni użytkownicy (bez aktualnego)
  const otherUsers = users.filter((u) => u.id !== currentUserId);

  // Znajdź swipe dla pary użytkowników
  const getSwipeValue = (fromId: string, toId: string): boolean | null => {
    const swipe = swipes.find(
      (s) => s.visitorId === fromId && s.targetId === toId
    );
    return swipe ? swipe.liked : null;
  };

  // Sprawdź czy jest match
  const isMatch = (otherId: string): boolean => {
    const mySwipe = getSwipeValue(currentUserId, otherId);
    const theirSwipe = getSwipeValue(otherId, currentUserId);
    return mySwipe === true && theirSwipe === true;
  };

  // Renderuj wartość komórki
  const renderCellValue = (value: boolean | null) => {
    if (value === null) return "?";
    return value ? "1" : "0";
  };

  // Pobierz klasy CSS dla komórki
  const getCellClasses = (value: boolean | null) => {
    const baseClasses =
      "w-12 h-10 flex items-center justify-center text-sm font-mono transition-all duration-300";

    if (value === null) {
      return `${baseClasses} bg-white/50 text-gray-400`;
    }

    if (value === true) {
      return `${baseClasses} bg-green-100 text-green-600 font-semibold`;
    }

    return `${baseClasses} bg-gray-100 text-gray-500`;
  };

  // Pobierz klasy dla wiersza użytkownika
  const getRowClasses = (userId: string, matched: boolean) => {
    const base = "transition-all duration-300";
    if (matched) {
      return `${base} bg-pink-light/30`;
    }
    if (userId === highlightedUserId) {
      return `${base} bg-purple-100/30`;
    }
    return base;
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-4">
      {/* Legenda */}
      <div className="flex flex-wrap gap-4 text-xs text-text-dark/70">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-100 rounded border border-green-200"></span>
          <span>1 = polubił</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-gray-100 rounded border border-gray-200"></span>
          <span>0 = odrzucił</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-white/50 rounded border border-gray-200 flex items-center justify-center text-[10px]">
            ?
          </span>
          <span>= nie ocenił</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-8 h-4 border-2 border-red-heart rounded-full"></span>
          <span>= MATCH! 💕</span>
        </div>
      </div>

      {/* Tabela polubień */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-pink-medium/30">
              <th className="px-3 py-2 text-left text-sm font-medium text-text-dark/70">
                Użytkownik
              </th>
              <th colSpan={2} className="px-3 py-2 text-center text-sm font-medium">
                <div className="flex justify-center gap-6">
                  <span className="text-pink-dark w-12 text-center">{currentUser.name} → Oni</span>
                  <span className="text-purple-600 w-12 text-center">Oni → {currentUser.name}</span>
                </div>
              </th>
              <th className="px-3 py-2 text-center text-sm font-medium text-text-dark/70">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {otherUsers.map((user) => {
              const mySwipe = getSwipeValue(currentUserId, user.id);
              const theirSwipe = getSwipeValue(user.id, currentUserId);
              const matched = isMatch(user.id);

              return (
                <tr
                  key={user.id}
                  className={getRowClasses(user.id, matched)}
                >
                  <td className="px-3 py-2 text-sm font-medium text-text-dark/80">
                    {user.name}
                  </td>
                  <td colSpan={2} className="px-3 py-1">
                    <div className="flex justify-center gap-6 relative">
                      {/* Elipsa dla matcha - pozycjonowana absolutnie */}
                      {matched && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <div 
                            className="border-2 border-red-heart rounded-full"
                            style={{ width: '160px', height: '44px' }}
                          />
                        </div>
                      )}
                      {/* Komórka: Ja → Oni */}
                      <div className="flex justify-center">
                        <span className={getCellClasses(mySwipe)}>
                          {renderCellValue(mySwipe)}
                        </span>
                      </div>
                      {/* Komórka: Oni → Ja */}
                      <div className="flex justify-center">
                        <span className={getCellClasses(theirSwipe)}>
                          {renderCellValue(theirSwipe)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {matched ? (
                      <span className="text-red-heart font-semibold text-sm animate-pulse">
                        MATCH! 💕
                      </span>
                    ) : mySwipe === null ? (
                      <span className="text-text-dark/40 text-xs">
                        Oczekuje...
                      </span>
                    ) : mySwipe && theirSwipe === null ? (
                      <span className="text-text-dark/40 text-xs">
                        Czeka na odpowiedź
                      </span>
                    ) : !mySwipe ? (
                      <span className="text-gray-400 text-xs">Odrzucony</span>
                    ) : (
                      <span className="text-gray-400 text-xs">Brak matcha</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Wyjaśnienie */}
      <div className="text-sm text-text-dark/60 bg-white/30 rounded-lg p-3">
        <p className="font-medium mb-1">Wykrywanie Match:</p>
        <p className="font-mono text-xs">
          Match = ({currentUser.name} → Oni = 1) AND (Oni → {currentUser.name} =
          1)
        </p>
      </div>
    </div>
  );
}

