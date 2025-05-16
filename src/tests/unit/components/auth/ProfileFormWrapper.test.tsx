import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfileFormWrapper from "../../../../components/auth/ProfileFormWrapper";
import * as useUserProfileModule from "../../../../components/hooks/useUserProfile";
import { toast } from "sonner";
import type { UserProfileResponse } from "@/types";

// Mock dla komponentów używanych w ProfileFormWrapper
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../../../components/auth/ProfileForm.tsx", () => ({
  default: ({ initialData, onSubmit, isLoading, apiError, email, listsCount }) => (
    <div data-testid="profile-form-component">
      <div data-testid="initial-data">{JSON.stringify(initialData)}</div>
      <div data-testid="loading-state">{isLoading.toString()}</div>
      <div data-testid="api-error">{apiError || "null"}</div>
      <div data-testid="email">{email || "null"}</div>
      <div data-testid="lists-count">{listsCount || "null"}</div>
      <button onClick={() => onSubmit({ userName: "updated" })} data-testid="submit-button">
        Submit
      </button>
    </div>
  ),
}));

describe("ProfileFormWrapper Component", () => {
  const mockProfile: UserProfileResponse = {
    id: "user-123",
    email: "test@example.com",
    userName: "testuser",
    householdSize: 2,
    ages: [30, 25],
    dietaryPreferences: ["vegan"],
    createdAt: "2023-01-01",
    listsCount: 5,
  };

  const mockUpdateProfile = vi.fn().mockResolvedValue(true);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state when loading profile data", () => {
    vi.spyOn(useUserProfileModule, "useUserProfile").mockReturnValue({
      profile: null,
      isLoading: true,
      error: null,
      updateProfile: mockUpdateProfile,
    });

    render(<ProfileFormWrapper />);

    expect(screen.getByText("Ładowanie profilu...")).toBeInTheDocument();
  });

  it("should render ProfileForm with correct props when profile is loaded", () => {
    vi.spyOn(useUserProfileModule, "useUserProfile").mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      error: null,
      updateProfile: mockUpdateProfile,
    });

    render(<ProfileFormWrapper />);

    // Verify ProfileForm component receives the correct initial data
    const initialDataJson = screen.getByTestId("initial-data").textContent;
    const parsedData = JSON.parse(initialDataJson || "{}");
    expect(parsedData).toEqual({
      userName: "testuser",
      householdSize: 2,
      ages: [30, 25],
      dietaryPreferences: ["vegan"],
    });

    expect(screen.getByTestId("loading-state").textContent).toBe("false");
    expect(screen.getByTestId("api-error").textContent).toBe("null");
    expect(screen.getByTestId("email").textContent).toBe("test@example.com");
    expect(screen.getByTestId("lists-count").textContent).toBe("5");
  });

  it("should show error message when there is an error loading profile", () => {
    vi.spyOn(useUserProfileModule, "useUserProfile").mockReturnValue({
      profile: null,
      isLoading: false,
      error: "Failed to load profile",
      updateProfile: mockUpdateProfile,
    });

    render(<ProfileFormWrapper />);

    expect(toast.error).toHaveBeenCalledWith("Błąd ładowania profilu", {
      description: "Failed to load profile",
    });

    // Should show error message if profile not found
    expect(screen.getByText("Nie znaleziono danych profilu. Proszę odświeżyć stronę.")).toBeInTheDocument();
  });

  it("should parse JSON errors when present", () => {
    const jsonError = JSON.stringify({ errors: [{ reason: "Custom API error" }] });

    vi.spyOn(useUserProfileModule, "useUserProfile").mockReturnValue({
      profile: null,
      isLoading: false,
      error: jsonError,
      updateProfile: mockUpdateProfile,
    });

    render(<ProfileFormWrapper />);

    expect(toast.error).toHaveBeenCalledWith("Błąd ładowania profilu", {
      description: "Custom API error",
    });
  });

  it("should pass updateProfile function to ProfileForm", async () => {
    vi.spyOn(useUserProfileModule, "useUserProfile").mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      error: null,
      updateProfile: mockUpdateProfile,
    });

    render(<ProfileFormWrapper />);

    // Simulate form submission from the ProfileForm mock
    const submitButton = screen.getByTestId("submit-button");
    submitButton.click();

    // Check if updateProfile was called with correct arguments
    expect(mockUpdateProfile).toHaveBeenCalledWith({ userName: "updated" });
  });
});
