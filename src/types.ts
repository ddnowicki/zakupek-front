export interface RegisterRequest {
  email: string;
  password: string;
  userName: string;
  householdSize?: number;
  ages?: number[];
  dietaryPreferences?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  userName: string;
  accessToken: string;
  expiresAt: string;
}

export interface UserProfileResponse {
  id: number;
  email: string;
  userName: string;
  householdSize?: number;
  ages?: number[];
  dietaryPreferences?: string[];
  createdAt: string;
  listsCount: number;
}

export interface GetShoppingListsRequest {
  page: number;
  pageSize: number;
  sort: string;
}

export interface GetShoppingListByIdRequest {
  id: number;
}

export interface ProductRequest {
  name: string;
  quantity: number;
}

export interface CreateShoppingListRequest {
  title?: string;
  products?: ProductRequest[];
  plannedShoppingDate?: string;
  storeName?: string;
}

export interface UpdateProductRequest {
  id?: number;
  name: string;
  quantity: number;
}

export interface UpdateShoppingListRequest {
  title?: string;
  products?: UpdateProductRequest[];
  plannedShoppingDate?: string;
  storeName?: string;
}

export interface DeleteShoppingListRequest {
  id: number;
}

export interface GenerateShoppingListRequest {
  title?: string;
  plannedShoppingDate?: string;
  storeName?: string;
}

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ShoppingListResponse {
  id: number;
  title?: string;
  productsCount: number;
  plannedShoppingDate?: string;
  createdAt: string;
  source: string;
  storeName?: string;
}

export interface ShoppingListsResponse {
  data: ShoppingListResponse[];
  pagination: PaginationMetadata;
}

export interface ProductInListResponse {
  id: number;
  name: string;
  quantity: number;
  statusId: number;
  status: string;
  createdAt: string;
}

export interface ShoppingListDetailResponse {
  id: number;
  title?: string;
  storeName?: string;
  plannedShoppingDate?: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  shopName?: string;
  products: ProductInListResponse[];
}

export enum ProductStatus {
  Pending = 1,
  InCart = 2,
  Purchased = 3,
}
