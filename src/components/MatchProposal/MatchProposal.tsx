import { getAvatarSrc, getSubjectById } from "../../data";

import type { MatchResult } from "../../utils";

interface MatchProposalProps {
  matchResult: MatchResult;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function MatchProposal({
  matchResult,
  onSwipeLeft,
  onSwipeRight,
}: MatchProposalProps) {
  const { user, similarity } = matchResult;
  const matchPercentage = Math.round((similarity / 8) * 100); // 8 = liczba przedmiotów

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-4 animate-fade-in-up">
      {/* Karta z sylwetką */}
      <div className="relative">
        {/* Dekoracyjne serduszka */}
        <div className="absolute -top-4 -left-4 text-3xl animate-float">💖</div>
        <div
          className="absolute -top-2 -right-6 text-2xl animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          💕
        </div>
        <div
          className="absolute -bottom-3 -right-2 text-xl animate-float"
          style={{ animationDelay: "1s" }}
        >
          ✨
        </div>

        {/* Avatar */}
        <div className="w-48 h-48 rounded-full bg-gradient-romantic p-1 shadow-romantic">
          <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center overflow-hidden">
            <img
              src={getAvatarSrc(user.avatar)}
              alt={user.name}
              className="w-40 h-40 object-cover rounded-full"
              onError={(e) => {
                // Fallback do sylwetki gdy brak avatara
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
            <div className="hidden text-8xl text-pink-dark/30">👤</div>
          </div>
        </div>
      </div>

      {/* Imię i procent dopasowania */}
      <div className="space-y-2">
        <h3 className="text-3xl text-pink-dark">{user.name}</h3>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">💘</span>
          <span className="text-lg font-semibold text-pink-dark">
            {matchPercentage}% dopasowania
          </span>
        </div>
      </div>

      {/* Zainteresowania użytkownika */}
      <div className="bg-white/50 rounded-xl p-4">
        <p className="text-sm text-text-dark/70 mb-2">Zainteresowania:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {user.interests.map((id) => {
            const subject = getSubjectById(id);
            return subject ? (
              <span
                key={id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-pink-light rounded-full text-xs"
              >
                <span>{subject.emoji}</span>
                <span className="text-text-dark/80">{subject.name}</span>
              </span>
            ) : null;
          })}
          {user.interests.length === 0 && (
            <span className="text-text-dark/50 text-sm italic">
              Brak zainteresowań
            </span>
          )}
        </div>
      </div>

      {/* Przyciski Swipe */}
      <div className="flex gap-8 mt-4">
        <button
          onClick={onSwipeLeft}
          className="w-16 h-16 rounded-full flex items-center justify-center
            bg-white border-2 border-gray-300 text-3xl
            hover:border-gray-400 hover:bg-gray-50 hover:scale-110
            active:scale-95 transition-all duration-200 shadow-md"
          title="Nie lubię"
        >
          ❌
        </button>
        <button
          onClick={onSwipeRight}
          className="w-16 h-16 rounded-full flex items-center justify-center
            bg-gradient-romantic text-3xl text-white
            hover:shadow-lg hover:scale-110
            active:scale-95 transition-all duration-200 shadow-romantic"
          title="Lubię"
        >
          💚
        </button>
      </div>
    </div>
  );
}
