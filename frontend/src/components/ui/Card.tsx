import type { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={clsx(
      "rounded-lg border border-gray-200 bg-white p-5 shadow-sm",
      className
    )}>
      {title && (
        <h2 className="mb-4 text-lg font-semibold">
          {title}
        </h2>
      )}

      {children}
    </div>
  );
};
