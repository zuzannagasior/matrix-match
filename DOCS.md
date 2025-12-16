# 💕 Matrix Match - Demo Aplikacji Randkowej

## 📌 Opis Projektu

Aplikacja demonstracyjna na zajęcia z matematyki, prezentująca działanie algorytmów dopasowujących użytkowników w aplikacjach randkowych. Demo wizualizuje operacje na macierzach, które są podstawą systemów rekomendacji.

### Cel edukacyjny

Pokazanie w praktyce jak matematyka (operacje macierzowe) jest wykorzystywana w realnych aplikacjach - systemach matchowania użytkowników.

---

## 🛠️ Technologie

- **Framework:** React 18+ z TypeScript
- **Bundler:** Vite
- **Stylowanie:** Tailwind CSS
- **Baza danych:** LocalStorage (dane przechowywane lokalnie)
- **Styl wizualny:** Romantyczny, walentynkowy, słodki 💘

---

## 📐 Struktura UI

Aplikacja składa się z **dwóch kolumn** (layout desktopowy):

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
│                   "Matrix Match 💕"                         │
├─────────────────────────┬───────────────────────────────────┤
│                         │                                   │
│    LEWA KOLUMNA         │      PRAWA KOLUMNA               │
│    (Demo/Interakcja)    │      (Wizualizacja Macierzy)     │
│                         │                                   │
│    - Formularz          │      - Tabela macierzy           │
│    - Lista użytkowników │      - Operacje matematyczne     │
│    - Karty swipe        │      - Wyniki obliczeń           │
│                         │                                   │
└─────────────────────────┴───────────────────────────────────┘
```

> **Uwaga:** Responsywność dla urządzeń mobilnych będzie dodana w późniejszym etapie.

---

## 🎯 Kroki Demo (Flow Aplikacji)

### Krok 1: Dodanie użytkownika do puli

**Lewa kolumna:**

- Formularz rejestracji użytkownika:
  - Pole tekstowe: **Imię**
  - Wybór **avatara** (predefiniowany zestaw)
  - **Multiselect** z ulubionymi przedmiotami na studiach

**Prawa kolumna:**

- Wizualizacja macierzy użytkowników
- Nowy wiersz dodawany do macierzy
- Kolumny = przedmioty (zainteresowania)
- Wartości: `1` = lubi, `0` = nie lubi

```
Macierz Użytkowników (U):

                    | Psych. Społ. | Statystyka | Neuropsych. | Metodologia |
--------------------|--------------|------------|-------------|-------------|
Anna                |      1       |     0      |      1      |      0      |
Marek               |      1       |     1      |      0      |      1      |
Kasia (nowy user)   |      0       |     1      |      1      |      1      |
```

---

### Krok 2: Wyświetlenie użytkowników posortowanych po dopasowaniu

**Lewa kolumna:**

- Lista użytkowników z puli wyświetlona w kolejności od najbardziej do najmniej dopasowanych
- Każdy użytkownik pokazany z avatarem, imieniem i % dopasowania

**Prawa kolumna:**

- Wizualizacja mnożenia macierzy
- Obliczenie similarity score dla każdej pary użytkowników
- Wzór: `Similarity = U × Uᵀ` (mnożenie macierzy przez jej transpozycję)

```
Obliczenie dopasowania dla aktualnego użytkownika (Kasia):

Kasia × Anna  = (0×1) + (1×0) + (1×1) + (1×0) = 1
Kasia × Marek = (0×1) + (1×1) + (1×0) + (1×1) = 2

Wynik: Marek (2 wspólne) > Anna (1 wspólny)
```

---

### Krok 3: Swipe Left / Right

**Lewa kolumna:**

- Interfejs kart do swipe'owania (styl Tinder)
- **Swipe Right (→)** = Lubię 💚
- **Swipe Left (←)** = Nie lubię ❌
- Animacje przy swipe'owaniu

**Prawa kolumna:**

- Macierz swipe'ów (kto kogo polubił)
- Aktualizacja wartości w macierzy po każdym swipe'ie
- `1` = polubił, `0` = nie polubił, `-` = jeszcze nie ocenił

```
Macierz Swipe'ów (S):

        | Anna | Marek | Kasia |
--------|------|-------|-------|
Anna    |  -   |   1   |   0   |
Marek   |  1   |   -   |   1   |
Kasia   |  0   |   1   |   -   |
```

---

### Krok 4: Match! 💕

**Lewa kolumna:**

- Popup/modal z informacją **"MATCH! 💕"**
- Animacja konfetti/serduszek
- Wyświetlenie avatarów obu użytkowników

**Prawa kolumna:**

- Wizualizacja wykrycia matcha w macierzy
- Podświetlenie komórek: `S[i][j] = 1` AND `S[j][i] = 1`
- Wyjaśnienie operacji matematycznej

```
Wykrycie Match:

S[Kasia][Marek] = 1  ✓
S[Marek][Kasia] = 1  ✓

MATCH! 🎉 (oba warunki spełnione)
```

---

## 📊 Struktury Danych (LocalStorage)

### Użytkownicy

```typescript
interface User {
  id: string;
  name: string;
  avatar: string; // identyfikator avatara
  interests: string[]; // lista ID przedmiotów
  createdAt: number;
}
```

### Przedmioty (zainteresowania)

```typescript
interface Subject {
  id: string;
  name: string;
  emoji: string;
}

