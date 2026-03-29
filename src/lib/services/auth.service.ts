import { apiClient } from "@/lib/api-client";
import { AuthResponse, User } from "@/types";
import { LoginFormData, SignupFormData } from "@/lib/schemas";

export const authService = {
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    return apiClient.post("/auth/login", credentials);
  },

  async signup(data: SignupFormData): Promise<AuthResponse> {
    const { confirmPassword, ...payload } = data;
    return apiClient.post("/auth/signup", payload);
  },

  async logout(): Promise<void> {
    return apiClient.post("/auth/logout");
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get("/auth/me");
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post("/auth/refresh", { refreshToken });
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiClient.put("/auth/profile", data);
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return apiClient.post("/auth/change-password", { oldPassword, newPassword });
  },
};
