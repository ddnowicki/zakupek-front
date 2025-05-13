import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"; // Assuming shadcn/ui input
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui button
import { toast } from "sonner"; // Ensure toast is imported

interface InlineEditProps {
  value: string | number;
  onChange: (newValue: string | number) => void;
  inputType?: "text" | "number" | "date"; // Added "date"
  validationRules?: {
    minLength?: number;
    min?: number; // For number input
  };
  originalValueOnError?: boolean; // Added for better UX on validation error
}

const InlineEdit: React.FC<InlineEditProps> = ({ value, onChange, inputType = "text", validationRules, originalValueOnError = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
  };

  const handleSave = () => {
    let isValid = true;
    let errorMessage = "";

    if (inputType === "number" && validationRules?.min !== undefined) {
      if (Number(currentValue) < validationRules.min) {
        isValid = false;
        errorMessage = `Wartość musi wynosić co najmniej ${validationRules.min}`;
      }
    }
    if (inputType === "text" && validationRules?.minLength !== undefined) {
      if (String(currentValue).length < validationRules.minLength) {
        isValid = false;
        errorMessage = `Długość musi wynosić co najmniej ${validationRules.minLength} znaków`;
      }
    }

    if (!isValid) {
      toast.error(errorMessage);
      if (originalValueOnError) {
        setCurrentValue(value); // Revert to original value on validation failure
      }
      setIsEditing(false);
      return;
    }

    onChange(currentValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <Input
          type={inputType}
          value={currentValue}
          onChange={handleChange}
          autoFocus
          onBlur={handleSave} // Save on blur
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
        />
        {/* Optionally, explicit save/cancel buttons can be added if onBlur is not preferred */}
        {/* <Button onClick={handleSave} size="sm">Save</Button>
        <Button onClick={handleCancel} variant="outline" size="sm">Cancel</Button> */}
      </div>
    );
  }

  // When not editing, display the value or a placeholder for empty string
  // Apply min height and width to ensure clickability
  return (
    <span 
      onDoubleClick={handleDoubleClick} 
      className="cursor-pointer hover:bg-gray-100 p-1 rounded min-h-8 min-w-20 inline-block align-middle"
    >
      {value === "" ? <span className="text-gray-400 italic">[puste]</span> : value}
    </span>
  );
};

export default InlineEdit;
