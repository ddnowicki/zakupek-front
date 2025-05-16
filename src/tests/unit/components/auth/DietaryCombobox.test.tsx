import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DietaryCombobox from "../../../../components/auth/DietaryCombobox";
import { DIETARY_PREFERENCES } from "@/lib/constants";

// Mock dla ikon Lucide
vi.mock("lucide-react", () => ({
  PlusCircle: () => <div data-testid="plus-icon" />,
  X: () => <div data-testid="x-icon" />,
}));

// Mock dla Button komponentu
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, className, ...props }) => (
    <button onClick={onClick} disabled={disabled} className={className} data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

// Mock dla DIETARY_PREFERENCES
vi.mock("@/lib/constants", () => ({
  DIETARY_PREFERENCES: [
    { id: "wegetarianska", label: "Wegetariańska" },
    { id: "weganska", label: "Wegańska" },
    { id: "bezglutenowa", label: "Bezglutenowa" },
  ],
}));

describe("DietaryCombobox Component", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockReset();
  });

  it("renders correctly with empty values", () => {
    render(<DietaryCombobox value={[]} onChange={mockOnChange} />);

    // Powinien mieć pole do wprowadzania tekstu
    const input = screen.getByRole("combobox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Wpisz dietę...");

    // Nie powinno być żadnych wybranych preferencji
    const selectedPreferences = screen.queryByTestId("x-icon");
    expect(selectedPreferences).not.toBeInTheDocument();
  });

  it("renders selected dietary preferences correctly", () => {
    const selectedPreferences = ["Wegetariańska", "Wegańska"];

    render(<DietaryCombobox value={selectedPreferences} onChange={mockOnChange} />);

    // Powinny być wyświetlone dwie wybrane preferencje
    expect(screen.getByText("Wegetariańska")).toBeInTheDocument();
    expect(screen.getByText("Wegańska")).toBeInTheDocument();

    // Placeholder powinien wskazywać na możliwość dodania kolejnej diety
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("placeholder", "Dodaj kolejną dietę...");
  });

  it("shows suggestions when user types", async () => {
    render(<DietaryCombobox value={[]} onChange={mockOnChange} />);

    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "we" } });

    // Sprawdź, czy lista sugestii jest widoczna
    await waitFor(() => {
      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeInTheDocument();

      // Powinny być wyświetlone dwie sugestie pasujące do "we"
      const options = screen.getAllByRole("option");
      expect(options.length).toBe(3); // 2 z DIETARY_PREFERENCES + 1 niestandardowa

      expect(screen.getByText("We")).toBeInTheDocument(); // Niestandardowa opcja (pierwsza litera duża)
      expect(screen.getByText("Wegetariańska")).toBeInTheDocument();
      expect(screen.getByText("Wegańska")).toBeInTheDocument();
    });
  });

  it("adds a dietary preference when clicked from suggestions", async () => {
    render(<DietaryCombobox value={[]} onChange={mockOnChange} />);

    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "weget" } });

    await waitFor(() => {
      const option = screen.getByText("Wegetariańska");
      fireEvent.click(option);

      expect(mockOnChange).toHaveBeenCalledWith(["Wegetariańska"]);
    });
  });

  it("adds a custom dietary preference", async () => {
    render(<DietaryCombobox value={[]} onChange={mockOnChange} />);

    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "paleo" } });

    await waitFor(() => {
      const option = screen.getByText("Paleo"); // Niestandardowa opcja (pierwsza litera duża)
      fireEvent.click(option);

      expect(mockOnChange).toHaveBeenCalledWith(["Paleo"]);
    });
  });

  it("removes a dietary preference when delete button is clicked", () => {
    const selectedPreferences = ["Wegetariańska", "Wegańska"];

    render(<DietaryCombobox value={selectedPreferences} onChange={mockOnChange} />);

    const removeButtons = screen.getAllByTestId("button");
    fireEvent.click(removeButtons[0]); // Usuń pierwszą preferencję

    expect(mockOnChange).toHaveBeenCalledWith(["Wegańska"]);
  });

  it("handles keyboard navigation", async () => {
    render(<DietaryCombobox value={[]} onChange={mockOnChange} />);

    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "we" } });

    // Naciśnięcie klawisza strzałki w dół
    fireEvent.keyDown(input, { key: "ArrowDown" });

    // Naciśnięcie Enter powinno dodać wybraną preferencję
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("disables input when disabled prop is true", () => {
    render(<DietaryCombobox value={["Wegetariańska"]} onChange={mockOnChange} disabled />);

    const input = screen.getByRole("combobox");
    expect(input).toBeDisabled();

    // Przyciski usuwania również powinny być wyłączone
    const removeButton = screen.getByTestId("button");
    expect(removeButton).toBeDisabled();
  });
});
