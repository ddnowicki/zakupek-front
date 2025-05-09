import React, { useState } from "react";
import { AuthService } from "@/lib/services/auth";
import { ApiClient, HandledError } from "@/lib/api";
import type { AuthResponse } from "@/types";
import { registerSchema } from "@/lib/validation";
import { useNavigate } from "@/lib/hooks/useNavigate";

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  userName: string;
  householdSize: string;
  ages: string[];
  dietaryPreferences: string[];
}

export interface RegisterFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  userName?: string;
  householdSize?: string;
  ages?: string[];
  form?: string;
}

export interface RegisterFormState {
  isLoading: boolean;
  data: RegisterFormData;
  errors: RegisterFormErrors;
  isSubmitted: boolean;
  redirectTo: string | null;
}

const initialData: RegisterFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  userName: "",
  householdSize: "1",
  ages: [""],
  dietaryPreferences: [],
};

export function useRegisterForm(onSuccess?: (authResponse: AuthResponse) => void) {
  const [state, setState] = useState<RegisterFormState>({
    isLoading: false,
    data: initialData,
    errors: {},
    isSubmitted: false,
    redirectTo: null,
  });

  const apiClient = new ApiClient();
  const authService = new AuthService(apiClient);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => {
      if (name === "householdSize") {
        const newSize = Math.max(1, parseInt(value, 10) || 1);
        const newAges = Array(newSize).fill("");
        prev.data.ages.forEach((age, index) => {
          if (index < newSize) {
            newAges[index] = age;
          }
        });
        return {
          ...prev,
          data: {
            ...prev.data,
            [name]: value,
            ages: newAges,
          },
          errors: { ...prev.errors, [name]: undefined, ages: undefined, form: undefined },
        };
      }

      if (name.startsWith("age-")) {
        const index = parseInt(name.split("-")[1], 10);
        const newAges = [...prev.data.ages];
        newAges[index] = value;
        return {
          ...prev,
          data: { ...prev.data, ages: newAges },
          errors: { ...prev.errors, ages: undefined, form: undefined },
        };
      }

      return {
        ...prev,
        data: { ...prev.data, [name]: value },
        errors: { ...prev.errors, [name]: undefined, form: undefined },
      };
    });
  };

  const validateForm = (): { isValid: boolean; errors: RegisterFormErrors } => {
    const result = registerSchema.safeParse({
      ...state.data,
      ages: state.data.ages.map((age) => age || "0"),
    });

    if (result.success) {
      return { isValid: true, errors: {} };
    }

    const newErrors: RegisterFormErrors = {};
    const { fieldErrors } = result.error.formErrors;

    if (fieldErrors.email) newErrors.email = fieldErrors.email[0];
    if (fieldErrors.password) newErrors.password = fieldErrors.password[0];
    if (fieldErrors.confirmPassword) newErrors.confirmPassword = fieldErrors.confirmPassword[0];
    if (fieldErrors.userName) newErrors.userName = fieldErrors.userName[0];
    if (fieldErrors.householdSize) newErrors.householdSize = fieldErrors.householdSize[0];
    if (fieldErrors.ages) newErrors.ages = fieldErrors.ages as string[];

    return { isValid: false, errors: newErrors };
  };

  const performRegistration = async () => {
    setState((prev) => ({ ...prev, isSubmitted: true, errors: { ...prev.errors, form: undefined } }));

    const validationResult = validateForm();
    if (!validationResult.isValid) {
      setState((prev) => ({ ...prev, errors: { ...prev.errors, ...validationResult.errors } }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const { ages, householdSize, ...userData } = state.data;
      const response = await authService.register({
        ...userData,
        householdSize: parseInt(householdSize, 10),
        ages: ages.map((age) => parseInt(age, 10)),
      });

      localStorage.setItem("auth_token", response.accessToken);
      localStorage.setItem("auth_expires", response.expiresAt);

      if (onSuccess) {
        onSuccess(response);
      }

      navigate("/lists");
    } catch (error: unknown) {
      let formErrorMessage = "Wystąpił nieznany błąd podczas rejestracji.";

      if (error instanceof HandledError) {
        formErrorMessage = error.message;
      } else if (error instanceof Error) {
        formErrorMessage = error.message;
      }

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

  const handleDietaryPreferenceAdd = (diet: { id: string; label: string }) => {
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        dietaryPreferences: [...prev.data.dietaryPreferences, diet.id],
      },
    }));
  };

  return {
    ...state,
    handleInputChange,
    performRegistration,
    setState,
    handleDietaryPreferenceAdd,
  };
}
