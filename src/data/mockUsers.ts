import type { User } from "../types";

/**
 * Zahardkodowani użytkownicy w puli
 * interests = co mam (moje zainteresowania)
 * preferences = czego szukam u partnera
 */
export const MOCK_USERS: User[] = [
  {
    id: "mock-1",
    name: "Ania",
    avatar: "woman1",
    interests: ["matematyka", "intro-psych", "angielski", "psych-tech"],
    preferences: ["intro-info", "debaty-tech", "matematyka"], // szuka technika
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "mock-2",
    name: "Andrzej",
    avatar: "man1",
    interests: ["intro-info", "matematyka", "debaty-tech"],
    preferences: ["intro-psych", "psych-tech", "intro-psych-spol"], // szuka psychologa
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: "mock-3",
    name: "Maja",
    avatar: "woman2",
    interests: ["intro-psych", "intro-psych-spol", "umiej-akad"],
    preferences: ["angielski", "umiej-akad", "intro-psych"], // szuka kogoś ambitnego
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "mock-4",
    name: "Tomek",
    avatar: "man2",
    interests: ["intro-info", "debaty-tech", "matematyka", "angielski"],
    preferences: ["psych-tech", "intro-psych-spol", "debaty-tech"], // szuka kogoś z psycho-tech
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "mock-5",
    name: "Monika",
    avatar: "woman3",
    interests: ["psych-tech", "intro-psych-spol", "umiej-akad"],
    preferences: ["matematyka", "intro-info", "angielski"], // szuka technika
    createdAt: Date.now() - 86400000,
  },
  {
    id: "mock-6",
    name: "Michał",
    avatar: "man3",
    interests: [
      "matematyka",
      "intro-info",
      "angielski",
      "debaty-tech",
      "psych-tech",
    ],
    preferences: ["intro-psych", "intro-psych-spol", "umiej-akad"], // szuka humanisty
    createdAt: Date.now() - 43200000,
  },
];
