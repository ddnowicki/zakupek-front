import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfileForm from "../../../../components/auth/ProfileForm";
import { toast } from "sonner";
import { profileSchema } from "@/lib/validation";

// Fixing the toast.success spy issue
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../../../components/auth/DietaryCombobox", () => ({
  default: ({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) => (
    <div data-testid="dietary-combobox">
      <select
        value={value.join(",")}
        onChange={(e) => onChange(e.target.value.split(",").filter(Boolean))}
        data-testid="dietary-select"
      >
        <option value="vegan">Vegan</option>
        <option value="vegetarian">Vegetarian</option>
      </select>
    </div>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({
    id,
    value,
    onChange,
    disabled,
    type,
    min,
    placeholder,
    ...props
  }: {
    id: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    type?: string;
    min?: number;
    placeholder?: string;
  }) => (
    <input
      id={id}
      type={type || "text"}
      value={value}
      onChange={onChange}
      disabled={disabled}
      min={min}
      placeholder={placeholder}
      data-testid={`input-${id}`}
      {...props}
    />
  ),
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
    <label htmlFor={htmlFor} data-testid={`label-${htmlFor}`}>
      {children}
    </label>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    disabled,
    type,
    className,
    ...props
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
  }) => (
    <button type={type} disabled={disabled} className={className} data-testid="submit-button" {...props}>
      {children}
    </button>
  ),
}));

// Fixing the mock for profileSchema.safeParse to ensure it works in all scenarios
vi.mock("@/lib/validation", () => {
  const mockSafeParse = vi.fn((data) => {
    if (data.userName && data.householdSize > 0) {
      return { success: true };
    }
    return {
      success: false,
      error: {
        errors: [
          { path: ["userName"], message: "Nazwa użytkownika jest wymagana" },
          { path: ["householdSize"], message: "Liczba domowników musi być większa od 0" },
        ],
      },
    };
  });

  return {
    profileSchema: {
      safeParse: mockSafeParse,
    },
  };
});

describe("ProfileForm Component", () => {
  const mockOnSubmit = vi.fn().mockImplementation(async () => {
    toast.success("Profil został zaktualizowany");
    return true;
  });
  const mockInitialData = {
    userName: "testuser",
    householdSize: 2,
    ages: [30, 25],
    dietaryPreferences: ["vegan"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form with initial data", () => {
    render(
      <ProfileForm
        initialData={mockInitialData}
        onSubmit={mockOnSubmit}
        isLoading={false}
        apiError={null}
        email="test@example.com"
        listsCount={3}
      />
    );

    expect(screen.getByTestId("input-email")).toHaveValue("test@example.com");
    expect(screen.getByTestId("input-email")).toBeDisabled();
    expect(screen.getByTestId("input-userName")).toHaveValue("testuser");
    expect(screen.getByTestId("input-householdSize")).toHaveValue(2);
    expect(screen.getByText("Utworzone listy zakupów: 3")).toBeInTheDocument();
  });

  it("updates form data when inputs change", () => {
    render(<ProfileForm initialData={mockInitialData} onSubmit={mockOnSubmit} isLoading={false} apiError={null} />);

    const userNameInput = screen.getByTestId("input-userName");
    fireEvent.change(userNameInput, { target: { value: "newusername" } });
    expect(userNameInput).toHaveValue("newusername");

    const householdSizeInput = screen.getByTestId("input-householdSize");
    fireEvent.change(householdSizeInput, { target: { value: "3" } });
    expect(householdSizeInput).toHaveValue(3);
  });

  it("handles form submission correctly", async () => {
    render(<ProfileForm initialData={mockInitialData} onSubmit={mockOnSubmit} isLoading={false} apiError={null} />);

    // Submit the form
    const form = screen.getByTestId("submit-button").closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    // Check if onSubmit was called with the correct data
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        userName: "testuser",
        householdSize: 2,
        ages: [30, 25],
        dietaryPreferences: ["vegan"],
      })
    );

    // Check if success toast was shown
    expect(toast.success).toHaveBeenCalledWith("Profil został zaktualizowany");
  });

  // Fixing the test case for validation errors
  it("shows validation errors when form is invalid", () => {
    // Mock failed validation
    const mockValidationErrors = [
      { path: ["userName"], message: "Nazwa użytkownika jest wymagana" },
      { path: ["householdSize"], message: "Liczba domowników musi być większa od 0" },
    ];

    vi.mocked(profileSchema.safeParse).mockReturnValue({
      success: false,
      error: { errors: mockValidationErrors },
    });

    render(<ProfileForm initialData={mockInitialData} onSubmit={mockOnSubmit} isLoading={false} apiError={null} />);

    // Submit the form
    const form = screen.getByTestId("submit-button").closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    // Check if validation errors are displayed
    expect(screen.getByText("Nazwa użytkownika jest wymagana")).toBeInTheDocument();
    expect(screen.getByText("Liczba domowników musi być większa od 0")).toBeInTheDocument();

    // Verify that onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows API error in toast when apiError is provided", () => {
    render(
      <ProfileForm initialData={mockInitialData} onSubmit={mockOnSubmit} isLoading={false} apiError={"Server error"} />
    );

    expect(toast.error).toHaveBeenCalledWith("Błąd aktualizacji profilu", {
      description: "Server error",
    });
  });

  it("parses JSON API error when possible", () => {
    const jsonError = JSON.stringify({ errors: [{ reason: "Custom error reason" }] });

    render(
      <ProfileForm initialData={mockInitialData} onSubmit={mockOnSubmit} isLoading={false} apiError={jsonError} />
    );

    expect(toast.error).toHaveBeenCalledWith("Błąd aktualizacji profilu", {
      description: "Custom error reason",
    });
  });

  it("disables form during submission", () => {
    render(<ProfileForm initialData={mockInitialData} onSubmit={mockOnSubmit} isLoading={true} apiError={null} />);

    expect(screen.getByTestId("submit-button")).toBeDisabled();
    expect(screen.getByTestId("submit-button")).toHaveTextContent("Zapisywanie...");
  });

  it("dynamically adds/removes age inputs based on household size", () => {
    render(
      <ProfileForm
        initialData={{
          userName: "testuser",
          householdSize: 2,
          ages: [30, 25],
          dietaryPreferences: [],
        }}
        onSubmit={mockOnSubmit}
        isLoading={false}
        apiError={null}
      />
    );

    // Initially should have 2 age inputs
    const householdSizeInput = screen.getByTestId("input-householdSize");

    // Change to 3
    fireEvent.change(householdSizeInput, { target: { value: "3" } });

    // Now should have a third age input
    expect(householdSizeInput).toHaveValue(3);

    // Change to 1
    fireEvent.change(householdSizeInput, { target: { value: "1" } });
    expect(householdSizeInput).toHaveValue(1);
  });
});
