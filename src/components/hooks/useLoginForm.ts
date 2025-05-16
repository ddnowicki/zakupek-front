import React, { useState, useEffect, useMemo } from "react";
import { AuthService } from "@/lib/services/auth";
import { ApiClient, HandledError } from "@/lib/api";
import type { AuthResponse, LoginRequest } from "@/types";
import { loginSchema } from "@/lib/validation";
import { toast } from "sonner";

export interface LoginFormData extends LoginRequest {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface LoginFormState {
  isLoading: boolean;
  data: LoginFormData;
  errors: LoginFormErrors;
  isSubmitted: boolean;
  redirectTo: string | null;
}

export function useLoginForm(onSuccess?: (authResponse: AuthResponse) => void) {
  const [state, setState] = useState<LoginFormState>({
    isLoading: false,
    data: { email: "", password: "" },
    errors: {},
    isSubmitted: false,
    redirectTo: null,
  });

  const apiClient = useMemo(() => new ApiClient(), []);
  const authService = useMemo(() => new AuthService(apiClient), [apiClient]);

  useEffect(() => {
    if (state.redirectTo) {
      window.location.href = state.redirectTo;
    }
  }, [state.redirectTo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: value },
      errors: { ...prev.errors, [name]: undefined },
    }));
  };

  const validateForm = (): { isValid: boolean; errors: LoginFormErrors } => {
    const result = loginSchema.safeParse(state.data);

    if (result.success) {
      return { isValid: true, errors: {} };
    }

    const newErrors: LoginFormErrors = {};
    if (result.error.formErrors.fieldErrors.email) {
      newErrors.email = result.error.formErrors.fieldErrors.email[0];
    }
    if (result.error.formErrors.fieldErrors.password) {
      newErrors.password = result.error.formErrors.fieldErrors.password[0];
    }
    return { isValid: false, errors: newErrors };
  };

  const performLoginAttempt = async () => {
    setState((prev) => ({ ...prev, isSubmitted: true }));

    const validationResult = validateForm();
    if (!validationResult.isValid) {
      setState((prev) => ({ ...prev, errors: { ...prev.errors, ...validationResult.errors } }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await authService.login(state.data);
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("token_expires", response.expiresAt);
      localStorage.setItem("user_id", response.userId.toString());

      if (onSuccess) {
        onSuccess(response);
      }

      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirectUrl");

      setState((prev) => ({
        ...prev,
        isLoading: false,
        redirectTo: redirectUrl || "/lists",
      }));
    } catch (error: unknown) {
      if (error instanceof HandledError) {
        if (error.status === 401) {
          toast.error("Błąd logowania", {
            description: "Nieprawidłowy login lub hasło.",
          });
        } else {
          toast.error("Błąd logowania", {
            description: error.message,
          });
        }
      } else if (error instanceof Error) {
        toast.error("Błąd logowania", {
          description: error.message,
        });
      } else {
        toast.error("Wystąpił nieznany błąd podczas logowania.");
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  return {
    ...state,
    handleInputChange,
    performLoginAttempt,
  };
}
