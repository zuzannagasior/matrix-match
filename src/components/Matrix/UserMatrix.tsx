import { SUBJECTS } from "../../data";

import type { User } from "../../types";

interface UserMatrixProps {
  users: User[];
  highlightUserId?: string; // podświetl nowego użytkownika
}

export function UserMatrix({ users, highlightUserId }: UserMatrixProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white/90 px-3 py-2 text-left font-semibold text-text-dark border-b-2 border-pink-medium/30">
              Użytkownik
            </th>
            {SUBJECTS.map((subject) => (
              <th
                key={subject.id}
                className="px-2 py-2 text-center font-medium text-text-dark/70 border-b-2 border-pink-medium/30 min-w-[40px]"
                title={subject.name}
              >
                <span className="text-lg">{subject.emoji}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const isHighlighted = user.id === highlightUserId;
            return (
              <tr
                key={user.id}
                className={`
                  transition-all duration-300
                  ${
                    isHighlighted
                      ? "bg-pink-light"
                      : index % 2 === 0
                      ? "bg-white/30"
                      : "bg-white/50"
                  }
                `}
              >
                <td
                  className={`
                    sticky left-0 px-3 py-2 font-medium whitespace-nowrap
                    ${
                      isHighlighted
                        ? "bg-pink-light text-pink-dark"
                        : "bg-white/90 text-text-dark"
                    }
                  `}
                >
                  {user.name}
                  {isHighlighted && <span className="ml-1">✨</span>}
                </td>
                {SUBJECTS.map((subject) => {
                  const hasInterest = user.interests.includes(subject.id);
                  return (
                    <td
                      key={subject.id}
                      className={`
                        px-2 py-2 text-center font-mono
                        ${
                          hasInterest
                            ? "text-pink-dark font-bold"
                            : "text-text-dark/30"
                        }
                      `}
                    >
                      {hasInterest ? "1" : "0"}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legenda */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-text-dark/60">
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
