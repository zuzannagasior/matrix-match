import { useEffect, useState } from "react";

import { getAvatarSrc } from "../../data";

import type { User } from "../../types";
interface MatchModalProps {
  user1: User;
  user2: User;
  onClose: () => void;
}

export function MatchModal({ user1, user2, onClose }: MatchModalProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Ukryj konfetti po 3 sekundach
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-pink-light via-white to-purple-soft rounded-3xl p-8 shadow-2xl max-w-md mx-4 animate-bounce-in">
        {/* Konfetti */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              >
                {["💕", "💖", "✨", "💘", "❤️", "🎉"][i % 6]}
              </div>
            ))}
          </div>
        )}

        {/* Treść */}
        <div className="relative z-10 text-center space-y-6">
          <h2 className="text-4xl font-bold text-pink-dark animate-pulse">
            MATCH! 💕
          </h2>

          <p className="text-text-dark/70">
            Lubicie się nawzajem!
          </p>

          {/* Avatary */}
          <div className="flex items-center justify-center gap-4">
            {/* User 1 */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-romantic p-1 shadow-romantic">
                <div className="w-full h-full rounded-full bg-white overflow-hidden">
                  <img
                    src={getAvatarSrc(user1.avatar)}
                    alt={user1.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
              <p className="mt-2 font-medium text-pink-dark">{user1.name}</p>
            </div>

            {/* Serduszko */}
            <div className="text-5xl animate-float">💘</div>

            {/* User 2 */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-romantic p-1 shadow-romantic">
                <div className="w-full h-full rounded-full bg-white overflow-hidden">
                  <img
                    src={getAvatarSrc(user2.avatar)}
                    alt={user2.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
              <p className="mt-2 font-medium text-pink-dark">{user2.name}</p>
            </div>
          </div>

          {/* Wyjaśnienie matematyczne */}
          <div className="bg-white/50 rounded-xl p-4 text-sm text-text-dark/70">
            <p className="font-medium mb-1">Wykrycie w macierzy:</p>
            <p className="font-mono text-xs">
              L[{user1.name}][{user2.name}] = 1 ✓
            </p>
            <p className="font-mono text-xs">
              L[{user2.name}][{user1.name}] = 1 ✓
            </p>
            <p className="mt-2 text-pink-dark font-semibold">
              Oba warunki spełnione = MATCH! 🎉
            </p>
          </div>

          {/* Przycisk zamknięcia */}
          <button
            onClick={onClose}
            className="py-3 px-8 rounded-xl font-semibold text-white
              bg-gradient-romantic shadow-romantic
              hover:shadow-lg hover:scale-105 active:scale-95
              transition-all duration-200"
          >
            Kontynuuj szukanie 💕
          </button>
        </div>
      </div>
    </div>
  );
}

