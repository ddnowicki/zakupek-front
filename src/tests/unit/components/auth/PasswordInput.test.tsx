import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PasswordInput from "../../../../components/auth/PasswordInput";

// Mock dla ikon Lucide
vi.mock("lucide-react", () => ({
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
}));

describe("PasswordInput Component", () => {
  it("renders correctly with default props", () => {
    const mockOnChange = vi.fn();

    render(<PasswordInput value="password123" onChange={mockOnChange} />);

    // Check if label and input exist
    expect(screen.getByLabelText("Hasło")).toBeInTheDocument();

    // Sprawdź, czy pole jest typu password
    const input = screen.getByLabelText("Hasło");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveValue("password123");

    // Sprawdź, czy istnieje przycisk do zmiany widoczności hasła
    const toggleButton = screen.getByRole("button", { name: /Pokaż hasło/i });
    expect(toggleButton).toBeInTheDocument();
    expect(screen.getByTestId("eye-icon")).toBeInTheDocument();
  });

  it("toggles password visibility when toggle button is clicked", async () => {
    const mockOnChange = vi.fn();

    render(<PasswordInput value="password123" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Hasło");
    const toggleButton = screen.getByRole("button", { name: /Pokaż hasło/i });

    // Początkowo hasło jest ukryte (type="password")
    expect(input).toHaveAttribute("type", "password");

    // Kliknij przycisk, aby pokazać hasło
    fireEvent.click(toggleButton);

    // Hasło powinno być widoczne (type="text")
    expect(input).toHaveAttribute("type", "text");
    expect(toggleButton).toHaveAttribute("aria-label", "Ukryj hasło");
    expect(screen.getByTestId("eye-off-icon")).toBeInTheDocument();

    // Kliknij przycisk ponownie, aby ukryć hasło
    fireEvent.click(toggleButton);

    // Hasło powinno być znów ukryte
    expect(input).toHaveAttribute("type", "password");
    expect(toggleButton).toHaveAttribute("aria-label", "Pokaż hasło");
  });

  it("displays error message when provided", () => {
    const mockOnChange = vi.fn();
    const errorMessage = "Hasło musi zawierać minimum 8 znaków";

    render(<PasswordInput value="pass" onChange={mockOnChange} error={errorMessage} />);

    // Check if error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    // Check if input has the appropriate ARIA attributes for accessibility
    const input = screen.getByLabelText("Hasło");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby");
  });

  it("calls onChange when input value changes", () => {
    const mockOnChange = vi.fn();

    render(<PasswordInput value="password" onChange={mockOnChange} />);

    const input = screen.getByLabelText("Hasło");
    fireEvent.change(input, { target: { value: "newpassword" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("disables the input and toggle button when disabled prop is true", () => {
    const mockOnChange = vi.fn();

    render(<PasswordInput value="password" onChange={mockOnChange} disabled />);

    const input = screen.getByLabelText("Hasło");
    const toggleButton = screen.getByRole("button", { name: /Pokaż hasło/i });

    expect(input).toBeDisabled();
    expect(toggleButton).toBeDisabled();
  });

  it("applies error styling when error prop is provided", () => {
    const mockOnChange = vi.fn();
    const errorMessage = "Hasło jest wymagane";

    render(<PasswordInput value="" onChange={mockOnChange} error={errorMessage} />);

    const input = screen.getByLabelText("Hasło");
    expect(input.className).toContain("border-destructive");
  });
});
