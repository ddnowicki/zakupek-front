import type {
  AuthResponse,
  CreateShoppingListRequest,
  GenerateShoppingListRequest,
  LoginRequest,
  RegisterRequest,
  ShoppingListDetailResponse,
  ShoppingListsResponse,
  UpdateShoppingListRequest,
  UserProfileResponse,
} from "../types";

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || "https://localhost:5133";

export interface ApiErrorPayload {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

export class HandledError extends Error {
  status: number;
  response: {
    status: number;
    data: ApiErrorPayload;
  };

  constructor(message: string, status: number, responseData: ApiErrorPayload) {
    super(message);
    this.name = "HandledError";
    this.status = status;
    this.response = {
      status: status,
      data: responseData,
    };
    Object.setPrototypeOf(this, HandledError.prototype);
  }
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = null;
  }

  private async fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);

    if (!headers.has("Content-Type") && options.method !== "GET") {
      headers.append("Content-Type", "application/json");
    }

    if (this.token) {
      headers.append("Authorization", `Bearer ${this.token}`);
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, requestOptions);

    if (response.status === 204) {
      return {} as T;
    }

    if (!response.ok) {
      let errorPayload: ApiErrorPayload;
      try {
        errorPayload = await response.json();
      } catch {
        errorPayload = {
          message: `Request failed with status ${response.status} and the response was not valid JSON.`,
        };
      }

      const primaryErrorMessage =
        errorPayload.detail || errorPayload.message || `HTTP Error: ${response.status} ${response.statusText}`;

      throw new HandledError(primaryErrorMessage, response.status, errorPayload);
    }

    return (await response.json()) as T;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.fetchWithAuth<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.fetchWithAuth<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<UserProfileResponse> {
    return this.fetchWithAuth<UserProfileResponse>("/api/users/profile");
  }

  async getShoppingLists(page = 1, pageSize = 10, sort = "newest"): Promise<ShoppingListsResponse> {
    return this.fetchWithAuth<ShoppingListsResponse>(
      `/api/shoppinglists?page=${page}&pageSize=${pageSize}&sort=${sort}`
    );
  }

  async getShoppingListById(id: number): Promise<ShoppingListDetailResponse> {
    return this.fetchWithAuth<ShoppingListDetailResponse>(`/api/shoppinglists/${id}`);
  }

  async createShoppingList(data: CreateShoppingListRequest): Promise<ShoppingListDetailResponse> {
    return this.fetchWithAuth<ShoppingListDetailResponse>("/api/shoppinglists", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateShoppingList(id: number, data: UpdateShoppingListRequest): Promise<boolean> {
    return this.fetchWithAuth<boolean>(`/api/shoppinglists/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteShoppingList(id: number): Promise<boolean> {
    return this.fetchWithAuth<boolean>(`/api/shoppinglists/${id}`, {
      method: "DELETE",
    });
  }

  async generateShoppingList(data: GenerateShoppingListRequest): Promise<ShoppingListDetailResponse> {
    return this.fetchWithAuth<ShoppingListDetailResponse>("/api/shoppinglists/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
