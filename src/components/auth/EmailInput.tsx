import React, { useId } from "react";

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

export function EmailInput({ value, onChange, error, disabled = false }: EmailInputProps) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        id={id}
        type="email"
        name="email"
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
          error ? "border-destructive focus-visible:ring-destructive/50" : "border-input"
        }`}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export default EmailInput;
