import type { ReactNode } from "react";

interface LeftColumnProps {
  children: ReactNode;
  title?: string;
}

export function LeftColumn({ children, title }: LeftColumnProps) {
  return (
    <section className="flex-1 bg-white/70 backdrop-blur-sm rounded-2xl shadow-romantic p-6">
      {title && (
        <h2 className="text-2xl text-pink-dark mb-4 text-center">{title}</h2>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}
