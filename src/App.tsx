import { Header, LeftColumn, RightColumn } from "./components/Layout";
import { UserForm } from "./components/UserForm";
import { useLocalStorage } from "./hooks";

import type { User } from "./types";
function App() {
  const [users, setUsers] = useLocalStorage<User[]>("matrix-match-users", []);

  const handleAddUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-6">
        <div className="flex gap-6 flex-1 min-h-0">
          <LeftColumn>
            <UserForm onSubmit={handleAddUser} />
          </LeftColumn>

          <RightColumn title="Wizualizacja Macierzy">
            {users.length === 0 ? (
              <div className="text-center text-text-dark/60 py-12">
                <p className="text-4xl mb-4">📊</p>
                <p>Dodaj użytkownika, aby zobaczyć macierz</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-text-dark/70 text-center">
                  Użytkownicy w puli: <strong>{users.length}</strong>
                </p>
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 bg-white/50 rounded-xl px-4 py-3"
                    >
                      <span className="text-2xl">👤</span>
                      <div className="flex-1">
                        <p className="font-medium text-text-dark">
                          {user.name}
                        </p>
                        <p className="text-xs text-text-dark/50">
                          {user.interests.length} przedmiotów
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
