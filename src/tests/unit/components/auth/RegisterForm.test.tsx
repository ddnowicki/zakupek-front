import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RegisterForm from "../../../../components/auth/RegisterForm";
import * as useRegisterFormModule from "../../../../components/hooks/useRegisterForm";

// Mock zależności
vi.mock("../../../../components/auth/EmailInput", () => ({
  default: ({ value, onChange, error, disabled }) => (
    <div data-testid="email-input">
      <input data-testid="email-field" type="email" value={value} onChange={onChange} disabled={disabled} />
      {error && <span data-testid="email-error">{error}</span>}
    </div>
  ),
}));

vi.mock("../../../../components/auth/PasswordInput", () => ({
  default: ({ value, onChange, error, disabled }) => (
    <div data-testid="password-input">
      <input data-testid="password-field" type="password" value={value} onChange={onChange} disabled={disabled} />
      {error && <span data-testid="password-error">{error}</span>}
    </div>
  ),
}));

vi.mock("../../../../components/auth/HouseholdSizeInput", () => ({
  default: ({ value, onChange, error, disabled }) => (
    <div data-testid="household-size-input">
      <input data-testid="household-size-field" type="number" value={value} onChange={onChange} disabled={disabled} />
      {error && <span data-testid="household-size-error">{error}</span>}
    </div>
  ),
}));

vi.mock("../../../../components/auth/DietaryCombobox", () => ({
  default: ({ value, onChange, disabled }) => (
    <div data-testid="dietary-combobox">
      <select
        data-testid="dietary-select"
        value={value.join(",")}
        onChange={(e) => onChange(e.target.value.split(",").filter(Boolean))}
        disabled={disabled}
      >
        <option value="vegan">Vegan</option>
        <option value="vegetarian">Vegetarian</option>
      </select>
    </div>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, disabled, type, className, onClick, ...props }) => (
    <button
      type={type}
      disabled={disabled}
      className={className}
      onClick={onClick}
      data-testid="submit-button"
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock("lucide-react", () => ({
  Loader2: () => <div data-testid="loader-icon" />,
}));

describe("RegisterForm Component", () => {
  const mockOnSuccess = vi.fn();
  const mockPerformRegistration = vi.fn();
  const mockHandleInputChange = vi.fn();
  const mockSetState = vi.fn();
  const mockHandleDietaryPreferenceAdd = vi.fn();

  const mockRegisterFormData = {
    email: "test@example.com",
    userName: "testuser",
    password: "Password123!",
    confirmPassword: "Password123!",
    householdSize: 2,
    ages: ["30", "25"],
    dietaryPreferences: ["vegan"],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock dla hooka useRegisterForm
    vi.spyOn(useRegisterFormModule, "useRegisterForm").mockReturnValue({
      data: mockRegisterFormData,
      errors: {},
      isLoading: false,
      isSubmitted: false,
      handleInputChange: mockHandleInputChange,
      performRegistration: mockPerformRegistration,
      setState: mockSetState,
      handleDietaryPreferenceAdd: mockHandleDietaryPreferenceAdd,
    });
  });

  it("renders form with all required inputs", () => {
    render(<RegisterForm onSuccess={mockOnSuccess} />);

    // Check all inputs are present
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("household-size-input")).toBeInTheDocument();
    expect(screen.getByTestId("dietary-combobox")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    expect(screen.getByText("Załóż konto")).toBeInTheDocument();
  });

  it("calls performRegistration on form submit", () => {
    const { container } = render(<RegisterForm onSuccess={mockOnSuccess} />);

    // Find form element and submit it
    const form = container.querySelector("form");
    expect(form).not.toBeNull();

    fireEvent.submit(form!);
    expect(mockPerformRegistration).toHaveBeenCalledTimes(1);
  });

  it("displays validation errors when isSubmitted is true", () => {
    vi.spyOn(useRegisterFormModule, "useRegisterForm").mockReturnValue({
      data: mockRegisterFormData,
      errors: {
        email: "Email jest wymagany",
        password: "Hasło jest wymagane",
        confirmPassword: "Hasła muszą być takie same",
        householdSize: "Liczba domowników musi być większa od 0",
        ages: ["Wiek musi być większy od 0"],
      },
      isLoading: false,
      isSubmitted: true,
      handleInputChange: mockHandleInputChange,
      performRegistration: mockPerformRegistration,
      setState: mockSetState,
      handleDietaryPreferenceAdd: mockHandleDietaryPreferenceAdd,
    });

    render(<RegisterForm onSuccess={mockOnSuccess} />);

    expect(screen.getByTestId("email-error")).toHaveTextContent("Email jest wymagany");
    expect(screen.getByTestId("password-error")).toHaveTextContent("Hasło jest wymagane");
    expect(screen.getByTestId("household-size-error")).toHaveTextContent("Liczba domowników musi być większa od 0");
  });

  it("displays loading state during form submission", () => {
    vi.spyOn(useRegisterFormModule, "useRegisterForm").mockReturnValue({
      data: mockRegisterFormData,
      errors: {},
      isLoading: true,
      isSubmitted: false,
      handleInputChange: mockHandleInputChange,
      performRegistration: mockPerformRegistration,
      setState: mockSetState,
      handleDietaryPreferenceAdd: mockHandleDietaryPreferenceAdd,
    });

    render(<RegisterForm onSuccess={mockOnSuccess} />);

    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
    expect(screen.getByText("Rejestracja...")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeDisabled();
  });

  it("disables form inputs during loading", () => {
    vi.spyOn(useRegisterFormModule, "useRegisterForm").mockReturnValue({
      data: mockRegisterFormData,
      errors: {},
      isLoading: true,
      isSubmitted: false,
      handleInputChange: mockHandleInputChange,
      performRegistration: mockPerformRegistration,
      setState: mockSetState,
      handleDietaryPreferenceAdd: mockHandleDietaryPreferenceAdd,
    });

    render(<RegisterForm onSuccess={mockOnSuccess} />);

    expect(screen.getByTestId("email-field")).toBeDisabled();
    expect(screen.getByTestId("password-field")).toBeDisabled();
    expect(screen.getByTestId("household-size-field")).toBeDisabled();
    expect(screen.getByTestId("dietary-select")).toBeDisabled();
  });

  it("calls handleInputChange when input values change", () => {
    render(<RegisterForm onSuccess={mockOnSuccess} />);

    // Change userName field
    const userNameInput = screen.getByLabelText("Nazwa użytkownika");
    fireEvent.change(userNameInput, { target: { value: "newusername", name: "userName" } });

    // Uproszczona asercja - sprawdzamy tylko czy funkcja została wywołana
    expect(mockHandleInputChange).toHaveBeenCalled();
  });
});
