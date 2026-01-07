import { useState } from "react";

import { AVATARS, getAvatarSrc } from "../../data";

interface AvatarPickerProps {
  value: string;
  onChange: (avatarId: string) => void;
}

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (avatarId: string) => {
    setFailedImages((prev) => new Set(prev).add(avatarId));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text-dark">
        Wybierz avatar
      </label>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 pt-2">
        {AVATARS.map((avatar) => {
          const isSelected = value === avatar.id;
          const showFallback = failedImages.has(avatar.id);

          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onChange(avatar.id)}
              className={`
                relative flex-shrink-0 w-14 h-14 rounded-xl border-2 transition-all duration-200
                flex items-center justify-center overflow-hidden
                hover:scale-110
                ${
                  isSelected
                    ? "border-pink-dark shadow-romantic bg-pink-light"
                    : "border-pink-medium/30 bg-white/50 hover:border-pink-dark"
                }
              `}
              title={avatar.label}
            >
              {showFallback ? (
                <span className="text-2xl">{avatar.emoji}</span>
              ) : (
                <img
                  src={getAvatarSrc(avatar.id)}
                  alt={avatar.label}
                  className="w-full h-full object-cover object-center p-2"
                  onError={() => handleImageError(avatar.id)}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
