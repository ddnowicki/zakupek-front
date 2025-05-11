import { useState, useEffect, useMemo } from "react";
import type { ShoppingListsResponse, ShoppingListResponse } from "../../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ListCard } from "./ListCard";
import { Pagination } from "./Pagination";
import { CreateListButton } from "./CreateListButton";
import { ApiClient } from "../../lib/api";
import { ShoppingListService } from "../../lib/services/shopping-list";
import { AuthService } from "../../lib/services/auth";

export const DashboardPage = () => {
  const [lists, setLists] = useState<ShoppingListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState<string>("newest");

  const apiClient = useMemo(() => new ApiClient(), []);
  const authService = useMemo(() => new AuthService(apiClient), [apiClient]);
  const shoppingListService = useMemo(() => new ShoppingListService(apiClient), [apiClient]);

  useEffect(() => {
    // Load token on mount
    const token = localStorage.getItem("token");
    if (token) {
      apiClient.setToken(token);
    }
  }, [apiClient]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!authService.isAuthenticated()) {
          console.log("No valid token found in DashboardPage");
          setError("Brak autoryzacji");
          return;
        }

        const response = await shoppingListService.getShoppingLists(currentPage, 10, sort);
        setLists(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (err) {
        console.error("Error fetching lists:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [currentPage, sort, shoppingListService, authService]);

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleListCreated = () => {
    // Reset to first page and refresh lists
    setCurrentPage(1);
    setSort("newest");
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Listy zakupów</h1>
        <div className="flex gap-4 items-center">
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sortowanie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Najnowsze</SelectItem>
              <SelectItem value="oldest">Najstarsze</SelectItem>
              <SelectItem value="name">Nazwa</SelectItem>
            </SelectContent>
          </Select>
          <CreateListButton onListCreated={handleListCreated} />
        </div>
      </div>
      {lists.length === 0 ? (
        <div className="text-center py-8">
          <p>Nie masz jeszcze żadnych list zakupów.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {lists.map(list => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
          <Pagination
            pagination={{
              page: currentPage,
              pageSize: 10,
              totalItems: totalPages * 10,
              totalPages,
            }}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </main>
  );
};
