import { useEffect, useRef, useState } from "react";

import type { ReactNode } from "react";

interface MobileSlidePanelProps {
  children: ReactNode;
  title?: string;
  changeCount?: number;
}

export function MobileSlidePanel({
  children,
  title,
  changeCount = 0,
}: MobileSlidePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const prevChangeCount = useRef(changeCount);

  // Animacja kółka gdy zachodzą zmiany (nowy swipe)
  useEffect(() => {
    if (changeCount > prevChangeCount.current && !isOpen) {
      // Używamy setTimeout aby uniknąć synchronicznego setState w efekcie
      const startTimer = setTimeout(() => setShowPulse(true), 0);
      const endTimer = setTimeout(() => setShowPulse(false), 1200);
      prevChangeCount.current = changeCount;
      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
    prevChangeCount.current = changeCount;
  }, [changeCount, isOpen]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
    setShowPulse(false);
  };

  return (
    <>
      {/* Overlay do zamykania panelu po kliknięciu na zewnątrz */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel wysuwany */}
      <div
        className={`
          fixed top-0 right-0 h-full z-50
          bg-white/95 backdrop-blur-sm shadow-romantic
          transition-transform duration-300 ease-out
          w-[85vw] max-w-md
          md:hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Kółko ze strzałką - 30% wystaje */}
        <button
          onClick={togglePanel}
          className={`
            absolute top-1/7 -translate-y-1/2 -left-8
            w-16 h-16 rounded-full
            bg-gradient-romantic shadow-romantic
            flex items-center justify-start pl-2.5
            transition-all duration-300
            hover:scale-110 active:scale-95
            ${showPulse ? "animate-pulse-notify" : ""}
          `}
          aria-label={isOpen ? "Zamknij panel" : "Otwórz panel macierzy"}
        >
          <svg
            className={`
              w-5 h-5 text-white
              transition-transform duration-300
              ${isOpen ? "rotate-180" : "rotate-0"}
            `}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Zawartość panelu */}
        <div className="relative h-full flex flex-col p-4 z-10 bg-white">
          {title && (
            <h2 className="text-lg text-pink-dark mb-3 text-center shrink-0 font-display">
              {title}
            </h2>
          )}
          <div className="flex-1 overflow-auto space-y-3 min-h-0">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
