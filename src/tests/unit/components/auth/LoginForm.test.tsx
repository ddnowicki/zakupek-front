import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginForm } from "../../../../components/auth/LoginForm";
import * as useLoginFormModule from "../../../../components/hooks/useLoginForm";
import type { AuthResponse } from "@/types";

// Mock dla komponentów używanych w LoginForm
vi.mock("../../../../components/auth/EmailInput", () => ({
  default: ({ value, onChange, error, disabled }) => (
    <div data-testid="email-input">
      <input type="email" value={value} onChange={onChange} disabled={disabled} data-testid="email-field" />
      {error && <span data-testid="email-error">{error}</span>}
    </div>
  ),
}));

vi.mock("../../../../components/auth/PasswordInput", () => ({
  default: ({ value, onChange, error, disabled }) => (
    <div data-testid="password-input">
      <input type="password" value={value} onChange={onChange} disabled={disabled} data-testid="password-field" />
      {error && <span data-testid="password-error">{error}</span>}
    </div>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, disabled, type, className, ...props }) => (
    <button type={type} disabled={disabled} className={className} data-testid="submit-button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock("lucide-react", () => ({
  Loader2: () => <div data-testid="loader-icon" />,
}));

describe("LoginForm Component", () => {
  const mockOnSuccess = vi.fn();
  const mockPerformLoginAttempt = vi.fn();
  const mockHandleInputChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock dla hooka useLoginForm
    vi.spyOn(useLoginFormModule, "useLoginForm").mockReturnValue({
      data: { email: "test@example.com", password: "password123" },
      errors: {},
      isLoading: false,
      isSubmitted: false,
      handleInputChange: mockHandleInputChange,
      performLoginAttempt: mockPerformLoginAttempt,
      redirectTo: null,
    });
  });

  it("renders form with email and password inputs", () => {
    render(<LoginForm onSuccess={mockOnSuccess} />);

    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    expect(screen.getByText("Zaloguj się")).toBeInTheDocument();
  });

  it("calls performLoginAttempt on form submit", () => {
    const { container } = render(<LoginForm onSuccess={mockOnSuccess} />);

    // Użycie container.querySelector zamiast getByRole
    const form = container.querySelector("form");
    expect(form).not.toBeNull();

    // Jeśli form istnieje, wywołaj zdarzenie submit
    if (form) {
      fireEvent.submit(form);
      expect(mockPerformLoginAttempt).toHaveBeenCalledTimes(1);
    }
  });

  it("displays validation errors when isSubmitted is true", () => {
    vi.spyOn(useLoginFormModule, "useLoginForm").mockReturnValue({
      data: { email: "", password: "" },
      errors: { email: "Email jest wymagany", password: "Hasło jest wymagane" },
      isLoading: false,
      isSubmitted: true,
      handleInputChange: mockHandleInputChange,
      performLoginAttempt: mockPerformLoginAttempt,
      redirectTo: null,
    });

    render(<LoginForm onSuccess={mockOnSuccess} />);

    expect(screen.getByTestId("email-error")).toHaveTextContent("Email jest wymagany");
    expect(screen.getByTestId("password-error")).toHaveTextContent("Hasło jest wymagane");
  });

  it("displays loading state during form submission", () => {
    vi.spyOn(useLoginFormModule, "useLoginForm").mockReturnValue({
      data: { email: "test@example.com", password: "password123" },
      errors: {},
      isLoading: true,
      isSubmitted: true,
      handleInputChange: mockHandleInputChange,
      performLoginAttempt: mockPerformLoginAttempt,
      redirectTo: null,
    });

    render(<LoginForm onSuccess={mockOnSuccess} />);

    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
    expect(screen.getByText("Logowanie...")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeDisabled();
  });

  it("disables form inputs during loading", () => {
    vi.spyOn(useLoginFormModule, "useLoginForm").mockReturnValue({
      data: { email: "test@example.com", password: "password123" },
      errors: {},
      isLoading: true,
      isSubmitted: false,
      handleInputChange: mockHandleInputChange,
      performLoginAttempt: mockPerformLoginAttempt,
      redirectTo: null,
    });

    render(<LoginForm onSuccess={mockOnSuccess} />);

    expect(screen.getByTestId("email-field")).toBeDisabled();
    expect(screen.getByTestId("password-field")).toBeDisabled();
  });
});
