import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateListButton } from "../../../../components/dashboard/CreateListButton";
import { toast } from "sonner";
import { ApiClient } from "@/lib/api";
import { ShoppingListService } from "@/lib/services/shopping-list";
import { AuthService } from "@/lib/services/auth";
import * as useNavigateModule from "@/lib/hooks/useNavigate";

// Mock zależności
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/api", () => ({
  ApiClient: vi.fn().mockImplementation(() => ({
    setToken: vi.fn(),
  })),
}));

vi.mock("@/lib/services/shopping-list", () => ({
  ShoppingListService: vi.fn().mockImplementation(() => ({
    createShoppingList: vi.fn().mockResolvedValue({ id: "list-123", title: "Test List" }),
  })),
}));

vi.mock("@/lib/services/auth", () => ({
  AuthService: vi.fn().mockImplementation(() => ({
    isAuthenticated: vi.fn().mockReturnValue(true),
  })),
}));

vi.mock("@/lib/hooks/useNavigate", () => ({
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
}));

// Mock komponenty UI
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open, onOpenChange }) => (
    <div data-testid="dialog" data-open={open}>
      <button data-testid="dialog-open-toggle" onClick={() => onOpenChange(!open)}>
        Toggle Dialog
      </button>
      {children}
    </div>
  ),
  DialogTrigger: ({ children, asChild }) => <div data-testid="dialog-trigger">{children}</div>,
  DialogContent: ({ children }) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }) => <div data-testid="dialog-title">{children}</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, type, disabled, variant }) => (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      data-variant={variant}
      data-testid={`button-${children?.toString().toLowerCase().replace(/\s+/g, "-")}`}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({ id, value, onChange, type }) => (
    <input id={id} type={type || "text"} value={value || ""} onChange={onChange} data-testid={`input-${id}`} />
  ),
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} data-testid={`label-${htmlFor}`}>
      {children}
    </label>
  ),
}));

vi.mock("date-fns", () => ({
  format: vi.fn().mockReturnValue("2023-05-16"),
}));

describe("CreateListButton Component", () => {
  const mockOnListCreated = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useNavigateModule, "useNavigate").mockReturnValue(mockNavigate);

    // Ensure AuthService mock always returns true for isAuthenticated
    vi.mocked(AuthService).mockImplementation(() => ({
      isAuthenticated: vi.fn().mockReturnValue(true),
    }));
  });

  it("renders button to create a new list", () => {
    render(<CreateListButton onListCreated={mockOnListCreated} />);

    expect(screen.getByTestId("button-nowa-lista")).toBeInTheDocument();
    expect(screen.getByText("Nowa lista")).toBeInTheDocument();
  });

  it("opens dialog when button is clicked", () => {
    render(<CreateListButton onListCreated={mockOnListCreated} />);

    // Click on the button inside the DialogTrigger
    const button = screen.getByTestId("button-nowa-lista");
    fireEvent.click(button);

    // Find dialog toggle and trigger it to simulate opening
    const dialogToggle = screen.getByTestId("dialog-open-toggle");
    fireEvent.click(dialogToggle);

    // Verify dialog content is displayed
    expect(screen.getByTestId("dialog-title")).toBeInTheDocument();
    expect(screen.getByText("Utwórz nową listę zakupów")).toBeInTheDocument();
    expect(screen.getByTestId("input-title")).toBeInTheDocument();
    expect(screen.getByTestId("input-plannedDate")).toBeInTheDocument();
    expect(screen.getByTestId("input-store")).toBeInTheDocument();
  });

  it("submits form with correct data", async () => {
    // Setup mocks
    const createListMock = vi.fn().mockResolvedValue({ id: "list-123", title: "Test List" });
    vi.mocked(ShoppingListService).mockImplementation(() => ({
      createShoppingList: createListMock,
    }));

    render(<CreateListButton onListCreated={mockOnListCreated} />);

    // Open dialog
    const button = screen.getByTestId("button-nowa-lista");
    fireEvent.click(button);
    const dialogToggle = screen.getByTestId("dialog-open-toggle");
    fireEvent.click(dialogToggle);

    // Fill the form
    const titleInput = screen.getByTestId("input-title");
    fireEvent.change(titleInput, { target: { value: "My Test List" } });

    const dateInput = screen.getByTestId("input-plannedDate");
    fireEvent.change(dateInput, { target: { value: "2023-05-20" } });

    const storeInput = screen.getByTestId("input-store");
    fireEvent.change(storeInput, { target: { value: "Test Store" } });

    // Submit form
    const form = screen.getByTestId("input-title").closest("form");
    fireEvent.submit(form!);

    // Check if service was called with correct data
    await waitFor(() => {
      expect(createListMock).toHaveBeenCalledWith({
        title: "My Test List",
        plannedShoppingDate: "2023-05-20",
        storeName: "Test Store",
      });
    });

    // Check if callbacks were executed
    expect(mockOnListCreated).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/lists/list-123");
    expect(toast.success).toHaveBeenCalledWith("Lista została utworzona");
  });

  it("redirects to login if user is not authenticated", async () => {
    // Setup user not authenticated
    vi.mocked(AuthService).mockImplementation(() => ({
      isAuthenticated: vi.fn().mockReturnValue(false),
    }));

    render(<CreateListButton onListCreated={mockOnListCreated} />);

    // Open dialog and submit form
    const button = screen.getByTestId("button-nowa-lista");
    fireEvent.click(button);
    const dialogToggle = screen.getByTestId("dialog-open-toggle");
    fireEvent.click(dialogToggle);

    const form = screen.getByTestId("input-title").closest("form");
    fireEvent.submit(form!);

    // Check if redirected to login
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining("/login"));
    });

    // Callback should not be called
    expect(mockOnListCreated).not.toHaveBeenCalled();
  });

  it("shows error toast when list creation fails", async () => {
    // Setup error
    const mockError = new Error("Failed to create list");
    const shoppingListServiceMock = {
      createShoppingList: vi.fn().mockRejectedValue(mockError),
    };

    vi.mocked(ShoppingListService).mockImplementation(() => shoppingListServiceMock);

    render(<CreateListButton onListCreated={mockOnListCreated} />);

    // Open dialog and submit form
    const button = screen.getByTestId("button-nowa-lista");
    fireEvent.click(button);
    const dialogToggle = screen.getByTestId("dialog-open-toggle");
    fireEvent.click(dialogToggle);

    const form = screen.getByTestId("input-title").closest("form");
    fireEvent.submit(form!);

    // Debugging: Log the state of the mock
    console.log("Mock calls after submit:", shoppingListServiceMock.createShoppingList.mock.calls);

    // Wait for the error toast to be called
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to create list");
    });

    // Ensure the mock was called
    expect(shoppingListServiceMock.createShoppingList).toHaveBeenCalled();
  });
});
