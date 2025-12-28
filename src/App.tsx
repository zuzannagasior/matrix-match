import { useMemo, useState } from "react";

import { Header, LeftColumn, RightColumn } from "./components/Layout";
import { MatchProposal } from "./components/MatchProposal";
import { SimilarityMatrix, UserMatrix } from "./components/Matrix";
import { UserForm } from "./components/UserForm";
import { MOCK_USERS } from "./data";
import { getSortedMatches } from "./utils";

import type { User } from "./types";
type AppStep = "register" | "welcome" | "matching";

function App() {
  const [step, setStep] = useState<AppStep>("register");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Wszyscy użytkownicy = mock + aktualny
  const allUsers = currentUser ? [...MOCK_USERS, currentUser] : MOCK_USERS;

  // Oblicz dopasowania gdy mamy użytkownika
  const matchResults = useMemo(() => {
    if (!currentUser) return [];
    return getSortedMatches(currentUser, allUsers);
  }, [currentUser, allUsers]);

  const handleAddUser = (user: User) => {
    setCurrentUser(user);
    setStep("welcome");
  };

  const handleStartMatching = () => {
    setCurrentMatchIndex(0);
    setStep("matching");
  };

  const handleNextMatch = () => {
    if (currentMatchIndex < matchResults.length - 1) {
      setCurrentMatchIndex((prev) => prev + 1);
    }
  };

  const handlePrevMatch = () => {
    if (currentMatchIndex > 0) {
      setCurrentMatchIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-6">
        <div className="flex gap-6 flex-1 min-h-0">
          {/* LEWA KOLUMNA */}
          <LeftColumn>
            {step === "register" && (
              <div key="register" className="animate-fade-in-up">
                <UserForm onSubmit={handleAddUser} />
              </div>
            )}

            {step === "welcome" && currentUser && (
              <div
                key="welcome"
                className="flex flex-col items-center justify-center h-full text-center space-y-6 py-8 animate-fade-in-up"
              >
                <div className="text-6xl animate-float">💕</div>
                <h2 className="text-2xl text-pink-dark">
                  Witaj, {currentUser.name}!
                </h2>
                <p className="text-text-dark/70 max-w-xs">
                  Twój profil został utworzony. Zobacz po prawej jak Twoje
                  zainteresowania wyglądają w macierzy!
                </p>
                <p className="text-text-dark/60 text-sm">
                  Gotowy/a poznać kogoś o podobnych zainteresowaniach?
                </p>
                <button
                  onClick={handleStartMatching}
                  className="
                    mt-4 py-4 px-8 rounded-xl font-semibold text-lg
                    bg-gradient-romantic text-white shadow-romantic
                    hover:shadow-lg hover:scale-105 active:scale-95
                    transition-all duration-300
                  "
                >
                  Szukaj pary 💘
                </button>
              </div>
            )}

            {step === "matching" && currentUser && matchResults.length > 0 && (
              <MatchProposal
                key="matching"
                matchResult={matchResults[currentMatchIndex]}
                onNext={handleNextMatch}
                onBack={handlePrevMatch}
                totalCandidates={matchResults.length}
                currentIndex={currentMatchIndex}
              />
            )}
          </LeftColumn>

          {/* PRAWA KOLUMNA */}
          <RightColumn
            title={
              step === "matching"
                ? "Macierz Podobieństwa"
                : "Macierz Zainteresowań"
            }
          >
            {step === "register" && (
              <div className="text-center text-text-dark/60 py-12">
                <p className="text-4xl mb-4">📊</p>
                <p>Wypełnij formularz, aby zobaczyć macierz</p>
              </div>
            )}

            {step === "welcome" && (
              <div className="space-y-4">
                <p className="text-sm text-text-dark/70">
                  Macierz pokazuje zainteresowania wszystkich użytkowników.
                  <br />
                  <strong>1</strong> = lubi przedmiot, <strong>0</strong> = nie
                  lubi
                </p>
                <UserMatrix
                  users={allUsers}
                  highlightUserId={currentUser?.id}
                />
              </div>
            )}

            {step === "matching" && currentUser && matchResults.length > 0 && (
              <SimilarityMatrix
                users={allUsers}
                currentUserId={currentUser.id}
                highlightedUserId={matchResults[currentMatchIndex].user.id}
              />
            )}
          </RightColumn>
        </div>
      </main>

      <footer className="text-center py-4 text-text-dark/50 text-sm">
        <p>
          Projekt edukacyjny SWPS - Macierzowy model procesu dopasowania
          użytkowników w aplikacjach randkowych 💕
        </p>
      </footer>
    </div>
  );
}

export default App;
