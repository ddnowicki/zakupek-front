import React from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import ProfileForm from "./ProfileForm.tsx";

const ProfileFormWrapper: React.FC = () => {
  const {
    profile,
    isLoading,
    error,
    updateProfile,
  } = useUserProfile();

  if (isLoading && !profile) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-gray-600">Ładowanie profilu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-50 rounded-lg">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Błąd ładowania profilu</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto p-6 bg-yellow-50 rounded-lg">
        <p className="text-yellow-700">Nie znaleziono danych profilu. Proszę odświeżyć stronę.</p>
      </div>
    );
  }

  const { id, email, createdAt, listsCount, ...formData } = profile;

  return (
    <ProfileForm
      initialData={formData}
      onSubmit={updateProfile}
      isLoading={isLoading}
      apiError={error}
      email={email}
      listsCount={listsCount}
    />
  );
};

export default ProfileFormWrapper;
