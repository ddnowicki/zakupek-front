import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { format } from "date-fns";
import { toast } from "sonner";
import { ApiClient } from "../../lib/api";
import { ShoppingListService } from "../../lib/services/shopping-list";
import { AuthService } from "../../lib/services/auth";
import type { CreateShoppingListRequest } from "../../types";
import { useNavigate } from "../../lib/hooks/useNavigate";

interface CreateListButtonProps {
  onListCreated: () => void;
}

export const CreateListButton = ({ onListCreated }: CreateListButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateShoppingListRequest>({
    title: "",
    plannedShoppingDate: format(new Date(), "yyyy-MM-dd"),
    storeName: "",
  });

  const apiClient = useMemo(() => new ApiClient(), []);
  const authService = useMemo(() => new AuthService(apiClient), [apiClient]);
  const shoppingListService = useMemo(() => new ShoppingListService(apiClient), [apiClient]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!authService.isAuthenticated()) {
        console.log("No valid token found in CreateListButton");
        navigate(`/login?redirectUrl=${window.location.pathname}`);
        return;
      }

      await shoppingListService.createShoppingList(formData);

      setIsOpen(false);
      onListCreated();
      setFormData({
        title: "",
        plannedShoppingDate: format(new Date(), "yyyy-MM-dd"),
        storeName: "",
      });
      toast.success("Lista została utworzona");
    } catch (error) {
      console.error("Error creating list:", error);
      toast.error(error instanceof Error ? error.message : "Wystąpił błąd podczas tworzenia listy");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Nowa lista</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Utwórz nową listę zakupów</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nazwa listy</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              maxLength={100}
              placeholder="np. Zakupy na weekend"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plannedDate">Planowana data zakupów</Label>
            <Input
              id="plannedDate"
              type="date"
              value={formData.plannedShoppingDate || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, plannedShoppingDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store">Sklep</Label>
            <Input
              id="store"
              value={formData.storeName || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, storeName: e.target.value }))}
              maxLength={100}
              placeholder="np. Biedronka"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Anuluj
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Tworzenie..." : "Utwórz listę"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
