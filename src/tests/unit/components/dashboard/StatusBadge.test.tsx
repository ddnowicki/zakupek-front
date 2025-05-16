import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatusBadge from "../../../../components/dashboard/StatusBadge";

describe("StatusBadge Component", () => {
  it("renderuje badge z podanym statusem", () => {
    render(<StatusBadge status="To Buy" />);
    
    const badge = screen.getByText("To Buy");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("px-2", "inline-flex", "text-xs", "leading-5", "font-semibold", "rounded-full");
  });

  it("stosuje niebieskie style dla statusu 'To Buy'", () => {
    render(<StatusBadge status="To Buy" />);
    
    const badge = screen.getByText("To Buy");
    expect(badge).toHaveClass("bg-blue-100", "text-blue-800");
  });

  it("stosuje niebieskie style dla statusu 'Pending'", () => {
    render(<StatusBadge status="Pending" />);
    
    const badge = screen.getByText("Pending");
    expect(badge).toHaveClass("bg-blue-100", "text-blue-800");
  });

  it("stosuje zielone style dla statusu 'Bought'", () => {
    render(<StatusBadge status="Bought" />);
    
    const badge = screen.getByText("Bought");
    expect(badge).toHaveClass("bg-green-100", "text-green-800");
  });

  it("stosuje zielone style dla statusu 'Purchased'", () => {
    render(<StatusBadge status="Purchased" />);
    
    const badge = screen.getByText("Purchased");
    expect(badge).toHaveClass("bg-green-100", "text-green-800");
  });

  it("stosuje żółte style dla statusu 'In Cart'", () => {
    render(<StatusBadge status="In Cart" />);
    
    const badge = screen.getByText("In Cart");
    expect(badge).toHaveClass("bg-yellow-100", "text-yellow-800");
  });

  it("stosuje domyślne szare style dla nieznanego statusu", () => {
    render(<StatusBadge status="Unknown Status" />);
    
    const badge = screen.getByText("Unknown Status");
    expect(badge).toHaveClass("bg-gray-200", "text-gray-800");
  });

  it("obsługuje case-insensitive statusy", () => {
    render(<StatusBadge status="to buy" />);
    
    const badge = screen.getByText("to buy");
    expect(badge).toHaveClass("bg-blue-100", "text-blue-800");
  });
});