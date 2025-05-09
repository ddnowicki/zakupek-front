import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { DIETARY_PREFERENCES, type DietaryPreference } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DietaryComboboxProps {
  onAdd: (diet: DietaryPreference) => void;
  disabled?: boolean;
}

export function DietaryCombobox({ onAdd, disabled = false }: DietaryComboboxProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const filteredSuggestions = DIETARY_PREFERENCES.filter((diet) =>
    diet.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );

  const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

  const allSuggestions: DietaryPreference[] = inputValue.trim()
    ? [
        {
          id: inputValue.toLowerCase().replace(/\s+/g, "-"),
          label: capitalizeFirstLetter(inputValue.trim()),
          isCustom: true,
        },
        ...filteredSuggestions.filter((diet) => diet.label.toLowerCase() !== inputValue.toLowerCase()),
      ]
    : [];

  const handleAdd = (diet: DietaryPreference) => {
    onAdd(diet);
    setInputValue("");
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isFocused || !allSuggestions.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < allSuggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleAdd(allSuggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsFocused(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setHighlightedIndex(-1);
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsFocused(false);
                setHighlightedIndex(-1);
              }, 200);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Wpisz dietę..."
            disabled={disabled}
            aria-expanded={isFocused && allSuggestions.length > 0}
            aria-controls={allSuggestions.length > 0 ? "dietary-suggestions" : undefined}
            aria-activedescendant={highlightedIndex >= 0 ? `dietary-option-${highlightedIndex}` : undefined}
            role="combobox"
            className={cn(
              "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
          {isFocused && inputValue.trim() && allSuggestions.length > 0 && (
            <ul
              id="dietary-suggestions"
              role="listbox"
              className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {allSuggestions.map((diet, index) => (
                <li
                  key={diet.id}
                  id={`dietary-option-${index}`}
                  role="option"
                  aria-selected={highlightedIndex === index}
                  tabIndex={0}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 cursor-pointer",
                    highlightedIndex === index && "bg-gray-100",
                    index === 0 && diet.isCustom && "border-b border-gray-100 bg-blue-50/50"
                  )}
                  onClick={() => handleAdd(diet)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleAdd(diet);
                    }
                  }}
                >
                  <span className={cn("text-sm", diet.isCustom && "font-medium")}>{diet.label}</span>
                  <PlusCircle className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default DietaryCombobox;
