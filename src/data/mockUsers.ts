import type { User } from "../types";

/**
 * Zahardkodowani użytkownicy w puli
 */
export const MOCK_USERS: User[] = [
  {
    id: "mock-1",
    name: "Ania",
    avatar: "avatar-1",
    interests: ["matematyka", "intro-psych", "angielski", "psych-tech"],
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "mock-2",
    name: "Kacper",
    avatar: "avatar-2",
    interests: ["intro-info", "matematyka", "debaty-tech"],
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: "mock-3",
    name: "Maja",
    avatar: "avatar-3",
    interests: ["intro-psych", "intro-psych-spol", "emocje", "umiej-akad"],
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "mock-4",
    name: "Tomek",
    avatar: "avatar-4",
    interests: ["intro-info", "debaty-tech", "matematyka", "angielski"],
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "mock-5",
    name: "Zuzia",
    avatar: "avatar-5",
    interests: ["psych-tech", "intro-psych-spol", "umiej-akad"],
    createdAt: Date.now() - 86400000,
  },
  {
    id: "mock-6",
    name: "Michał",
    avatar: "avatar-6",
    interests: [
      "matematyka",
      "intro-info",
      "angielski",
      "debaty-tech",
      "psych-tech",
    ],
    createdAt: Date.now() - 43200000,
  },
];
