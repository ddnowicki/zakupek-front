import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ListDetailsPage from "../../../../components/dashboard/ListDetailsPage";
import { toast } from "sonner";

// Najpierw definicje mocków - przed vi.mock()
const mockUpdateShoppingList = vi.fn().mockResolvedValue(true);
const mockDeleteShoppingList = vi.fn().mockResolvedValue(true);
const mockNavigate = vi.fn();

// Teraz możemy użyć zmiennych w vi.mock() bo są już zdefiniowane
vi.mock("@/lib/services/shopping-list", () => ({
  ShoppingListService: vi.fn().mockImplementation(() => ({
    updateShoppingList: mockUpdateShoppingList,
    deleteShoppingList: mockDeleteShoppingList,
  })),
}));

vi.mock("@/lib/api", () => ({
  ApiClient: vi.fn().mockImplementation(() => ({
    setToken: vi.fn(),
  })),
}));

// Teraz mockNavigate jest już zdefiniowane przed vi.mock()
vi.mock("@/lib/hooks/useNavigate", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock dla hooka useListDetails
vi.mock("@/components/hooks/useListDetails", () => ({
  useListDetails: vi.fn().mockReturnValue({
    listData: {
      id: 1,
      title: "Lista testowa",
      storeName: "Biedronka",
      plannedShoppingDate: "2025-05-16",
      createdAt: "2025-05-15T12:00:00.000Z",
      updatedAt: "2025-05-16T12:00:00.000Z",
      source: "manual",
      products: [
        { id: 1, name: "Jabłko", quantity: 2, statusId: 1, status: "Pending", createdAt: "2025-05-15T12:00:00.000Z" },
      ],
    },
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

// Mock dla komponentów
vi.mock("@/components/dashboard/ProductTable", () => ({
  __esModule: true,
  default: ({ products, onAddNewProduct }) => (
    <div data-testid="product-table">
      <button data-testid="add-product" onClick={() => onAddNewProduct({ name: "Jabłko", quantity: 2 })}>
        Dodaj produkt
      </button>
      {products.map((p, idx) => (
        <div key={p.id || idx} data-testid="product-row">
          {p.name}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("@/components/dashboard/InlineEdit", () => ({
  __esModule: true,
  default: ({ value, onChange }) => (
    <div data-testid="inline-edit" onClick={() => onChange(value + " zmienione")}>
      {value}
    </div>
  ),
}));

vi.mock("@/components/dashboard/SaveButton", () => ({
  __esModule: true,
  default: ({ onSave, isLoading }) => (
    <button data-testid="save-btn" onClick={onSave} disabled={isLoading}>
      Zapisz
    </button>
  ),
}));

vi.mock("@/components/dashboard/DeleteListButton", () => ({
  __esModule: true,
  default: ({ onDelete, isLoading }) => (
    <button data-testid="delete-btn" onClick={onDelete} disabled={isLoading}>
      Usuń
    </button>
  ),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ListDetailsPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderuje szczegóły listy i produkty", () => {
    render(<ListDetailsPage listId={1} />);
    // Używamy getAllByTestId zamiast getByTestId, bo mamy wiele elementów z tym samym testId
    const inlineEdits = screen.getAllByTestId("inline-edit");
    expect(inlineEdits.length).toBeGreaterThan(0);
    expect(screen.getByTestId("product-table")).toBeInTheDocument();
    expect(screen.getByTestId("save-btn")).toBeInTheDocument();
    expect(screen.getByTestId("delete-btn")).toBeInTheDocument();
  });

  it("po kliknięciu Zapisz wywołuje updateShoppingList", async () => {
    render(<ListDetailsPage listId={1} />);
    fireEvent.click(screen.getByTestId("save-btn"));

    await waitFor(() => {
      expect(mockUpdateShoppingList).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it("po kliknięciu Usuń wywołuje deleteShoppingList", async () => {
    render(<ListDetailsPage listId={1} />);
    fireEvent.click(screen.getByTestId("delete-btn"));

    await waitFor(() => {
      expect(mockDeleteShoppingList).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it("dodaje nowy produkt po kliknięciu Dodaj produkt", async () => {
    render(<ListDetailsPage listId={1} />);

    // Powinien być już wstępnie załadowany produkt
    expect(screen.getAllByTestId("product-row").length).toBeGreaterThanOrEqual(1);

    // Dodaj nowy produkt
    fireEvent.click(screen.getByTestId("add-product"));

    await waitFor(() => {
      // Teraz powinniśmy mieć o jeden więcej
      expect(screen.getAllByTestId("product-row").length).toBeGreaterThanOrEqual(2);
    });
  });
});
