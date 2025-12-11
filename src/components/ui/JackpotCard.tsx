import React from "react";

interface JackpotCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const JackpotCard: React.FC<JackpotCardProps> = ({
  children,
  className = "",
  noPadding = false,
}) => {
  return (
    <div
      className={`rounded-xl border border-border bg-card text-card-foreground shadow-sm card-gradient ${className}`}
    >
      <div className={noPadding ? "" : "p-6"}>{children}</div>
    </div>
  );
};
