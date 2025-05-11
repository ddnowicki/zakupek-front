import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { ApiClient } from "../../lib/api";
import { ShoppingListService } from "../../lib/services/shopping-list";
import type { GenerateShoppingListRequest, ShoppingListDetailResponse } from "../../types";
import { useNavigate } from "../../lib/hooks/useNavigate";

interface GenerateListButtonProps {
  onListGenerated: () => void;
}

export const GenerateListButton = ({ onListGenerated }: GenerateListButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [plannedDate, setPlannedDate] = useState("");
  const [storeName, setStoreName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiClient = useMemo(() => {
    const client = new ApiClient();
    const token = localStorage.getItem("token");
    if (token) {
      client.setToken(token);
    }
    return client;
  }, []);
  const shoppingListService = useMemo(() => new ShoppingListService(apiClient), [apiClient]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.info("Generowanie listy zakupów...");

    const requestData: GenerateShoppingListRequest = {};
    if (title.trim()) requestData.title = title.trim();
    if (plannedDate) requestData.plannedShoppingDate = new Date(plannedDate).toISOString();
    if (storeName.trim()) requestData.storeName = storeName.trim();

    try {
      const response = await shoppingListService.generateShoppingList(requestData);
      toast.success("Lista zakupów została wygenerowana pomyślnie!");
      onListGenerated();
      setIsOpen(false);
      // Reset form
      setTitle("");
      setPlannedDate("");
      setStoreName("");
      // Redirect to the update/details page of the newly generated list
      navigate(`/lists/${response.id}`); 
    } catch (error) {
      console.error("Error generating shopping list:", error);
      const errorMessage = error instanceof Error ? error.message : "Wystąpił nieznany błąd.";
      toast.error(`Błąd podczas generowania listy: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-robot mr-2" viewBox="0 0 16 16">
            <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm0 1.867v-.27A2.002 2.002 0 0 0 2.5 8.062V6.5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1.562c0 .27-.084.53-.235.751A2.002 2.002 0 0 0 13.5 9.93v.27c0 .02.005.038.008.056a1 1 0 0 1-1.008.944c-1.06.096-2.558.162-4.5.162s-3.44-.066-4.5-.162A1 1 0 0 1 3.008 9.986a.06.06 0 0 0 .008-.056m2.008 1.163A2 2 0 0 0 4.5 14h7a2 2 0 0 0 1.488-2.772.5.5 0 0 1 .866.5A3 3 0 0 1 11.5 15h-7a3 3 0 0 1-2.854-4.228.5.5 0 0 1 .866-.5Z"/>
            <path d="M10.5 1.5A.5.5 0 0 1 11 1h1.5v1.5a.5.5 0 0 1-1 0V2h-1a.5.5 0 0 1-.5-.5M5.5 1.5A.5.5 0 0 0 5 1H3.5v1.5a.5.5 0 0 0 1 0V2h1a.5.5 0 0 0 .5-.5"/>
          </svg>
          Generuj listę AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generuj nową listę zakupów AI</DialogTitle>
          <DialogDescription>
            Wprowadź opcjonalne szczegóły dla listy, którą chcesz wygenerować. AI spróbuje dostosować się do Twoich preferencji.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Title Field */}
            <div className="grid gap-2">
              <Label htmlFor="title">Tytuł</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Np. Cotygodniowe zakupy"
              />
            </div>
            {/* Planned Date Field */}
            <div className="grid gap-2">
              <Label htmlFor="plannedDate">Data planowana</Label>
              <Input
                id="plannedDate"
                type="date"
                value={plannedDate}
                onChange={(e) => setPlannedDate(e.target.value)}
              />
            </div>
            {/* Store Name Field */}
            <div className="grid gap-2">
              <Label htmlFor="storeName">Nazwa sklepu</Label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Np. Biedronka"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Generowanie..." : "Generuj"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
