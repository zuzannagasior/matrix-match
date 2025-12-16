import type { Subject } from "../types";

/**
 * Predefiniowana lista przedmiotów na studiach
 */
export const SUBJECTS: Subject[] = [
  { id: "debaty-tech", name: "Aktualne debaty o technologii", emoji: "💬" },
  { id: "angielski", name: "Język angielski", emoji: "🇬🇧" },
  { id: "matematyka", name: "Matematyka", emoji: "📐" },
  { id: "psych-tech", name: "Psychologia i technologia", emoji: "🧠" },
  { id: "umiej-akad", name: "Umiejętności akademickie", emoji: "📚" },
  { id: "intro-info", name: "Wprowadzenie do informatyki", emoji: "💻" },
  { id: "intro-psych", name: "Wprowadzenie do psychologii", emoji: "🔮" },
  {
    id: "intro-psych-spol",
    name: "Wprowadzenie do psychologii społecznej",
    emoji: "👥",
  },
];

/**
 * Pobierz przedmiot po ID
 */
export function getSubjectById(id: string): Subject | undefined {
  return SUBJECTS.find((subject) => subject.id === id);
}

/**
 * Pobierz nazwy przedmiotów dla listy ID
 */
export function getSubjectNames(ids: string[]): string[] {
  return ids
    .map((id) => getSubjectById(id)?.name)
    .filter((name): name is string => name !== undefined);
}
