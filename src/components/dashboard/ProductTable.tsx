import React, { useState } from "react";
import type { ProductInListResponse, UpdateProductRequest } from "@/types";
import StatusBadge from "./StatusBadge";
import InlineEdit from "./InlineEdit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductTableProps {
  products: ProductInListResponse[];
  onUpdateProduct: (updatedProduct: UpdateProductRequest) => void;
  onDeleteProduct: (productId: number) => void;
  onAddNewProduct: (productData: { name: string; quantity: number }) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onUpdateProduct, onDeleteProduct, onAddNewProduct }) => {
  const [newProductInput, setNewProductInput] = useState({ name: "", quantity: "1" });

  if (!products) {
    return <p>Brak produktów na liście.</p>;
  }

  const handleNameChange = (productId: number, newName: string | number) => {
    if (typeof newName === 'string') {
      const product = products.find(p => p.id === productId);
      if (product) {
        onUpdateProduct({ id: productId, name: newName, quantity: product.quantity });
      }
    }
  };

  const handleQuantityChange = (productId: number, newQuantity: string | number) => {
    const quantity = Number(newQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      const product = products.find(p => p.id === productId);
      if (product) {
        onUpdateProduct({ id: productId, name: product.name, quantity: quantity });
      }
    } else {
      console.warn("Invalid quantity, must be a number greater than 0.");
    }
  };

  const handleNewProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProductInput(prev => ({ ...prev, name: e.target.value }));
  };

  const handleNewProductQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProductInput(prev => ({ ...prev, quantity: e.target.value }));
  };

  const commitNewProduct = () => {
    const name = newProductInput.name.trim();
    const quantity = parseInt(newProductInput.quantity, 10);
    if (name && !isNaN(quantity) && quantity > 0) {
      onAddNewProduct({ name, quantity });
      setNewProductInput({ name: "", quantity: "1" });
    }
  };

  const handleNewProductInputEvent = (event: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    if (event.type === 'blur' || (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Enter')) {
      if (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Enter') {
        event.preventDefault();
      }
      const nameIsFilled = newProductInput.name.trim() !== "";
      if (nameIsFilled) {
        commitNewProduct();
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nazwa produktu
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ilość
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Akcje
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <InlineEdit
                  value={product.name}
                  onChange={(newName) => handleNameChange(product.id, newName)}
                  validationRules={{ minLength: 1 }}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <InlineEdit
                  value={product.quantity}
                  onChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
                  inputType="number"
                  validationRules={{ min: 1 }}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={product.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Button variant="link" size="sm" onClick={() => onDeleteProduct(product.id)} className="text-red-600 hover:text-red-800">
                  Usuń
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              <Input
                type="text"
                placeholder="Dodaj produkt..."
                value={newProductInput.name}
                onChange={handleNewProductNameChange}
                onBlur={handleNewProductInputEvent}
                onKeyDown={handleNewProductInputEvent}
                className="text-sm"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Input
                type="number"
                value={newProductInput.quantity}
                onChange={handleNewProductQuantityChange}
                onBlur={handleNewProductInputEvent}
                onKeyDown={handleNewProductInputEvent}
                min="1"
                className="text-sm w-20"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap"></td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Button variant="outline" size="sm" onClick={commitNewProduct} disabled={!newProductInput.name.trim() || !(parseInt(newProductInput.quantity, 10) > 0)}>
                Dodaj
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
