import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface DeleteListButtonProps {
  onDelete: () => void;
  isLoading?: boolean;
}

const DeleteListButton: React.FC<DeleteListButtonProps> = ({ onDelete, isLoading }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmDialog(false);
    onDelete();
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Button 
        variant="destructive" 
        onClick={handleDeleteClick}
        disabled={isLoading}
      >
        {isLoading ? "Usuwanie..." : "Usuń listę"}
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuwanie listy</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć tę listę? Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Usuń</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteListButton;
