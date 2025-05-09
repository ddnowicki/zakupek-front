import React from "react";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { Button } from "@/components/ui/button";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import HouseholdSizeInput from "./HouseholdSizeInput";
import FormErrors from "./FormErrors";
import DietaryCombobox from "./DietaryCombobox";
import { DIETARY_PREFERENCES } from "@/lib/constants";
import type { AuthResponse } from "@/types";
import { Loader2 } from "lucide-react";

interface RegisterFormProps {
  onSuccess?: (authResponse: AuthResponse) => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const {
    data,
    errors,
    isLoading,
    isSubmitted,
    handleInputChange,
    performRegistration,
    setState,
    handleDietaryPreferenceAdd,
  } = useRegisterForm(onSuccess);

  const formErrors = errors.form ? [errors.form] : [];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    performRegistration();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formErrors.length > 0 && <FormErrors errors={formErrors} />}

      <EmailInput
        value={data.email}
        onChange={handleInputChange}
        error={isSubmitted ? errors.email : undefined}
        disabled={isLoading}
      />

      <div className="form-group">
        <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
          Nazwa użytkownika
        </label>
        <input
          id="userName"
          type="text"
          name="userName"
          value={data.userName}
          onChange={handleInputChange}
          disabled={isLoading}
          aria-invalid={Boolean(errors.userName)}
          aria-describedby={errors.userName ? "userName-error" : undefined}
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
            errors.userName ? "border-destructive focus-visible:ring-destructive/50" : "border-input"
          }`}
        />
        {isSubmitted && errors.userName && (
          <p id="userName-error" className="mt-1 text-sm text-destructive" role="alert">
            {errors.userName}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <PasswordInput
          value={data.password}
          onChange={handleInputChange}
          error={isSubmitted ? errors.password : undefined}
          disabled={isLoading}
        />

        <div className="form-group">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Potwierdź hasło
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={handleInputChange}
            disabled={isLoading}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
              errors.confirmPassword ? "border-destructive focus-visible:ring-destructive/50" : "border-input"
            }`}
          />
          {isSubmitted && errors.confirmPassword && (
            <p id="confirmPassword-error" className="mt-1 text-sm text-destructive" role="alert">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <HouseholdSizeInput
        value={data.householdSize}
        onChange={handleInputChange}
        error={isSubmitted ? errors.householdSize : undefined}
        disabled={isLoading}
      />

      <fieldset className="space-y-4" disabled={isLoading}>
        <legend className="text-sm font-medium text-gray-700">Wiek domowników</legend>
        <div className="grid grid-cols-2 gap-4">
          {data.ages.map((age, index) => (
            <div key={index} className={data.ages.length === 1 ? "col-span-1" : ""}>
              <label htmlFor={`age-${index}`} className="block text-sm font-medium text-gray-600">
                Domownik {index + 1}
              </label>
              <input
                id={`age-${index}`}
                type="number"
                name={`age-${index}`}
                value={age}
                onChange={handleInputChange}
                min="1"
                aria-invalid={Boolean(errors.ages?.[index])}
                aria-describedby={errors.ages?.[index] ? `age-${index}-error` : undefined}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                  errors.ages?.[index] ? "border-destructive focus-visible:ring-destructive/50" : "border-input"
                }`}
              />
              {isSubmitted && errors.ages?.[index] && (
                <p id={`age-${index}-error`} className="mt-1 text-sm text-destructive" role="alert">
                  {errors.ages[index]}
                </p>
              )}
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset disabled={isLoading}>
        <legend className="text-sm font-medium text-gray-700">Preferencje dietetyczne</legend>
        <div className="mt-2">
          <DietaryCombobox onAdd={handleDietaryPreferenceAdd} disabled={isLoading} />
          {data.dietaryPreferences.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {data.dietaryPreferences.map((dietId) => {
                const isCustom = !DIETARY_PREFERENCES.some((d) => d.id === dietId);
                const diet = isCustom
                  ? {
                      id: dietId,
                      label: dietId
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" "),
                    }
                  : DIETARY_PREFERENCES.find((d) => d.id === dietId);

                if (!diet) return null;

                return (
                  <div
                    key={diet.id}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm ${
                      isCustom ? "bg-blue-50" : "bg-gray-100"
                    }`}
                  >
                    <span>{diet.label}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setState((prev) => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            dietaryPreferences: prev.data.dietaryPreferences.filter((id) => id !== diet.id),
                          },
                        }));
                      }}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                      aria-label={`Usuń ${diet.label}`}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </fieldset>

      <Button type="submit" className="w-full h-10" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
            <span>Rejestracja...</span>
          </>
        ) : (
          "Załóż konto"
        )}
      </Button>
    </form>
  );
}

export default RegisterForm;
