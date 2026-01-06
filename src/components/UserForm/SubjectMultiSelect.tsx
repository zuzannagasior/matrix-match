import { SUBJECTS } from "../../data";

interface SubjectMultiSelectProps {
  value: string[];
  onChange: (subjectIds: string[]) => void;
}

export function SubjectMultiSelect({
  value,
  onChange,
}: SubjectMultiSelectProps) {
  const toggleSubject = (subjectId: string) => {
    if (value.includes(subjectId)) {
      onChange(value.filter((id) => id !== subjectId));
    } else {
      onChange([...value, subjectId]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-dark">
        Ulubione przedmioty{" "}
        <span className="text-text-dark/50">({value.length} wybrano)</span>
      </label>
      <div className="space-y-2 md:max-h-64 md:overflow-y-auto md:pr-2">
        {SUBJECTS.map((subject) => {
          const isSelected = value.includes(subject.id);
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => toggleSubject(subject.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200 text-left
                ${
                  isSelected
                    ? "bg-pink-dark text-white shadow-md"
                    : "bg-white/50 text-text-dark hover:bg-pink-light"
                }
              `}
            >
              <span className="text-xl">{subject.emoji}</span>
              <span className="flex-1 font-medium">{subject.name}</span>
              <span
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  transition-all duration-200
                  ${
                    isSelected
                      ? "bg-white border-white text-pink-dark"
                      : "border-pink-medium"
                  }
                `}
              >
                {isSelected && "✓"}
              </span>
            </button>
          );
        })}
      </div>
      {value.length === 0 && (
        <p className="text-sm text-pink-dark/70">
          Wybierz przynajmniej jeden przedmiot 💕
        </p>
      )}
    </div>
  );
}
