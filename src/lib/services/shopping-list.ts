import { ApiClient } from "../api";
import type {
  CreateShoppingListRequest,
  GenerateShoppingListRequest,
  ShoppingListDetailResponse,
  ShoppingListsResponse,
  UpdateShoppingListRequest,
} from "@/types.ts";

export class ShoppingListService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getShoppingLists(page = 1, pageSize = 10, sort = "newest"): Promise<ShoppingListsResponse> {
    return this.apiClient.getShoppingLists(page, pageSize, sort);
  }

  async getShoppingListById(id: number): Promise<ShoppingListDetailResponse> {
    return this.apiClient.getShoppingListById(id);
  }

  async createShoppingList(data: CreateShoppingListRequest): Promise<ShoppingListDetailResponse> {
    return this.apiClient.createShoppingList(data);
  }

  async updateShoppingList(id: number, data: UpdateShoppingListRequest): Promise<boolean> {
    return this.apiClient.updateShoppingList(id, data);
  }

  async deleteShoppingList(id: number): Promise<boolean> {
    return this.apiClient.deleteShoppingList(id);
  }

  async generateShoppingList(data: GenerateShoppingListRequest): Promise<ShoppingListDetailResponse> {
    return this.apiClient.generateShoppingList(data);
  }
}
