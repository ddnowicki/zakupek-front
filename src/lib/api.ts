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
}

export class HandledError extends Error {
  constructor(
    message: string,
    public status: number,
    public payload: ApiErrorPayload,
  ) {
    super(message);
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
    const currentMethod = options.method ? options.method.toUpperCase() : "GET";

    const headers = new Headers({
      "Accept": "application/json",
      ...(!["GET", "DELETE"].includes(currentMethod) ? { "Content-Type": "application/json" } : {}),
      ...(this.token ? { "Authorization": `Bearer ${this.token}` } : {}),
      ...(options.headers || {}),
    });

    const requestOptions: RequestInit = {
      ...options,
      headers,
    };

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${endpoint}`, requestOptions);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error occurred";
      throw new HandledError(errorMessage, 0, { message: errorMessage });
    }

    if (response.status === 204) {
      return {} as T;
    }

    let responseData: unknown;
    const contentType = response.headers.get("content-type");
    try {
      if (contentType?.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
    } catch {
      throw new HandledError("Failed to parse response data", response.status, { message: "Invalid response format" });
    }

    if (response.ok) {
      return responseData as T;
    }

    let errorPayload: ApiErrorPayload = {
      message: "An unknown error occurred",
      detail: typeof responseData === "string" ? responseData : undefined,
    };

    if (typeof responseData === "object" && responseData !== null) {
      errorPayload = {
        ...errorPayload,
        ...responseData,
      };
    }

    const primaryErrorMessage =
      errorPayload.detail ||
      errorPayload.message ||
      (typeof responseData === "string" ? responseData : `HTTP Error: ${response.status} ${response.statusText}`);

    throw new HandledError(primaryErrorMessage, response.status, errorPayload);
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
      `/api/shoppinglists?page=${page}&pageSize=${pageSize}&sort=${sort}`,
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
