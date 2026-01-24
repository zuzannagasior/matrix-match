import { useState } from "react";

import { AvatarPicker } from "./AvatarPicker";
import { SubjectMultiSelect } from "./SubjectMultiSelect";

import type { User } from "../../types";
interface UserFormProps {
  onSubmit: (user: User) => void;
}

export function UserForm({ onSubmit }: UserFormProps) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("avatar-1");
  const [interests, setInterests] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);

  const isValid =
    name.trim().length > 0 && interests.length > 0 && preferences.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const newUser: User = {
      id: crypto.randomUUID(),
      name: name.trim(),
      avatar,
      interests,
      preferences,
      createdAt: Date.now(),
    };

    onSubmit(newUser);

    // Reset formularza
    setName("");
    setAvatar("avatar-1");
    setInterests([]);
    setPreferences([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Imię */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-text-dark"
        >
          Twoje imię
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Wpisz swoje imię..."
          className="
            w-full px-4 py-3 rounded-xl border-2 border-pink-medium/30
            bg-white/70 text-text-dark placeholder:text-text-dark/40
            focus:outline-none focus:border-pink-dark focus:ring-2 focus:ring-pink-dark/20
            transition-all duration-200
          "
        />
      </div>

      {/* Avatar */}
      <AvatarPicker value={avatar} onChange={setAvatar} />

      {/* Moje zainteresowania */}
      <div className="bg-pink-light/30 rounded-xl p-4">
        <SubjectMultiSelect
          value={interests}
          onChange={setInterests}
          label="Moje zainteresowania"
          description="Wybierz przedmioty, które Cię interesują"
          emptyMessage="Wybierz przynajmniej jeden przedmiot 💕"
          variant="pink"
        />
      </div>

      {/* Preferencje partnera */}
      <div className="bg-purple-100/30 rounded-xl p-4">
        <SubjectMultiSelect
          value={preferences}
          onChange={setPreferences}
          label="Szukam kogoś, kto lubi..."
          description="Jakich zainteresowań szukasz u partnera?"
          emptyMessage="Wybierz przynajmniej jeden przedmiot 🔍"
          variant="purple"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-lg
          transition-all duration-300
          ${
            isValid
              ? "bg-gradient-romantic text-white shadow-romantic hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        Dołącz do Matrix Match 💕
      </button>
    </form>
  );
}
