import React, { useState, useEffect, useMemo } from "react";
import { useListDetails } from "@/components/hooks/useListDetails";
import ProductTable from "./ProductTable";
import type { UpdateProductRequest, ShoppingListDetailResponse, ProductInListResponse, UpdateShoppingListRequest } from "@/types";
import { ProductStatus } from "@/types";
import InlineEdit from "./InlineEdit";
import SaveButton from "./SaveButton";
import DeleteListButton from "./DeleteListButton";
import { ApiClient, HandledError } from "@/lib/api";
import { ShoppingListService } from "@/lib/services/shopping-list";
import { useNavigate } from "@/lib/hooks/useNavigate";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ListDetailsPageProps {
  listId: number;
}

const ListDetailsPage: React.FC<ListDetailsPageProps> = ({ listId }) => {
  const { listData: initialListData, isLoading: isLoadingInitialData, error: initialError, refetch } = useListDetails(listId);
  const [listData, setListData] = useState<ShoppingListDetailResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveError, setSaveError] = useState<HandledError | null>(null);
  const [deleteError, setDeleteError] = useState<HandledError | null>(null);
  const navigate = useNavigate();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const apiClient = useMemo(() => {
    const client = new ApiClient(import.meta.env.PUBLIC_API_BASE_URL);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      client.setToken(token);
    }
    return client;
  }, []);

  const shoppingListService = useMemo(() => new ShoppingListService(apiClient), [apiClient]);

  // Helper function to compare optional string fields
  const areStringsEqual = (str1?: string, str2?: string) => {
    return (!str1 && !str2) || str1 === str2;
  };

  // Helper function to compare optional date fields
  const areDatesEqual = (date1?: string, date2?: string) => {
    if (!date1 && !date2) return true;
    if (!date1 || !date2) return false;

    const d1 = date1 ? new Date(date1).toISOString().split('T')[0] : "";
    const d2 = date2 ? new Date(date2).toISOString().split('T')[0] : "";
    return d1 === d2;
  };

  // Helper function to deeply compare products
  const areProductsEqual = (
    product1: ProductInListResponse,
    product2: ProductInListResponse
  ): boolean => {
    return (
      product1.id === product2.id &&
      product1.name === product2.name &&
      product1.quantity === product2.quantity
    );
  };

  // Helper function to compare product arrays
  const areProductArraysEqual = (
    products1: ProductInListResponse[],
    products2: ProductInListResponse[]
  ): boolean => {
    if (products1.length !== products2.length) return false;
    
    // For existing products (positive IDs), check if all properties match
    const existingProducts1 = products1.filter(p => p.id > 0);
    const existingProducts2 = products2.filter(p => p.id > 0);

    if (existingProducts1.length !== existingProducts2.length) return false;

    for (const product1 of existingProducts1) {
      const product2 = existingProducts2.find(p => p.id === product1.id);
      if (!product2 || !areProductsEqual(product1, product2)) {
        return false;
      }
    }

    // Check for new products (negative IDs)
    const newProducts1 = products1.filter(p => p.id < 0);
    const newProducts2 = products2.filter(p => p.id < 0);

    return newProducts1.length === newProducts2.length;
  };

  useEffect(() => {
    if (initialListData) {
      setListData(JSON.parse(JSON.stringify(initialListData)));
    }
  }, [initialListData]);

  useEffect(() => {
    // If either list is null, no changes
    if (!initialListData || !listData) {
      setHasUnsavedChanges(false);
      return;
    }

    // Compare all relevant fields
    const hasChanges = 
      !areStringsEqual(initialListData.title, listData.title) ||
      !areStringsEqual(initialListData.storeName, listData.storeName) ||
      !areDatesEqual(initialListData.plannedShoppingDate, listData.plannedShoppingDate) ||
      !areProductArraysEqual(initialListData.products, listData.products);

    setHasUnsavedChanges(hasChanges);
  }, [initialListData, listData]);

  const handleTitleChange = (newTitle: string | number) => {
    if (typeof newTitle === 'string') {
      setListData(prev => prev ? { ...prev, title: newTitle } : null);
    }
  };

  const handleStoreNameChange = (newStoreName: string | number) => {
    if (typeof newStoreName === 'string') {
      setListData(prev => prev ? { ...prev, storeName: newStoreName } : null);
    }
  };

  const handleDateChange = (newDate: string | number) => {
    if (typeof newDate === 'string') {
      setListData(prev => prev ? { ...prev, plannedShoppingDate: newDate } : null);
    }
  };

  const handleUpdateProduct = (updatedProduct: UpdateProductRequest) => {
    setListData(prev => {
      if (!prev) return null;
      const updatedProducts = prev.products.map(p =>
        p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
      );
      return { ...prev, products: updatedProducts as ProductInListResponse[] };
    });
  };

  const handleDeleteProduct = (productId: number) => {
    setListData(prev => {
      if (!prev) return null;
      const updatedProducts = prev.products.filter(p => p.id !== productId);
      return { ...prev, products: updatedProducts };
    });
  };

  const handleAddNewProduct = (productData: { name: string; quantity: number }) => {
    setListData(prev => {
      if (!prev) return null;
      const newProduct: ProductInListResponse = {
        id: -(Date.now() + Math.random()),
        name: productData.name,
        quantity: productData.quantity,
        statusId: ProductStatus.Pending,
        status: "Manual",
        createdAt: new Date().toISOString(),
      };
      return { ...prev, products: [...prev.products, newProduct] };
    });
  };

  const handleSaveList = async () => {
    if (!listData) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const updateRequest: UpdateShoppingListRequest = {
        title: listData.title,
        storeName: listData.storeName,
        plannedShoppingDate: listData.plannedShoppingDate,
        products: listData.products.map(p => ({
          id: p.id > 0 ? p.id : undefined,
          name: p.name,
          quantity: p.quantity,
        })),
      };
      await shoppingListService.updateShoppingList(listId, updateRequest);
      toast.success("Lista została zaktualizowana.");
      refetch();
    } catch (err) {
      const error = err instanceof HandledError ? err : new HandledError("Failed to save list", 0, {});
      setSaveError(error);
      toast.error(`Błąd zapisu: ${error.message}`);
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteList = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await shoppingListService.deleteShoppingList(listId);
      toast.success("Lista została usunięta.");
      navigate("/lists");
    } catch (err) {
      const error = err instanceof HandledError ? err : new HandledError("Failed to delete list", 0, {});
      setDeleteError(error);
      toast.error(`Błąd usuwania: ${error.message}`);
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGoBack = () => {
    if (hasUnsavedChanges) {
      setShowConfirmDialog(true);
    } else {
      navigate("/lists");
    }
  };

  const proceedWithNavigation = () => {
    setShowConfirmDialog(false);
    navigate("/lists");
  };

  const cancelNavigation = () => {
    setShowConfirmDialog(false);
  };

  if (isLoadingInitialData) {
    return <p>Ładowanie szczegółów listy...</p>;
  }

  if (initialError) {
    return <p>Wystąpił błąd: {initialError.message}</p>;
  }

  if (!listData) {
    return <p>Nie znaleziono danych listy.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          <InlineEdit
            value={listData?.title || ""}
            onChange={handleTitleChange}
          />
        </h1>
        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); handleGoBack(); }}
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Powrót do list
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa sklepu</label>
          <InlineEdit
            value={listData.storeName || ""}
            onChange={handleStoreNameChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data planowanych zakupów</label>
          <InlineEdit
            value={listData.plannedShoppingDate ? new Date(listData.plannedShoppingDate).toISOString().split('T')[0] : ""}
            onChange={handleDateChange}
            inputType="date"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Utworzono</label>
          <p>{new Date(listData.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {saveError && <p className="text-red-500">Błąd zapisu: {saveError.message}</p>}
      {deleteError && <p className="text-red-500">Błąd usuwania: {deleteError.message}</p>}

      <ProductTable
        products={listData.products}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddNewProduct={handleAddNewProduct}
      />

      <div className="flex justify-end space-x-4 mt-6">
        <SaveButton onSave={handleSaveList} isLoading={isSaving} />
        <DeleteListButton onDelete={handleDeleteList} isLoading={isDeleting} />
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Niezapisane zmiany</AlertDialogTitle>
            <AlertDialogDescription>
              Masz niezapisane zmiany. Czy na pewno chcesz opuścić stronę bez zapisywania?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelNavigation}>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={proceedWithNavigation}>Opuść stronę</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListDetailsPage;
