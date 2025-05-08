import React, { useState, useId } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

export function PasswordInput({ value, onChange, error, disabled = false }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        Hasło
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          name="password"
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={`w-full px-3 py-2 border rounded-md text-sm pr-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
            error ? "border-destructive focus-visible:ring-destructive/50" : "border-input"
          }`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
          aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
          disabled={disabled}
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export default PasswordInput;
