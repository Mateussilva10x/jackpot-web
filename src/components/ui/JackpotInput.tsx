import React from "react";

interface JackpotInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}

export const JackpotInput: React.FC<JackpotInputProps> = ({
  label,
  errorMessage,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <input
        className={`
          flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground 
          ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium 
          placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
          transition-all duration-200
          ${
            errorMessage
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }
          ${className}
        `}
        {...props}
      />

      {errorMessage && (
        <span className="text-xs text-destructive font-medium animate-pulse">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
