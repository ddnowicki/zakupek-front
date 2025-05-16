import type { UserProfileResponse, UpdateUserProfileRequest } from "../../types";
import { ApiClient, HandledError } from "../../lib/api";
import { useState, useEffect, useCallback } from "react";

const apiClient = new ApiClient();

export interface UseUserProfileReturn {
  profile: UserProfileResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateUserProfileRequest) => Promise<boolean>;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Pobranie tokena z localStorage - w rzeczywistej aplikacji może to być bardziej skomplikowane
      const token = localStorage.getItem("token");
      if (token) {
        apiClient.setToken(token);
      } else {
        // Brak tokena - użytkownik prawdopodobnie nie jest zalogowany
        // Można tu dodać przekierowanie do strony logowania
        setError("User is not authenticated.");
        window.location.href = "/login?returnUrl=/profile";
        setProfile(null);
        setIsLoading(false);
        return;
      }
      const data = await apiClient.getProfile();
      setProfile(data);
    } catch (e) {
      if (e instanceof HandledError) {
        setError(e.message);
        if (e.status === 401) {
          // Przekierowanie na stronę logowania, jeśli API zwróci 401
          // window.location.href = '/login';
          console.error("Unauthorized, redirecting to login...");
        }
      } else {
        setError("An unexpected error occurred while fetching the profile.");
      }
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (data: UpdateUserProfileRequest): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          apiClient.setToken(token);
        } else {
          setError("User is not authenticated.");
          window.location.href = "/login?returnUrl=/profile";
          setIsLoading(false);
          return false;
        }
        const success = await apiClient.updateProfile(data);
        if (success) {
          // Po udanej aktualizacji, pobierz profil ponownie, aby odświeżyć dane
          // lub zaktualizuj stan lokalnie, jeśli API zwraca zaktualizowany profil
          await fetchProfile();
        }
        return success;
      } catch (e) {
        if (e instanceof HandledError) {
          setError(e.message);
        } else {
          setError("An unexpected error occurred while updating the profile.");
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProfile]
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, isLoading, error, fetchProfile, updateProfile };
};
