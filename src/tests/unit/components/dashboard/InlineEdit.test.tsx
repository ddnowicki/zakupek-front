import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import InlineEdit from "../../../../components/dashboard/InlineEdit";

// We don't need to mock Input since our tests will work with the native input
vi.mock("@/components/ui/input", () => ({
  Input: ({ value, onChange, onKeyDown, onBlur, ...props }) => (
    <input value={value} onChange={onChange} onKeyDown={onKeyDown} onBlur={onBlur} {...props} />
  ),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("InlineEdit Component", () => {
  const mockOnChange = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderuje tekst, gdy nie jest w trybie edycji", () => {
    render(<InlineEdit value="Test" onChange={mockOnChange} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("przechodzi w tryb edycji po podwójnym kliknięciu", () => {
    render(<InlineEdit value="Test" onChange={mockOnChange} />);
    fireEvent.dblClick(screen.getByText("Test"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("Test");
  });

  it("wywołuje onChange po zatwierdzeniu edycji (Enter)", () => {
    render(<InlineEdit value="Test" onChange={mockOnChange} />);
    fireEvent.dblClick(screen.getByText("Test"));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Nowa wartość" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnChange).toHaveBeenCalledWith("Nowa wartość");
  });

  it("anuluje edycję po Escape", () => {
    render(<InlineEdit value="Test" onChange={mockOnChange} />);
    fireEvent.dblClick(screen.getByText("Test"));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Nowa wartość" } });
    fireEvent.keyDown(input, { key: "Escape" });

    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("zatwierdza edycję po blur", () => {
    render(<InlineEdit value="Test" onChange={mockOnChange} />);
    fireEvent.dblClick(screen.getByText("Test"));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Nowa wartość" } });
    fireEvent.blur(input);

    expect(mockOnChange).toHaveBeenCalledWith("Nowa wartość");
  });
});
