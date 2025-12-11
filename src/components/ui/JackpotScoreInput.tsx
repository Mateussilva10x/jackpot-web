import React from "react";

interface JackpotScoreInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string | number;
  onChange: (value: string) => void;
  teamLabel?: string;
}

export const JackpotScoreInput: React.FC<JackpotScoreInputProps> = ({
  value,
  onChange,
  teamLabel,
  className = "",
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;

    if (/^\d{0,2}$/.test(newVal)) {
      onChange(newVal);
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={handleChange}
      aria-label={teamLabel || "Score input"}
      className={`score-input ${className}`}
      placeholder="-"
      {...props}
    />
  );
};