// Predefiniowana lista:
const SUBJECTS: Subject[] = [
  { id: "psych-spol", name: "Psychologia społeczna", emoji: "🧠" },
  { id: "statystyka", name: "Statystyka", emoji: "📊" },
  { id: "neuropsych", name: "Neuropsychologia", emoji: "🔬" },
  { id: "metodologia", name: "Metodologia badań", emoji: "📋" },
  { id: "psych-rozwoj", name: "Psychologia rozwojowa", emoji: "👶" },
  { id: "psych-klin", name: "Psychologia kliniczna", emoji: "💊" },
  { id: "kognityw", name: "Psychologia poznawcza", emoji: "💡" },
  { id: "emocje", name: "Psychologia emocji", emoji: "❤️" },
];
```

### Swipe'y

```typescript
interface Swipe {
  visitorId: string;
  targetId: string;
  liked: boolean;
  timestamp: number;
}
```

### Matche

```typescript
interface Match {
  user1Id: string;
  user2Id: string;
  matchedAt: number;
}
```

---

## 🎨 Styl Wizualny

### Paleta kolorów (walentynkowa/romantyczna)

```css
:root {
  --pink-light: #fff0f5; /* Lavender blush - tło */
  --pink-medium: #ffb6c1; /* Light pink */
  --pink-dark: #ff69b4; /* Hot pink - akcenty */
  --red-heart: #ff1744; /* Czerwony - serca, matche */
  --purple-soft: #e8d5e8; /* Jasny fiolet */
  --white: #ffffff;
  --text-dark: #4a4a4a;
  --success: #4caf50; /* Zielony - swipe right */
  --danger: #9e9e9e; /* Szary - swipe left */
}
```

### Typografia

- **Nagłówki:** Font dekoracyjny, romantyczny (np. "Pacifico", "Dancing Script")
- **Tekst:** Czytelny sans-serif (np. "Poppins", "Nunito")

### Elementy UI

- Zaokrąglone rogi (`rounded-2xl`, `rounded-full`)
- Delikatne cienie (`shadow-lg`, `shadow-pink-200`)
- Gradienty różowo-fioletowe
- Ikony serduszek 💕 💘 💖
- Animacje: płynne przejścia, bounce effect na matchach

---

## 🗂️ Struktura Plików (propozycja)

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── LeftColumn.tsx
│   │   └── RightColumn.tsx
│   ├── UserForm/
│   │   ├── UserForm.tsx
│   │   ├── AvatarPicker.tsx
│   │   └── SubjectMultiSelect.tsx
│   ├── SwipeCard/
│   │   ├── SwipeCard.tsx
│   │   └── SwipeControls.tsx
│   ├── Matrix/
│   │   ├── UserMatrix.tsx
│   │   ├── SwipeMatrix.tsx
│   │   └── MatrixCell.tsx
│   ├── Match/
│   │   └── MatchModal.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Avatar.tsx
│       └── Badge.tsx
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useUsers.ts
│   ├── useSwipes.ts
│   └── useMatching.ts
├── utils/
│   ├── matrix.ts          # Operacje na macierzach
│   ├── matching.ts        # Algorytmy dopasowania
│   └── storage.ts         # Funkcje LocalStorage
├── data/
│   ├── subjects.ts        # Lista przedmiotów
│   └── avatars.ts         # Lista dostępnych avatarów
├── types/
│   └── index.ts           # Interfejsy TypeScript
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

---

## 🔢 Algorytmy Matematyczne

### 1. Macierz zainteresowań użytkowników (U)

- Wymiary: `n × m` (n = liczba użytkowników, m = liczba przedmiotów)
- Wartości binarne: 1 (lubi) lub 0 (nie lubi)

### 2. Obliczenie podobieństwa (Similarity Matrix)

```
S = U × Uᵀ
```

- Wynik: macierz `n × n`
- `S[i][j]` = liczba wspólnych zainteresowań użytkowników i oraz j

### 3. Macierz swipe'ów (L - Likes)

- Wymiary: `n × n`
- `L[i][j] = 1` gdy użytkownik i polubił użytkownika j
- `L[i][j] = 0` gdy użytkownik i odrzucił użytkownika j
- `L[i][j] = null` gdy jeszcze nie ocenił

### 4. Wykrywanie matchy

```
Match(i, j) = L[i][j] = 1 AND L[j][i] = 1
```

---

## 📝 TODO / Roadmap

- [ ] Krok 1: Setup podstawowy + komponenty Layout
- [ ] Krok 2: Formularz dodawania użytkownika
- [ ] Krok 3: Wizualizacja macierzy użytkowników
- [ ] Krok 4: Algorytm sortowania po dopasowaniu
- [ ] Krok 5: Interfejs swipe'ów
- [ ] Krok 6: Macierz swipe'ów + wykrywanie matchy
- [ ] Krok 7: Modal matcha z animacjami
- [ ] Krok 8: Generowanie losowych swipe'ów innych użytkowników
- [ ] Krok 9: Polish & animacje
- [ ] Krok 10: (Opcjonalnie) Responsywność mobile

---

## 🚀 Uruchomienie projektu

```bash
# Instalacja zależności
pnpm install

# Uruchomienie dev server
pnpm dev

# Build produkcyjny
pnpm build
```

---

_Dokumentacja stworzona dla projektu edukacyjnego SWPS - Matematyka w technologii_ 💕
