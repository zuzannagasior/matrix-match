import { useCallback, useMemo, useState } from "react";

import { Header, LeftColumn, MobileSlidePanel, RightColumn } from "./components/Layout";
import { MatchModal } from "./components/Match";
import { MatchProposal } from "./components/MatchProposal";
import { CombinedMatrix, PreferenceMatrix, SwipeMatrix, UserMatrix } from "./components/Matrix";
import { UserForm } from "./components/UserForm";
import { MOCK_USERS } from "./data";
import { createSwipe, generateMockSwipes, getSortedMatchesByPreferences, isMatch } from "./utils";

import type { Swipe, User } from "./types";
type AppStep = "register" | "welcome" | "preferences" | "swiping";

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

  // Oblicz dopasowania według macierzy M = A × Pᵀ
  // Sortujemy po M[j][i] - czyli jak cechy innych pasują do MOICH preferencji
  const matchResults = useMemo(() => {
    if (!currentUser) return [];
    return getSortedMatchesByPreferences(currentUser, allUsers);
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

  // Licznik zmian w panelu (step + swipes) - do animacji kółka na mobile
  const panelChangeCount = useMemo(() => {
    const stepValue = step === "register" ? 0 : step === "welcome" ? 1 : 2;
    return stepValue + swipes.length;
  }, [step, swipes.length]);

  const handleAddUser = useCallback((user: User) => {
    setCurrentUser(user);
    setStep("welcome");
  }, []);

  const handleShowPreferences = useCallback(() => {
    setStep("preferences");
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

  const handleReset = useCallback(() => {
    setStep("register");
    setCurrentUser(null);
    setSwipes([]);
    setMatchedUser(null);
  }, []);

  // Obecny kandydat do wyświetlenia w trybie swiping
  const currentCandidate = unswipedResults[0] || null;

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:overflow-hidden overflow-y-auto">
      <Header />

      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-2 md:p-6 md:min-h-0">
        <div className="flex gap-2 md:gap-6 flex-1 md:min-h-0">
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
                  W następnym kroku zobaczysz macierz preferencji.
                </p>
                <button
                  onClick={handleShowPreferences}
                  className="
                    mt-4 py-4 px-8 rounded-xl font-semibold text-lg
                    bg-gradient-romantic text-white shadow-romantic
                    hover:shadow-lg hover:scale-105 active:scale-95
                    transition-all duration-300
                  "
                >
                  Zobacz preferencje 🔍
                </button>
              </div>
            )}

            {step === "preferences" && currentUser && (
              <div
                key="preferences"
                className="flex flex-col items-center justify-center h-full text-center space-y-6 py-8 animate-fade-in-up"
              >
                <div className="text-6xl animate-float">🔍</div>
                <h2 className="text-2xl text-purple-600">
                  Macierz Preferencji
                </h2>
                <p className="text-text-dark/70 max-w-xs">
                  Po prawej widzisz macierz P - czego każdy użytkownik szuka u
                  potencjalnego partnera.
                </p>
                <button
                  onClick={handleStartSwiping}
                  className="
                    mt-4 py-4 px-8 rounded-xl font-semibold text-lg
                    bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg
                    hover:shadow-xl hover:scale-105 active:scale-95
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
                <button
                  onClick={handleReset}
                  className="
                    mt-4 py-3 px-6 rounded-xl font-medium
                    bg-white border-2 border-pink-dark text-pink-dark
                    hover:bg-pink-light hover:scale-105 active:scale-95
                    transition-all duration-300
                  "
                >
                  🔄 Zacznij od początku
                </button>
              </div>
            )}
          </LeftColumn>

          {/* PRAWA KOLUMNA - desktop */}
          <div className="hidden md:flex flex-1 min-h-0">
            <RightColumn
              title={
                step === "swiping" && hasUserSwiped
                  ? "Macierz Polubień"
                  : step === "swiping"
                  ? "Macierz Dopasowań"
                  : step === "preferences"
                  ? "Macierz Preferencji"
                  : "Macierz Użytkownik-Cecha"
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
                    Macierz A pokazuje zainteresowania wszystkich użytkowników.
                    <br />
                    <strong>1</strong> = lubi przedmiot, <strong>0</strong> =
                    nie lubi
                  </p>
                  <UserMatrix
                    users={allUsers}
                    highlightUserId={currentUser?.id}
                  />
                </div>
              )}

              {step === "preferences" && currentUser && (
                <PreferenceMatrix
                  users={allUsers}
                  highlightUserId={currentUser.id}
                />
              )}

              {step === "swiping" && currentUser && !hasUserSwiped && (
                <CombinedMatrix
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

          {/* PRAWA KOLUMNA - mobile (wysuwany panel) */}
          <MobileSlidePanel
            title={
              step === "swiping" && hasUserSwiped
                ? "Macierz Polubień"
                : step === "swiping"
                ? "Macierz Podobieństwa"
                : step === "preferences"
                ? "Macierz Preferencji"
                : "Macierz Użytkownik-Cecha"
            }
            changeCount={panelChangeCount}
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
                  Macierz A pokazuje zainteresowania wszystkich użytkowników.
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

            {step === "preferences" && currentUser && (
              <PreferenceMatrix
                users={allUsers}
                highlightUserId={currentUser.id}
              />
            )}

            {step === "swiping" && currentUser && !hasUserSwiped && (
              <CombinedMatrix
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
          </MobileSlidePanel>
        </div>
      </main>

      <footer className="text-center py-2 md:py-4 text-text-dark/50 text-xs md:text-sm px-2">
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
