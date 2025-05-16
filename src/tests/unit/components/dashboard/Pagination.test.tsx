import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Pagination } from "../../../../components/dashboard/Pagination";

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

describe("Pagination Component", () => {
  const defaultPagination = {
    page: 2,
    pageSize: 10,
    totalItems: 30,
    totalPages: 3,
  };
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderuje numer strony i przyciski", () => {
    render(<Pagination pagination={defaultPagination} onPageChange={mockOnPageChange} />);
    expect(screen.getByText(/Strona 2 z 3/)).toBeInTheDocument();
    expect(screen.getByText("Poprzednia")).toBeInTheDocument();
    expect(screen.getByText("Następna")).toBeInTheDocument();
  });

  it("wywołuje onPageChange po kliknięciu Następna", () => {
    render(<Pagination pagination={defaultPagination} onPageChange={mockOnPageChange} />);
    fireEvent.click(screen.getByText("Następna"));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it("wywołuje onPageChange po kliknięciu Poprzednia", () => {
    render(<Pagination pagination={defaultPagination} onPageChange={mockOnPageChange} />);
    fireEvent.click(screen.getByText("Poprzednia"));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it("blokuje Poprzednia na pierwszej stronie", () => {
    render(<Pagination pagination={{ ...defaultPagination, page: 1 }} onPageChange={mockOnPageChange} />);
    expect(screen.getByText("Poprzednia")).toBeDisabled();
  });

  it("blokuje Następna na ostatniej stronie", () => {
    render(<Pagination pagination={{ ...defaultPagination, page: 3 }} onPageChange={mockOnPageChange} />);
    expect(screen.getByText("Następna")).toBeDisabled();
  });
});
