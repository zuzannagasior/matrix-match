import { useCallback, useEffect, useState } from "react";

/**
 * Hook do synchronizacji stanu z LocalStorage
 * @param key - klucz w LocalStorage
 * @param initialValue - wartość domyślna
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Inicjalizacja stanu z LocalStorage lub wartości domyślnej
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Błąd odczytu z LocalStorage (${key}):`, error);
      return initialValue;
    }
  });

  // Zapis do LocalStorage przy zmianie wartości
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Błąd zapisu do LocalStorage (${key}):`, error);
    }
  }, [key, storedValue]);

  // Funkcja do czyszczenia wartości
  const clearValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Błąd usuwania z LocalStorage (${key}):`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setStoredValue, clearValue];
}
