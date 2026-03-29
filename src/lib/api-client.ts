import axios, { AxiosInstance, AxiosError } from "axios";
import { useAuthStore } from "@/hooks/useAuthStore";
import { ApiError } from "@/types";
import {
  isDemoMode,
  delay,
  MOCK_USERS,
  MOCK_PROJECTS,
  MOCK_PAYMENTS,
} from "./mock-data";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class ApiClient {
  private client: AxiosInstance;
  private isMockEnabled = isDemoMode();

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Intercepteur pour ajouter le token
    this.client.interceptors.request.use((config) => {
      const { token } = useAuthStore.getState();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Intercepteur pour gérer les erreurs
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // Ne plus utiliser de fallback mock data - toutes les requêtes doivent passer par les services Supabase
        if (error.response?.status === 401) {
          // Token expiré, nettoyer l'auth
          useAuthStore.getState().logout();
          window.location.href = "/auth";
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: any): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private isNetworkError(error: any): boolean {
    return (
      error?.code === "ERR_NETWORK" ||
      error?.code === "ECONNREFUSED" ||
      error?.message?.includes("ERR_CONNECTION_REFUSED")
    );
  }

  private async getMockData<T>(url: string, data?: any): Promise<T> {
    // Simulate network delay
    await delay(500);

    // Mock auth login
    if (url === "/auth/login") {
      const loginData = data as { email: string; password: string };
      const user = MOCK_USERS.find((u) => u.email === loginData.email);

      if (user) {
        return {
          user,
          token: "mock-token-" + Date.now(),
          refreshToken: "mock-refresh-" + Date.now(),
        } as T;
      }

      throw new Error("User not found in demo mode");
    }

    // Mock auth signup
    if (url === "/auth/signup") {
      const newUser = {
        id: "user-demo-" + Date.now(),
        email: data.email,
        name: data.name,
        role: "freelancer",
        createdAt: new Date().toISOString(),
      };

      return {
        user: newUser,
        token: "mock-token-" + Date.now(),
        refreshToken: "mock-refresh-" + Date.now(),
      } as T;
    }

    // Mock get current user
    if (url === "/auth/me") {
      return MOCK_USERS[0] as T;
    }

    // Mock get projects
    if (url.startsWith("/projects") && !url.includes("/")) {
      const params = new URLSearchParams(url.split("?")[1]);
      const page = parseInt(params.get("page") || "1");
      const limit = parseInt(params.get("limit") || "10");

      const start = (page - 1) * limit;
      const end = start + limit;

      return {
        data: MOCK_PROJECTS.slice(start, end),
        total: MOCK_PROJECTS.length,
        page,
        pageSize: limit,
      } as T;
    }

    // Mock get project by id
    if (url.startsWith("/projects/")) {
      const id = url.split("/").pop();
      const project = MOCK_PROJECTS.find((p) => p.id === id);
      return project as T;
    }

    // Mock create project
    if (url === "/projects" && data) {
      const newProject = {
        id: "proj-" + Date.now(),
        ...data,
        status: "active",
        createdAt: new Date().toISOString(),
        views: 0,
        downloads: 0,
        designerId: MOCK_USERS[0].id,
        designerName: MOCK_USERS[0].name,
      };

      return newProject as T;
    }

    // Mock payment initiation
    if (url === "/payments/initiate") {
      return {
        transactionId: "txn-" + Date.now(),
        status: "pending",
        redirectUrl: `https://fedapay.com/pay?id=${Date.now()}`,
      } as T;
    }

    // Mock payment status
    if (url.startsWith("/payments/") && url.includes("/status")) {
      const txnId = url.split("/")[2];
      const payment = MOCK_PAYMENTS.find((p) => p.transactionId === txnId);

      return (
        payment || {
          transactionId: txnId,
          status: "completed",
          amount: 25000,
          projectId: "proj-1",
        }
      ) as T;
    }

    // Fallback for unknown routes in demo mode
    console.warn(`[MOCK MODE] No mock data for ${url}, returning empty`);
    return {} as T;
  }

  private handleError(error: any): ApiError {
    if (error.response?.data) {
      return {
        message: error.response.data.message || "Une erreur est survenue",
        code: error.response.data.code || "UNKNOWN_ERROR",
        statusCode: error.response.status || 500,
      };
    }
    return {
      message: error.message || "Une erreur réseau est survenue",
      code: "NETWORK_ERROR",
      statusCode: 0,
    };
  }
}

export const apiClient = new ApiClient();
