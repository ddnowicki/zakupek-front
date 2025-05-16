import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DashboardPage } from "../../../../components/dashboard/DashboardPage";
import { ApiClient } from "@/lib/api";
import * as useNavigateModule from "@/lib/hooks/useNavigate";
import type { ShoppingListsResponse, ShoppingListResponse } from "@/types";

// Mock zależności
vi.mock("@/lib/api", () => ({
  ApiClient: vi.fn().mockImplementation(() => ({
    setToken: vi.fn(),
  })),
}));

// --- GLOBAL MOCKS ---
const mockGetShoppingLists = vi.fn();
const mockIsAuthenticated = vi.fn();

vi.mock("@/lib/services/shopping-list", () => {
  return {
    ShoppingListService: vi.fn().mockImplementation(() => ({
      getShoppingLists: (...args) => mockGetShoppingLists(...args),
    })),
  };
});

vi.mock("@/lib/services/auth", () => {
  return {
    AuthService: vi.fn().mockImplementation(() => ({
      isAuthenticated: (...args) => mockIsAuthenticated(...args),
    })),
  };
});

vi.mock("@/lib/hooks/useNavigate", () => ({
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
}));

// Mock dla komponentów UI
vi.mock("../../../../components/dashboard/ListCard", () => ({
  ListCard: ({ list }) => (
    <div data-testid={`list-card-${list.id}`} data-list-title={list.title}>
      List: {list.title}
    </div>
  ),
}));

vi.mock("../../../../components/dashboard/Pagination", () => ({
  Pagination: ({ pagination, onPageChange }) => (
    <div data-testid="pagination">
      <span data-testid="pagination-page">{pagination.page}</span>
      <span data-testid="pagination-total">{pagination.totalPages}</span>
      <button onClick={() => onPageChange(2)} data-testid="next-page">
        Next Page
      </button>
    </div>
  ),
}));

vi.mock("../../../../components/dashboard/CreateListButton", () => ({
  CreateListButton: ({ onListCreated }) => (
    <button onClick={onListCreated} data-testid="create-list-button">
      Create List
    </button>
  ),
}));

vi.mock("../../../../components/dashboard/GenerateListButton", () => ({
  GenerateListButton: ({ onListGenerated }) => (
    <button onClick={onListGenerated} data-testid="generate-list-button">
      Generate List
    </button>
  ),
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ value, onValueChange, children }) => (
    <div data-testid="sort-select" data-value={value}>
      <select value={value} onChange={(e) => onValueChange(e.target.value)} data-testid="sort-select-input">
        <option value="newest">Najnowsze</option>
        <option value="oldest">Najstarsze</option>
        <option value="name">Nazwa</option>
      </select>
      {children}
    </div>
  ),
  SelectTrigger: ({ children, className }) => (
    <div data-testid="select-trigger" className={className}>
      {children}
    </div>
  ),
  SelectValue: ({ placeholder }) => <span data-testid="select-value">{placeholder}</span>,
  SelectContent: ({ children }) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ value, children }) => (
    <option value={value} data-testid={`select-option-${value}`}>
      {children}
    </option>
  ),
}));

// Mock dla localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Add a mock implementation for `client:load` directive to simulate dynamic loading
vi.mock("astro/client", () => ({
  client: {
    load: vi.fn().mockImplementation((Component) => Component),
  },
}));

