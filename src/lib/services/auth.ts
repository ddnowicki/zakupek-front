import { ApiClient } from "../api";
import type { AuthResponse, LoginRequest, RegisterRequest, UserProfileResponse } from "@/types.ts";

export class AuthService {
  private apiClient: ApiClient;
  private tokenKey = "token";
  private userKey = "user_id";
  private expiresKey = "token_expires";

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
    this.loadAuthFromStorage();
  }

  private loadAuthFromStorage(): void {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem(this.tokenKey);
    const expiresAt = localStorage.getItem(this.expiresKey);

    if (token && expiresAt) {
      const expirationDate = new Date(expiresAt);
      if (expirationDate > new Date()) {
        this.apiClient.setToken(token);
      } else {
        this.logout();
      }
    }
  }

  private saveAuthToStorage(authResponse: AuthResponse): void {
    if (typeof window === "undefined") return;

    localStorage.setItem(this.tokenKey, authResponse.accessToken);
    localStorage.setItem(this.expiresKey, authResponse.expiresAt);
    localStorage.setItem(
      this.userKey,
      JSON.stringify({
        userId: authResponse.userId,
        userName: authResponse.userName,
      })
    );
  }

  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.apiClient.register(registerData);

    if (response.accessToken) {
      this.apiClient.setToken(response.accessToken);
      this.saveAuthToStorage(response);
    }

    return response;
  }

  async login(loginData: LoginRequest): Promise<AuthResponse> {
    const response = await this.apiClient.login(loginData);

    if (response.accessToken) {
      this.apiClient.setToken(response.accessToken);
      this.saveAuthToStorage(response);
    }

    return response;
  }

  logout(): void {
    this.apiClient.clearToken();

    if (typeof window === "undefined") return;

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.expiresKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem(this.tokenKey);
    const expiresAt = localStorage.getItem(this.expiresKey);

    if (!token || !expiresAt) return false;

    return new Date(expiresAt) > new Date();
  }

  async getUserProfile(): Promise<UserProfileResponse | null> {
    if (!this.isAuthenticated()) return null;

    try {
      return await this.apiClient.getProfile();
    } catch (error) {
      console.error("Failed to get user profile:", error);
      return null;
    }
  }

  getUserInfo(): { userId: number; userName: string } | null {
    if (typeof window === "undefined") return null;

    const userData = localStorage.getItem(this.userKey);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
}
