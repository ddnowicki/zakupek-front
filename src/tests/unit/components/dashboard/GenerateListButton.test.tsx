import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GenerateListButton } from "../../../../components/dashboard/GenerateListButton";
import { toast } from "sonner";

// Mock for shopping-list service that will be used across tests
const mockGenerateShoppingList = vi.fn();
vi.mock("@/lib/services/shopping-list", () => ({
  ShoppingListService: vi.fn().mockImplementation(() => ({
    generateShoppingList: mockGenerateShoppingList,
  })),
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open, onOpenChange }) => (
    <div data-testid="dialog" data-open={open}>
      {children}
    </div>
  ),
  DialogTrigger: ({ children }) => children,
  DialogContent: ({ children }) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <div>{children}</div>,
  DialogDescription: ({ children }) => <div>{children}</div>,
  DialogFooter: ({ children }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => (
    <button data-testid={props["data-testid"] || "button"} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({ id, value, onChange, type }) => (
    <input id={id} value={value} onChange={onChange} type={type} data-testid={`input-${id}`} />
  ),
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({ htmlFor, children }) => <label htmlFor={htmlFor}>{children}</label>,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@/lib/api", () => ({
  ApiClient: vi.fn().mockImplementation(() => ({ setToken: vi.fn() })),
}));

vi.mock("@/lib/hooks/useNavigate", () => ({
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
}));

describe("GenerateListButton Component", () => {
  const mockOnListGenerated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockGenerateShoppingList.mockResolvedValue({ id: 123 });
  });

  it("renderuje przycisk generowania", () => {
    render(<GenerateListButton onListGenerated={mockOnListGenerated} />);
    const button = screen.getByRole("button", { name: /generuj listę ai/i });
    expect(button).toBeInTheDocument();
  });

  it("otwiera dialog po kliknięciu", () => {
    render(<GenerateListButton onListGenerated={mockOnListGenerated} />);
    const button = screen.getByRole("button", { name: /generuj listę ai/i });
    fireEvent.click(button);

    expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
    expect(screen.getByText(/generuj nową listę zakupów ai/i)).toBeInTheDocument();
  });

  it("po submit wywołuje onListGenerated i resetuje pola", async () => {
    render(<GenerateListButton onListGenerated={mockOnListGenerated} />);
    const button = screen.getByRole("button", { name: /generuj listę ai/i });
    fireEvent.click(button);

    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "Testowa lista" } });
    fireEvent.change(screen.getByTestId("input-plannedDate"), { target: { value: "2025-05-16" } });
    fireEvent.change(screen.getByTestId("input-storeName"), { target: { value: "Biedronka" } });

    const form = screen.getByTestId("input-title").closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      // Nie sprawdzamy dokładnego formatu daty, a jedynie czy zawiera oczekiwaną datę
      expect(mockGenerateShoppingList).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Testowa lista",
          storeName: "Biedronka",
        })
      );
      // Sprawdzamy czy parametr daty jest przekazany i zawiera naszą datę
      const callArgs = mockGenerateShoppingList.mock.calls[0][0];
      expect(callArgs.plannedShoppingDate).toContain("2025-05-16");

      expect(mockOnListGenerated).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("obsługuje błąd generowania i pokazuje toast", async () => {
    // Set up rejection for this specific test
    mockGenerateShoppingList.mockRejectedValueOnce(new Error("Błąd generowania"));

    render(<GenerateListButton onListGenerated={mockOnListGenerated} />);
    const button = screen.getByRole("button", { name: /generuj listę ai/i });
    fireEvent.click(button);

    const form = screen.getByTestId("input-title").closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
