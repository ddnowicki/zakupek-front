import { useState, useEffect, useMemo } from "react";
import type { ShoppingListsResponse, ShoppingListResponse } from "../../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ListCard } from "./ListCard";
import { Pagination } from "./Pagination";
import { CreateListButton } from "./CreateListButton";
import { GenerateListButton } from "./GenerateListButton";
import { ApiClient } from "../../lib/api";
import { ShoppingListService } from "../../lib/services/shopping-list";
import { AuthService } from "../../lib/services/auth";
import { useNavigate } from "../../lib/hooks/useNavigate";
import { ITEMS_PER_PAGE_DESKTOP, ITEMS_PER_PAGE_MOBILE } from "../../lib/constants";

const DESKTOP_BREAKPOINT = 768;

export const DashboardPage = () => {
  const [lists, setLists] = useState<ShoppingListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState<string>("newest");
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_DESKTOP);
  const [isMobileView, setIsMobileView] = useState(false);

  const apiClient = useMemo(() => new ApiClient(), []);
  const authService = useMemo(() => new AuthService(apiClient), [apiClient]);
  const shoppingListService = useMemo(() => new ShoppingListService(apiClient), [apiClient]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < DESKTOP_BREAKPOINT;
      setIsMobileView(mobile);
      setItemsPerPage(mobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiClient.setToken(token);
    }
  }, [apiClient]);

  useEffect(() => {
    const fetchLists = async () => {
      if (!authService.isAuthenticated()) {
        navigate(`/login?redirectUrl=${window.location.pathname}`);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await shoppingListService.getShoppingLists(currentPage, itemsPerPage, sort);
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
  }, [currentPage, sort, itemsPerPage, shoppingListService, authService, navigate, apiClient]);

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  const handleListCreatedOrGenerated = () => {
    setCurrentPage(1);
    setSort("newest");
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const sortSelect = (
    <Select value={sort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-full md:w-[180px]">
        <SelectValue placeholder="Sortowanie" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Najnowsze</SelectItem>
        <SelectItem value="oldest">Najstarsze</SelectItem>
        <SelectItem value="name">Nazwa</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      {isMobileView ? (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Listy</h1>
            <div className="flex gap-2">
              <CreateListButton onListCreated={handleListCreatedOrGenerated} />
              <GenerateListButton onListGenerated={handleListCreatedOrGenerated} />
            </div>
          </div>
          <div className="flex justify-end">{sortSelect}</div>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Listy zakupów</h1>
          <div className="flex gap-4 items-center">
            {sortSelect}
            <CreateListButton onListCreated={handleListCreatedOrGenerated} />
            <GenerateListButton onListGenerated={handleListCreatedOrGenerated} />
          </div>
        </div>
      )}

      {lists.length === 0 ? (
        <div className="text-center py-8">
          <p>Nie masz jeszcze żadnych list zakupów.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
            {lists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
          <Pagination
            pagination={{
              page: currentPage,
              pageSize: itemsPerPage,
              totalItems: totalPages * itemsPerPage,
              totalPages,
            }}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </main>
  );
};
