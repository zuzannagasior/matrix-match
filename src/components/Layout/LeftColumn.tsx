import type { ReactNode } from "react";

interface LeftColumnProps {
  children: ReactNode;
  title?: string;
}

export function LeftColumn({ children, title }: LeftColumnProps) {
  return (
    <section className="flex-1 flex flex-col bg-white/70 backdrop-blur-sm rounded-2xl shadow-romantic p-3 md:p-6 md:overflow-hidden md:min-h-0 max-w-full">
      {title && (
        <h2 className="text-2xl text-pink-dark mb-4 text-center flex-shrink-0">
          {title}
        </h2>
      )}
      <div className="flex-1 md:overflow-y-auto overflow-x-hidden space-y-4 md:min-h-0">
        {children}
      </div>
    </section>
  );
}
