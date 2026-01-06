import type { ReactNode } from "react";

interface RightColumnProps {
  children: ReactNode;
  title?: string;
}

export function RightColumn({ children, title }: RightColumnProps) {
  return (
    <section className="flex-1 flex flex-col bg-white/70 backdrop-blur-sm rounded-2xl shadow-romantic p-6 overflow-hidden min-h-0">
      {title && (
        <h2 className="text-2xl text-pink-dark mb-4 text-center flex-shrink-0">
          {title}
        </h2>
      )}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0">{children}</div>
    </section>
  );
}
