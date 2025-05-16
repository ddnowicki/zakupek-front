import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProfileDropdown } from "../../../../components/dashboard/ProfileDropdown";
import * as useNavigateModule from "@/lib/hooks/useNavigate";
import { ApiClient } from "@/lib/api";
import { AuthService } from "@/lib/services/auth";

// Create mock setToken function
const mockSetToken = vi.fn();

// Mock dependencies
vi.mock("@/lib/hooks/useNavigate", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  ApiClient: vi.fn().mockImplementation(() => ({
    setToken: mockSetToken,
  })),
}));

vi.mock("@/lib/services/auth", () => ({
  AuthService: vi.fn().mockImplementation(() => ({
    isAuthenticated: vi.fn().mockReturnValue(true),
    logout: vi.fn(),
  })),
}));

describe("ProfileDropdown Component", () => {
  const mockNavigate = vi.fn();
  const mockIsAuthenticated = vi.fn().mockReturnValue(true);
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mocks
    vi.spyOn(useNavigateModule, "useNavigate").mockReturnValue(mockNavigate);

    vi.mocked(AuthService).mockImplementation(() => ({
      isAuthenticated: mockIsAuthenticated,
      logout: mockLogout,
    }));

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn().mockReturnValue("mock-token"),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it("nie renderuje się gdy użytkownik nie jest zalogowany", async () => {
    mockIsAuthenticated.mockReturnValueOnce(false);

    const { container } = render(<ProfileDropdown />);

    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });

  it("renderuje ikonę użytkownika gdy użytkownik jest zalogowany", () => {
    render(<ProfileDropdown />);

    const userButton = screen.getByLabelText("User menu");
    expect(userButton).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "User menu" })).toBeInTheDocument();
  });

  it("wyświetla menu po kliknięciu w ikonę", () => {
    render(<ProfileDropdown />);

    const userButton = screen.getByLabelText("User menu");
    fireEvent.click(userButton);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Wyloguj się")).toBeInTheDocument();
  });

  it("nawiguje do profilu po kliknięciu w opcję Profile", () => {
    render(<ProfileDropdown />);

    // Open dropdown menu
    const userButton = screen.getByLabelText("User menu");
    fireEvent.click(userButton);

    // Click on Profile
    const profileButton = screen.getByText("Profile");
    fireEvent.click(profileButton);

    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("wylogowuje użytkownika i przekierowuje do loginu po kliknięciu w opcję Wyloguj", () => {
    render(<ProfileDropdown />);

    // Open dropdown menu
    const userButton = screen.getByLabelText("User menu");
    fireEvent.click(userButton);

    // Click on Logout
    const logoutButton = screen.getByText("Wyloguj się");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("zamyka menu po kliknięciu poza obszarem menu", () => {
    render(
      <div>
        <ProfileDropdown />
        <div data-testid="outside-area">Outside Area</div>
      </div>
    );

    // Open dropdown menu
    const userButton = screen.getByLabelText("User menu");
    fireEvent.click(userButton);

    // Verify dropdown is open
    expect(screen.getByText("Profile")).toBeInTheDocument();

    // Click outside
    const outsideArea = screen.getByTestId("outside-area");
    fireEvent.mouseDown(outsideArea);

    // Wait for dropdown to close
    waitFor(() => {
      expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    });
  });

  it("poprawnie inicjalizuje API Client z tokenem", () => {
    render(<ProfileDropdown />);

    expect(localStorage.getItem).toHaveBeenCalledWith("token");
    expect(ApiClient).toHaveBeenCalled();
    // Use the defined mockSetToken instead of accessing the mock instance
    expect(mockSetToken).toHaveBeenCalledWith("mock-token");
  });
});
