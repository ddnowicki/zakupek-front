import React from "react";
import { Button } from "@/components/ui/button";

interface SaveButtonProps {
  onSave: () => void;
  isLoading?: boolean;
}

const SaveButton = ({ onSave, isLoading }: SaveButtonProps) => {
  return (
    <Button
      onClick={onSave}
      disabled={isLoading}
      variant="default"
    >
      {isLoading ? "Zapisywanie..." : "Zapisz"}
    </Button>
  );
};

export default SaveButton;
