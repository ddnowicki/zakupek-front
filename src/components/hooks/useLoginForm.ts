import React, { useState, useEffect, useMemo } from "react";
import { AuthService } from "@/lib/services/auth";
import { ApiClient, HandledError } from "@/lib/api";
import type { AuthResponse, LoginRequest } from "@/types";
import { loginSchema } from "@/lib/validation";

export interface LoginFormData extends LoginRequest {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  form?: string;
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
      errors: { ...prev.errors, [name]: undefined, form: undefined },
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
    setState((prev) => ({ ...prev, isSubmitted: true, errors: { ...prev.errors, form: undefined } }));

    const validationResult = validateForm();
    if (!validationResult.isValid) {
      setState((prev) => ({ ...prev, errors: { ...prev.errors, ...validationResult.errors } }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await authService.login(state.data);

      // Debug - log response
      console.log('Login response:', {
        userId: response.userId,
        userName: response.userName,
        token: response.accessToken,
        expiresAt: response.expiresAt
      });

      // Save auth data
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("token_expires", response.expiresAt);
      localStorage.setItem("user_id", response.userId.toString());

      // Debug - verify saved data
      console.log('Saved in localStorage:', {
        token: localStorage.getItem("token"),
        expires: localStorage.getItem("token_expires"),
        userId: localStorage.getItem("user_id")
      });

      if (onSuccess) {
        onSuccess(response);
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        redirectTo: "/lists",
      }));

      // Debug - log before navigation
      console.log('Redirecting to /lists with token:', localStorage.getItem("token"));

    } catch (error: unknown) {
      let formErrorMessage = "Wystąpił nieznany błąd podczas logowania.";

      if (error instanceof HandledError) {
        if (error.status === 401) {
          formErrorMessage = "Nieprawidłowy login lub hasło.";
        } else if (error.message) {
          formErrorMessage = error.message;
        }
      } else if (error instanceof Error) {
        formErrorMessage = error.message;
      }

      console.error('Login error:', error);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        errors: {
          ...prev.errors,
          form: formErrorMessage,
        },
      }));
    }
  };

  return {
    ...state,
    handleInputChange,
    performLoginAttempt,
  };
}
