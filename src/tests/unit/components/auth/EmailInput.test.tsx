import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EmailInput from "../../../../components/auth/EmailInput";

describe("EmailInput Component", () => {
  it("renders correctly with default props", () => {
    const mockOnChange = vi.fn();

    render(<EmailInput value="" onChange={mockOnChange} />);

    // Check if label and input exist
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("displays error message when provided", () => {
    const mockOnChange = vi.fn();
    const errorMessage = "Email is required";

    render(<EmailInput value="" onChange={mockOnChange} error={errorMessage} />);

    // Check if error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    // Check if input has the appropriate ARIA attributes for accessibility
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby");
  });

  it("calls onChange when input value changes", () => {
    const mockOnChange = vi.fn();

    render(<EmailInput value="" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("disables the input when disabled prop is true", () => {
    const mockOnChange = vi.fn();

    render(<EmailInput value="" onChange={mockOnChange} disabled />);

    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
