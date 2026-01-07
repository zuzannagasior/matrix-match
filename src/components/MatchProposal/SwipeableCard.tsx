import { ReactNode, TouchEvent, type, useCallback, useRef, useState } from "react";

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  swiping: boolean;
}

const SWIPE_THRESHOLD = 100; // Minimalna odległość w px do zaakceptowania swipe'a
const ROTATION_FACTOR = 0.1; // Współczynnik rotacji karty

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
}: SwipeableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    swiping: false,
  });
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null
  );

  const deltaX = swipeState.currentX - swipeState.startX;
  const deltaY = swipeState.currentY - swipeState.startY;
  const rotation = deltaX * ROTATION_FACTOR;

  // Oblicz opacity dla wskaźników LIKE/NOPE
  const likeOpacity = Math.min(Math.max(deltaX / SWIPE_THRESHOLD, 0), 1);
  const nopeOpacity = Math.min(Math.max(-deltaX / SWIPE_THRESHOLD, 0), 1);

  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setSwipeState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      swiping: true,
    });
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (!swipeState.swiping) return;

      const touch = e.touches[0];
      setSwipeState((prev) => ({
        ...prev,
        currentX: touch.clientX,
        currentY: touch.clientY,
      }));
    },
    [swipeState.swiping]
  );

  const handleTouchEnd = useCallback(() => {
    if (!swipeState.swiping) return;

    const deltaX = swipeState.currentX - swipeState.startX;

    if (deltaX > SWIPE_THRESHOLD) {
      // Swipe right - LIKE
      setExitDirection("right");
      setTimeout(() => {
        onSwipeRight();
        setExitDirection(null);
        setSwipeState({
          startX: 0,
          startY: 0,
          currentX: 0,
          currentY: 0,
          swiping: false,
        });
      }, 300);
    } else if (deltaX < -SWIPE_THRESHOLD) {
      // Swipe left - NOPE
      setExitDirection("left");
      setTimeout(() => {
        onSwipeLeft();
        setExitDirection(null);
        setSwipeState({
          startX: 0,
          startY: 0,
          currentX: 0,
          currentY: 0,
          swiping: false,
        });
      }, 300);
    } else {
      // Reset - swipe niewystarczający
      setSwipeState({
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        swiping: false,
      });
    }
  }, [swipeState, onSwipeLeft, onSwipeRight]);

  // Style karty podczas swipe'a
  const getCardStyle = () => {
    if (exitDirection === "left") {
      return {
        transform: `translateX(-150%) rotate(-30deg)`,
        transition: "transform 0.3s ease-out",
        opacity: 0,
      };
    }
    if (exitDirection === "right") {
      return {
        transform: `translateX(150%) rotate(30deg)`,
        transition: "transform 0.3s ease-out",
        opacity: 0,
      };
    }
    if (swipeState.swiping) {
      return {
        transform: `translateX(${deltaX}px) translateY(${
          deltaY * 0.3
        }px) rotate(${rotation}deg)`,
        transition: "none",
      };
    }
    return {
      transform: "translateX(0) translateY(0) rotate(0deg)",
      transition: "transform 0.3s ease-out",
    };
  };

  return (
    <div className="relative w-full h-full touch-none">
      {/* Wskaźnik LIKE (prawa strona) */}
      <div
        className="absolute top-8 right-4 z-20 px-4 py-2 border-4 border-green-500 rounded-lg
          text-green-500 font-bold text-2xl rotate-12 pointer-events-none md:hidden"
        style={{
          opacity: likeOpacity,
          transform: `rotate(12deg) scale(${0.8 + likeOpacity * 0.2})`,
        }}
      >
        💚 LIKE
      </div>

      {/* Wskaźnik NOPE (lewa strona) */}
      <div
        className="absolute top-8 left-4 z-20 px-4 py-2 border-4 border-red-500 rounded-lg
          text-red-500 font-bold text-2xl -rotate-12 pointer-events-none md:hidden"
        style={{
          opacity: nopeOpacity,
          transform: `rotate(-12deg) scale(${0.8 + nopeOpacity * 0.2})`,
        }}
      >
        ❌ NOPE
      </div>

      {/* Karta */}
      <div
        ref={cardRef}
        className="w-full h-full"
        style={getCardStyle()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>

      {/* Podpowiedź swipe na mobile */}
      {!swipeState.swiping && !exitDirection && (
        <div className="absolute bottom-2 left-0 right-0 text-center text-text-dark/40 text-xs md:hidden animate-pulse">
          👈 Przesuń w lewo lub prawo 👉
        </div>
      )}
    </div>
  );
}
