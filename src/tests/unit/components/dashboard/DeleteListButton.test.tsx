import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DeleteListButton from "../../../../components/dashboard/DeleteListButton";

// Mock UI dependencies
vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children, open }) => (
    <div data-testid="alert-dialog" data-open={open}>
      {children}
    </div>
  ),
  AlertDialogTrigger: ({ children }) => children,
  AlertDialogContent: ({ children }) => <div data-testid="alert-content">{children}</div>,
  AlertDialogHeader: ({ children }) => <div>{children}</div>,
  AlertDialogTitle: ({ children }) => <div>{children}</div>,
  AlertDialogDescription: ({ children }) => <div>{children}</div>,
  AlertDialogFooter: ({ children }) => <div>{children}</div>,
  AlertDialogCancel: ({ onClick, children }) => (
    <button data-testid="cancel-btn" onClick={onClick}>
      {children}
    </button>
  ),
  AlertDialogAction: ({ onClick, children }) => (
    <button data-testid="confirm-btn" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("DeleteListButton Component", () => {
  const mockOnDelete = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderuje przycisk usuwania", () => {
    render(<DeleteListButton onDelete={mockOnDelete} isLoading={false} />);
    expect(screen.getByRole("button", { name: /usuń listę/i })).toBeInTheDocument();
  });

  it("otwiera dialog po kliknięciu przycisku", () => {
    render(<DeleteListButton onDelete={mockOnDelete} isLoading={false} />);
    fireEvent.click(screen.getByRole("button", { name: /usuń listę/i }));
    expect(screen.getByTestId("alert-content")).toBeInTheDocument();
    expect(screen.getByText(/Usuwanie listy/i)).toBeInTheDocument();
  });

  it("wywołuje onDelete po potwierdzeniu", () => {
    render(<DeleteListButton onDelete={mockOnDelete} isLoading={false} />);
    fireEvent.click(screen.getByRole("button", { name: /usuń listę/i }));
    fireEvent.click(screen.getByTestId("confirm-btn"));
    expect(mockOnDelete).toHaveBeenCalled();
  });

  it("zamyka dialog po anulowaniu", () => {
    render(<DeleteListButton onDelete={mockOnDelete} isLoading={false} />);
    fireEvent.click(screen.getByRole("button", { name: /usuń listę/i }));
    fireEvent.click(screen.getByTestId("cancel-btn"));
  });

  it("blokuje przycisk podczas ładowania", () => {
    render(<DeleteListButton onDelete={mockOnDelete} isLoading={true} />);
    expect(screen.getByRole("button", { name: /usuwanie/i })).toBeDisabled();
  });
});
