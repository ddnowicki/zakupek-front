export interface DietaryPreference {
  id: string;
  label: string;
  isCustom?: boolean;
}

export const DIETARY_PREFERENCES: DietaryPreference[] = [
  { id: "wegetarianska", label: "Wegetariańska" },
  { id: "weganska", label: "Wegańska" },
  { id: "bezglutenowa", label: "Bezglutenowa" },
  { id: "bez-laktozy", label: "Bez laktozy" },
  { id: "ketogeniczna", label: "Ketogeniczna" },
  { id: "niskotluszczowa", label: "Niskotłuszczowa" },
  { id: "niskoweglowodanowa", label: "Niskowęglowodanowa" },
  { id: "wysokobialkowa", label: "Wysokobiałkowa" },
  { id: "paleo", label: "Paleo" },
  { id: "pescatarianska", label: "Pescatariańska" },
  { id: "srodziemnomorska", label: "Śródziemnomorska" },
  { id: "bez-cukru", label: "Bez cukru" },
  { id: "bez-soi", label: "Bez soi" },
  { id: "bez-jajek", label: "Bez jajek" },
  { id: "bez-orzechow", label: "Bez orzechów" },
  { id: "koszerna", label: "Koszerna" },
  { id: "halal", label: "Halal" },
  { id: "raw", label: "Raw food" },
  { id: "dash", label: "DASH" },
  { id: "fodmap", label: "Low FODMAP" },
];

export interface HouseholdSizeOption {
  value: string;
  label: string;
}

export const HOUSEHOLD_SIZE_OPTIONS: HouseholdSizeOption[] = Array.from({ length: 11 }, (_, i) => ({
  value: i.toString(),
  label: i.toString(),
}));
