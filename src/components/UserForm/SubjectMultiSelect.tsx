import { SUBJECTS } from "../../data";

interface SubjectMultiSelectProps {
  value: string[];
  onChange: (subjectIds: string[]) => void;
  label?: string;
  description?: string;
  emptyMessage?: string;
  variant?: "pink" | "purple";
  required?: boolean;
}

export function SubjectMultiSelect({
  value,
  onChange,
  label = "Ulubione przedmioty",
  description,
  emptyMessage = "Wybierz przynajmniej jeden przedmiot 💕",
  variant = "pink",
  required = true,
}: SubjectMultiSelectProps) {
  const toggleSubject = (subjectId: string) => {
    if (value.includes(subjectId)) {
      onChange(value.filter((id) => id !== subjectId));
    } else {
      onChange([...value, subjectId]);
    }
  };

  // Kolory w zależności od wariantu
  const colors = {
    pink: {
      selected: "bg-pink-dark text-white shadow-md",
      hover: "hover:bg-pink-light",
      checkmark: "bg-white border-white text-pink-dark",
      border: "border-pink-medium",
      empty: "text-pink-dark/70",
    },
    purple: {
      selected: "bg-purple-600 text-white shadow-md",
      hover: "hover:bg-purple-100",
      checkmark: "bg-white border-white text-purple-600",
      border: "border-purple-400",
      empty: "text-purple-600/70",
    },
  };

  const colorScheme = colors[variant];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-dark">
        {label}{" "}
        <span className="text-text-dark/50">({value.length} wybrano)</span>
      </label>
      {description && (
        <p className="text-xs text-text-dark/60">{description}</p>
      )}
      <div className="space-y-2 md:overflow-y-auto md:pr-2">
        {SUBJECTS.map((subject) => {
          const isSelected = value.includes(subject.id);
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => toggleSubject(subject.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                transition-all duration-200 text-left
                ${
                  isSelected
                    ? colorScheme.selected
                    : `bg-white/50 text-text-dark ${colorScheme.hover}`
                }
              `}
            >
              <span className="text-lg">{subject.emoji}</span>
              <span className="flex-1 font-medium text-sm">{subject.name}</span>
              <span
                className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs
                  transition-all duration-200
                  ${
                    isSelected
                      ? colorScheme.checkmark
                      : colorScheme.border
                  }
                `}
              >
                {isSelected && "✓"}
              </span>
            </button>
          );
        })}
      </div>
      {required && value.length === 0 && (
        <p className={`text-sm ${colorScheme.empty}`}>{emptyMessage}</p>
      )}
    </div>
  );
}
