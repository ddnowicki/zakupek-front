import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import DietaryCombobox from './DietaryCombobox';
import type { UpdateUserProfileRequest, UserProfileResponse } from '../../types';
import { useId } from 'react';

interface ProfileFormProps {
  initialData: Omit<UserProfileResponse, 'id' | 'email' | 'createdAt' | 'listsCount'>;
  onSubmit: (data: UpdateUserProfileRequest) => Promise<boolean>;
  isLoading: boolean;
  apiError: string | null;
  email?: string; // Dodatkowe pole tylko do wyświetlenia
  listsCount?: number; // Dodatkowe pole tylko do wyświetlenia
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  apiError,
  email,
  listsCount
}) => {
  const formId = useId();
  const [formData, setFormData] = React.useState({
    userName: initialData.userName || '',
    householdSize: initialData.householdSize?.toString() || '',
    ages: initialData.ages?.map(age => age.toString()) || [],
    dietaryPreferences: initialData.dietaryPreferences || []
  });
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.userName.trim()) {
      errors.userName = 'Nazwa użytkownika jest wymagana';
    }
    
    if (formData.householdSize) {
      const size = parseInt(formData.householdSize);
      if (isNaN(size) || size < 1) {
        errors.householdSize = 'Liczba domowników musi być dodatnia';
      } else if (formData.ages.length !== size) {
        errors.ages = `Proszę podać ${size} wiek${size > 1 ? 'ów' : ''}`;
      }
    }

    formData.ages.forEach((age, index) => {
      const parsed = parseInt(age);
      if (isNaN(parsed) || parsed < 0) {
        errors[`age_${index}`] = 'Wiek musi być liczbą dodatnią';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updateData: UpdateUserProfileRequest = {
      userName: formData.userName,
      householdSize: formData.householdSize ? parseInt(formData.householdSize) : undefined,
      ages: formData.householdSize ? formData.ages.map(age => parseInt(age)) : undefined,
      dietaryPreferences: formData.dietaryPreferences
    };

    await onSubmit(updateData);
  };

  const handleHouseholdSizeChange = (value: string) => {
    const newSize = parseInt(value) || 0;
    const currentAges = [...formData.ages];
    
    // Adjust ages array based on new household size
    if (newSize > currentAges.length) {
      // Add empty ages for new household members
      while (currentAges.length < newSize) {
        currentAges.push('');
      }
    } else {
      // Remove extra ages if household size decreased
      while (currentAges.length > newSize) {
        currentAges.pop();
      }
    }

    setFormData(prev => ({
      ...prev,
      householdSize: value,
      ages: currentAges
    }));
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-6 p-6 bg-white rounded-lg shadow"
    >
      {apiError && (
        <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded">
          {apiError}
        </div>
      )}

      {/* Email - read only */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          value={email}
          disabled
          className="bg-gray-50"
        />
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="userName">Nazwa użytkownika</Label>
        <Input
          type="text"
          id="userName"
          value={formData.userName}
          onChange={e => setFormData(prev => ({ ...prev, userName: e.target.value }))}
          aria-invalid={!!validationErrors.userName}
          aria-describedby={validationErrors.userName ? `${formId}-userName-error` : undefined}
        />
        {validationErrors.userName && (
          <p id={`${formId}-userName-error`} className="text-sm text-red-500">
            {validationErrors.userName}
          </p>
        )}
      </div>

      {/* Household Size */}
      <div className="space-y-2">
        <Label htmlFor="householdSize">Liczba domowników</Label>
        <Input
          type="number"
          id="householdSize"
          min="1"
          value={formData.householdSize}
          onChange={e => handleHouseholdSizeChange(e.target.value)}
          aria-invalid={!!validationErrors.householdSize}
          aria-describedby={validationErrors.householdSize ? `${formId}-householdSize-error` : undefined}
        />
        {validationErrors.householdSize && (
          <p id={`${formId}-householdSize-error`} className="text-sm text-red-500">
            {validationErrors.householdSize}
          </p>
        )}
      </div>

      {/* Ages */}
      {parseInt(formData.householdSize) > 0 && (
        <div className="space-y-4">
          <Label>Wiek domowników</Label>
          <div className="grid gap-4">
            {formData.ages.map((age, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  value={age}
                  onChange={e => {
                    const newAges = [...formData.ages];
                    newAges[index] = e.target.value;
                    setFormData(prev => ({ ...prev, ages: newAges }));
                  }}
                  aria-invalid={!!validationErrors[`age_${index}`]}
                  aria-describedby={validationErrors[`age_${index}`] ? `${formId}-age-${index}-error` : undefined}
                  placeholder={`Wiek osoby ${index + 1}`}
                />
                {validationErrors[`age_${index}`] && (
                  <p id={`${formId}-age-${index}-error`} className="text-sm text-red-500">
                    {validationErrors[`age_${index}`]}
                  </p>
                )}
              </div>
            ))}
          </div>
          {validationErrors.ages && (
            <p className="text-sm text-red-500">
              {validationErrors.ages}
            </p>
          )}
        </div>
      )}

      {/* Dietary Preferences */}
      <div className="space-y-2">
        <Label>Preferencje żywieniowe</Label>
        <DietaryCombobox
          value={formData.dietaryPreferences}
          onChange={preferences => setFormData(prev => ({ ...prev, dietaryPreferences: preferences }))}
        />
      </div>

      {/* Lists count - read only */}
      {typeof listsCount === 'number' && (
        <div className="text-sm text-gray-600">
          Utworzone listy zakupów: {listsCount}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
      </Button>
    </form>
  );
};

export default ProfileForm;