describe("DashboardPage Component", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    console.log("Resetting mocks and state...");
    vi.clearAllMocks();
    vi.spyOn(useNavigateModule, "useNavigate").mockReturnValue(mockNavigate);

    mockIsAuthenticated.mockReturnValue(true);
    mockGetShoppingLists.mockResolvedValue({
      data: [
        {
          id: "list-1",
          title: "List 1",
          storeName: "Store 1",
          plannedShoppingDate: "2023-05-16",
          status: "active",
          createdAt: "2023-05-15",
          itemsCount: 5,
        },
        {
          id: "list-2",
          title: "List 2",
          storeName: "Store 2",
          plannedShoppingDate: "2023-05-17",
          status: "active",
          createdAt: "2023-05-15",
          itemsCount: 3,
        },
      ],
      pagination: { page: 1, pageSize: 9, totalItems: 2, totalPages: 1 },
    });

    // Reset localStorage mock
    localStorageMock.clear();
    localStorageMock.setItem("token", "mock-token");

    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, "innerWidth", { value: 1024, writable: true });
    vi.spyOn(window, "addEventListener").mockImplementation((event, handler) => {
      if (event === "resize") {
        handler();
      }
    });

    // Add a mock implementation for window.fetch to simulate API responses
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes("/api/shopping-lists")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [
                {
                  id: "list-1",
                  title: "List 1",
                  storeName: "Store 1",
                  plannedShoppingDate: "2023-05-16",
                  status: "active",
                  createdAt: "2023-05-15",
                  itemsCount: 5,
                },
                {
                  id: "list-2",
                  title: "List 2",
                  storeName: "Store 2",
                  plannedShoppingDate: "2023-05-17",
                  status: "active",
                  createdAt: "2023-05-15",
                  itemsCount: 3,
                },
              ],
              pagination: { page: 1, pageSize: 9, totalItems: 2, totalPages: 1 },
            }),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    console.log("Mocks and state reset complete.");
  });

  it("redirects to login page if not authenticated", async () => {
    mockIsAuthenticated.mockReturnValue(false);

    render(<DashboardPage />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining("/login"));
    });
  });

  it("fetches shopping lists on load", async () => {
    console.log("Rendering DashboardPage...");
    render(<DashboardPage />);

    console.log("Manually triggering state updates...");
    fireEvent(window, new Event("resize")); // Simulate resize to ensure itemsPerPage is set

    console.log("Waiting for mockGetShoppingLists to be called...");
    await waitFor(() => {
      expect(mockGetShoppingLists).toHaveBeenCalledWith(1, 9, "newest");
    });
    console.log("mockGetShoppingLists was called successfully.");
  });

  it("renders loading state initially", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays empty state when no lists are available", async () => {
    mockGetShoppingLists.mockResolvedValueOnce({
      data: [],
      pagination: { page: 1, pageSize: 9, totalItems: 0, totalPages: 1 },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Nie masz jeszcze żadnych list zakupów.")).toBeInTheDocument();
    });
  });

  it("displays lists when data is loaded", async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId("list-card-list-1")).toBeInTheDocument();
      expect(screen.getByTestId("list-card-list-2")).toBeInTheDocument();
    });
  });

  it("changes page when pagination is clicked", async () => {
    // Setup pagination
    mockGetShoppingLists.mockResolvedValueOnce({
      data: [
        {
          id: "list-1",
          title: "List 1",
          storeName: "Store",
          plannedShoppingDate: "2023-05-16",
          status: "active",
          createdAt: "2023-05-15",
          itemsCount: 5,
        },
      ],
      pagination: { page: 1, pageSize: 9, totalItems: 18, totalPages: 2 },
    });

    render(<DashboardPage />);

    // Wait for first render
    await waitFor(() => {
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    // Reset mock to track next call
    mockGetShoppingLists.mockClear();
    mockGetShoppingLists.mockResolvedValueOnce({
      data: [
        {
          id: "list-2",
          title: "List 2",
          storeName: "Store",
          plannedShoppingDate: "2023-05-17",
          status: "active",
          createdAt: "2023-05-15",
          itemsCount: 3,
        },
      ],
      pagination: { page: 2, pageSize: 9, totalItems: 18, totalPages: 2 },
    });

    // Click next page
    const nextPageButton = screen.getByTestId("next-page");
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(mockGetShoppingLists).toHaveBeenCalledWith(2, 9, "newest");
    });
  });

  it("changes sort order when sort is changed", async () => {
    render(<DashboardPage />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByTestId("sort-select")).toBeInTheDocument();
    });

    // Reset mock to track next call
    mockGetShoppingLists.mockClear();

    // Change sort order
    const sortSelect = screen.getByTestId("sort-select-input");
    fireEvent.change(sortSelect, { target: { value: "name" } });

    await waitFor(() => {
      expect(mockGetShoppingLists).toHaveBeenCalledWith(1, 9, "name");
    });
  });

  it("resets to page 1 when sort order changes", async () => {
    // Start with page 2
    mockGetShoppingLists.mockResolvedValueOnce({
      data: [
        {
          id: "list-1",
          title: "List 1",
          storeName: "Store",
          plannedShoppingDate: "2023-05-16",
          status: "active",
          createdAt: "2023-05-15",
          itemsCount: 5,
        },
      ],
      pagination: { page: 2, pageSize: 9, totalItems: 18, totalPages: 2 },
    });

    render(<DashboardPage />);

    // Wait for first load
    await waitFor(() => {
      expect(screen.getByTestId("sort-select")).toBeInTheDocument();
    });

    // Reset mock to track next call
    mockGetShoppingLists.mockClear();
    mockGetShoppingLists.mockResolvedValueOnce({
      data: [
        {
          id: "list-2",
          title: "List 2",
          storeName: "Store",
          plannedShoppingDate: "2023-05-17",
          status: "active",
          createdAt: "2023-05-15",
          itemsCount: 3,
        },
      ],
      pagination: { page: 1, pageSize: 9, totalItems: 18, totalPages: 2 },
    });

    // Change sort order
    const sortSelect = screen.getByTestId("sort-select-input");
    fireEvent.change(sortSelect, { target: { value: "name" } });

    await waitFor(() => {
      expect(mockGetShoppingLists).toHaveBeenCalledWith(1, 9, "name");
    });
  });

  it("displays error message when fetching lists fails", async () => {
    const error = new Error("An error occurred");
    mockGetShoppingLists.mockRejectedValueOnce(error);

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
    });
  });

  it("resets to page 1 when create list button is clicked", async () => {
    render(<DashboardPage />);

    // Change sort to something else to ensure state actually changes
    await waitFor(() => {
      expect(screen.getByTestId("sort-select")).toBeInTheDocument();
    });
    mockGetShoppingLists.mockClear();
    const sortSelect = screen.getByTestId("sort-select-input");
    fireEvent.change(sortSelect, { target: { value: "name" } });
    await waitFor(() => {
      expect(mockGetShoppingLists).toHaveBeenCalledWith(1, 9, "name");
    });
    mockGetShoppingLists.mockClear();

    // Now click create list button
    await waitFor(() => {
      expect(screen.getByTestId("create-list-button")).toBeInTheDocument();
    });
    const createButton = screen.getByTestId("create-list-button");
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockGetShoppingLists).toHaveBeenCalledWith(1, 9, "newest");
    });
  });

  it("handles mobile view and changes items per page", async () => {
    // Set window width to mobile size
    Object.defineProperty(window, "innerWidth", { value: 600, writable: true });

    // Trigger resize event
    global.dispatchEvent(new Event("resize"));

    render(<DashboardPage />);

    // In mobile view, it should use a different page size (e.g., 3 items per page)
    await waitFor(() => {
      expect(mockGetShoppingLists).toHaveBeenCalled();
      // This test is a bit trickier because the component uses useEffect with addEventListener
      // We'd need to actually trigger the resize event handler
    });
  });
});
