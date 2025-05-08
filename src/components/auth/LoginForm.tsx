import React from "react";
import { useLoginForm } from "../hooks/useLoginForm";
import { Button } from "@/components/ui/button";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import FormErrors from "./FormErrors";
import type { AuthResponse } from "@/types";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  onSuccess?: (authResponse: AuthResponse) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { data, errors, isLoading, isSubmitted, handleInputChange, performLoginAttempt } = useLoginForm(onSuccess);

  const formErrors = errors.form ? [errors.form] : [];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    performLoginAttempt();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formErrors.length > 0 && <FormErrors errors={formErrors} />}

      <EmailInput
        value={data.email}
        onChange={handleInputChange}
        error={isSubmitted ? errors.email : undefined}
        disabled={isLoading}
      />

      <PasswordInput
        value={data.password}
        onChange={handleInputChange}
        error={isSubmitted ? errors.password : undefined}
        disabled={isLoading}
      />

      <div className="mt-6">
        <Button type="submit" className="w-full h-10" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Logowanie...
            </>
          ) : (
            "Zaloguj się"
          )}
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
