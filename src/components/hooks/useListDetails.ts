import { useState, useEffect, useCallback, useMemo } from "react";
import type { ShoppingListDetailResponse } from "@/types";
import { ApiClient, HandledError } from "@/lib/api";
import { ShoppingListService } from "@/lib/services/shopping-list";
import { useNavigate } from "@/lib/hooks/useNavigate";
import { toast } from "sonner";

export function useListDetails(listId: number | null) {
  const [listData, setListData] = useState<ShoppingListDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<HandledError | null>(null);
  const navigate = useNavigate();

  const apiClient = useMemo(() => {
    const client = new ApiClient(import.meta.env.PUBLIC_API_BASE_URL);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      client.setToken(token);
    }
    return client;
  }, []);

  const shoppingListService = useMemo(() => new ShoppingListService(apiClient), [apiClient]);

  const fetchListDetails = useCallback(async () => {
    if (!listId) {
      setIsLoading(false);
      setListData(null);
      setError(new HandledError("List ID is not provided.", 0, {}));
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await shoppingListService.getShoppingListById(listId);
      setListData(data);
    } catch (err) {
      if (err instanceof HandledError) {
        if (err.status === 401) {
          toast.error("Sesja wygasła. Zaloguj się ponownie.");
          navigate(`/login?redirectUrl=/lists/${listId}`);
          return;
        } else if (err.status === 404) {
          setError(new HandledError("Nie znaleziono listy.", 404, err.payload));
        } else {
          setError(err);
        }
      } else {
        setError(new HandledError("Failed to fetch list details", 0, {}));
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [listId, shoppingListService, navigate]);

  useEffect(() => {
    fetchListDetails();
  }, [fetchListDetails]);

  return { listData, isLoading, error, refetch: fetchListDetails };
}
