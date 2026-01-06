import { useCallback, useMemo, useState } from "react";

import { Header, LeftColumn, RightColumn } from "./components/Layout";
import { MatchModal } from "./components/Match";
import { MatchProposal } from "./components/MatchProposal";
import { SimilarityMatrix, SwipeMatrix, UserMatrix } from "./components/Matrix";
import { UserForm } from "./components/UserForm";
import { MOCK_USERS } from "./data";
import { createSwipe, generateMockSwipes, getSortedMatches, isMatch } from "./utils";

import type { Swipe, User } from "./types";
type AppStep = "register" | "welcome" | "swiping";

function App() {
  const [step, setStep] = useState<AppStep>("register");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [swipes, setSwipes] = useState<Swipe[]>([]);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);

  // Wszyscy użytkownicy = mock + aktualny
  const allUsers = useMemo(
    () => (currentUser ? [...MOCK_USERS, currentUser] : MOCK_USERS),
    [currentUser]
  );

  // Oblicz dopasowania gdy mamy użytkownika
  const matchResults = useMemo(() => {
    if (!currentUser) return [];
    return getSortedMatches(currentUser, allUsers);
  }, [currentUser, allUsers]);

  // Filtruj tylko nieocenionych użytkowników
  const unswipedResults = useMemo(() => {
    return matchResults.filter(
      (result) =>
        !swipes.some(
          (s) =>
            s.visitorId === currentUser?.id && s.targetId === result.user.id
        )
    );
  }, [matchResults, swipes, currentUser]);

  // Sprawdź czy użytkownik wykonał już jakiś swipe
  const hasUserSwiped = useMemo(() => {
    return swipes.some((s) => s.visitorId === currentUser?.id);
  }, [swipes, currentUser]);

  const handleAddUser = useCallback((user: User) => {
    setCurrentUser(user);
    setStep("welcome");
  }, []);

  const handleStartSwiping = useCallback(() => {
    if (!currentUser) return;

    // Generuj losowe swipes od innych użytkowników
    // Trzeci użytkownik (index 2) zawsze lubi - gwarantuje match
    const mockSwipes = generateMockSwipes(MOCK_USERS, currentUser.id, 2);
    setSwipes(mockSwipes);
    setStep("swiping");
  }, [currentUser]);

  const handleSwipe = useCallback(
    (liked: boolean) => {
      if (!currentUser || unswipedResults.length === 0) return;

      const targetUser = unswipedResults[0].user;

      // Dodaj swipe
      const newSwipe = createSwipe(currentUser.id, targetUser.id, liked);
      const newSwipes = [...swipes, newSwipe];
      setSwipes(newSwipes);

      // Sprawdź czy jest match (jeśli polubiliśmy)
      if (liked && isMatch(newSwipes, currentUser.id, targetUser.id)) {
        setMatchedUser(targetUser);
      }
    },
    [currentUser, unswipedResults, swipes]
  );

  const handleSwipeLeft = useCallback(() => handleSwipe(false), [handleSwipe]);
  const handleSwipeRight = useCallback(() => handleSwipe(true), [handleSwipe]);

  const handleCloseMatchModal = useCallback(() => {
    setMatchedUser(null);
  }, []);

  // Obecny kandydat do wyświetlenia w trybie swiping
  const currentCandidate = unswipedResults[0] || null;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-6 min-h-0">
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
                  onClick={handleStartSwiping}
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

            {step === "swiping" && currentUser && currentCandidate && (
              <MatchProposal
                key={`swiping-${currentCandidate.user.id}`}
                matchResult={currentCandidate}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            )}

            {step === "swiping" && currentUser && !currentCandidate && (
              <div
                key="finished"
                className="flex flex-col items-center justify-center h-full text-center space-y-6 py-8 animate-fade-in-up"
              >
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl text-pink-dark">To już wszyscy!</h2>
                <p className="text-text-dark/70 max-w-xs">
                  Przejrzałeś/aś wszystkie profile. Sprawdź macierz po prawej,
                  aby zobaczyć swoje polubienia!
                </p>
              </div>
            )}
          </LeftColumn>

          {/* PRAWA KOLUMNA */}
          <RightColumn
            title={
              step === "swiping" && hasUserSwiped
                ? "Macierz Polubień"
                : step === "swiping"
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

            {step === "swiping" && currentUser && !hasUserSwiped && (
              <SimilarityMatrix
                users={allUsers}
                currentUserId={currentUser.id}
                highlightedUserId={currentCandidate?.user.id}
              />
            )}

            {step === "swiping" && currentUser && hasUserSwiped && (
              <SwipeMatrix
                users={allUsers}
                swipes={swipes}
                currentUserId={currentUser.id}
                highlightedUserId={currentCandidate?.user.id}
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

      {/* Match Modal */}
      {matchedUser && currentUser && (
        <MatchModal
          user1={currentUser}
          user2={matchedUser}
          onClose={handleCloseMatchModal}
        />
      )}
    </div>
  );
}

export default App;
