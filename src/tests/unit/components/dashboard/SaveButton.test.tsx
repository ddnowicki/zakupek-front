import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SaveButton from "../../../../components/dashboard/SaveButton";

// Mock Button component with proper disabled behavior
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, variant }) => {
    const handleClick = (event) => {
      if (!disabled && onClick) {
        onClick(event);
      }
    };
    
    return (
      <button 
        onClick={handleClick}
        disabled={disabled} 
        data-variant={variant}
        data-testid="save-button"
      >
        {children}
      </button>
    );
  },
}));

describe("SaveButton Component", () => {
  const mockOnSave = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderuje przycisk z tekstem 'Zapisz'", () => {
    render(<SaveButton onSave={mockOnSave} />);
    
    const button = screen.getByTestId("save-button");
    expect(button).toHaveTextContent("Zapisz");
    expect(button).not.toBeDisabled();
  });

  it("renderuje przycisk z tekstem 'Zapisywanie...' gdy isLoading=true", () => {
    render(<SaveButton onSave={mockOnSave} isLoading={true} />);
    
    const button = screen.getByTestId("save-button");
    expect(button).toHaveTextContent("Zapisywanie...");
    expect(button).toBeDisabled();
  });

  it("wywołuje funkcję onSave po kliknięciu przycisku", () => {
    render(<SaveButton onSave={mockOnSave} />);
    
    const button = screen.getByTestId("save-button");
    fireEvent.click(button);
    
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it("nie wywołuje funkcji onSave gdy przycisk jest disabled", () => {
    render(<SaveButton onSave={mockOnSave} isLoading={true} />);
    
    const button = screen.getByTestId("save-button");
    fireEvent.click(button);
    
    expect(mockOnSave).not.toHaveBeenCalled();
  });
  
  it("ma variant 'default'", () => {
    render(<SaveButton onSave={mockOnSave} />);
    
    const button = screen.getByTestId("save-button");
    expect(button).toHaveAttribute('data-variant', 'default');
  });
});