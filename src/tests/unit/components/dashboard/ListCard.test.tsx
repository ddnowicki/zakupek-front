import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListCard } from "../../../../components/dashboard/ListCard";

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }) => <div data-testid="card-title">{children}</div>,
  CardContent: ({ children }) => <div data-testid="card-content">{children}</div>,
  CardFooter: ({ children }) => <div data-testid="card-footer">{children}</div>,
}));

vi.mock("date-fns", () => ({
  format: vi.fn(() => "16 maja 2025"),
}));
vi.mock("date-fns/locale", () => ({ pl: {} }));

describe("ListCard Component", () => {
  const mockList = {
    id: 1,
    title: "Moja lista",
    productsCount: 5,
    plannedShoppingDate: "2025-05-16T00:00:00.000Z",
    createdAt: "2025-05-15T12:00:00.000Z",
    source: "manual",
    storeName: "Biedronka",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderuje dane listy i obsługuje kliknięcie", () => {
    delete window.location;
    window.location = { href: "" } as any;
    render(<ListCard list={mockList} />);
    expect(screen.getByTestId("card-title")).toHaveTextContent("Moja lista");
    expect(screen.getByText(/Planowane zakupy/i)).toBeInTheDocument();
    expect(screen.getByText(/Sklep: Biedronka/i)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("card"));
    expect(window.location.href).toContain("/lists/1");
  });

  it("renderuje placeholder gdy brak tytułu", () => {
    const listNoTitle = { ...mockList, title: undefined };
    render(<ListCard list={listNoTitle} />);
    expect(screen.getByTestId("card-title")).toHaveTextContent("Lista bez nazwy");
  });

  it("nie renderuje daty/sklepu jeśli brak danych", () => {
    const listNoDate = { ...mockList, plannedShoppingDate: undefined, storeName: undefined };
    render(<ListCard list={listNoDate} />);
    expect(screen.queryByText(/Planowane zakupy/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sklep:/i)).not.toBeInTheDocument();
  });
});
