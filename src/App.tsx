import { Header, LeftColumn, RightColumn } from "./components/Layout";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <div className="flex gap-6 h-full">
          <LeftColumn title="Demo">
            <div className="text-center text-text-dark/60 py-12">
              <p className="text-4xl mb-4">👤</p>
              <p>Tu pojawi się formularz rejestracji</p>
            </div>
          </LeftColumn>

          <RightColumn title="Wizualizacja Macierzy">
            <div className="text-center text-text-dark/60 py-12">
              <p className="text-4xl mb-4">📊</p>
              <p>Tu pojawi się macierz użytkowników</p>
            </div>
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
