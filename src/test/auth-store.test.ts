import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/hooks/useAuthStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().reset();
  });

  it("should initialize with default state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should set user and authenticate", () => {
    const mockUser = {
      id: "123",
      email: "test@example.com",
      name: "John Doe",
      createdAt: "2024-01-01",
      role: "freelancer" as const,
    };

    useAuthStore.getState().setUser(mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("should set tokens", () => {
    useAuthStore.getState().setTokens("access-token", "refresh-token");

    const state = useAuthStore.getState();
    expect(state.token).toBe("access-token");
    expect(state.refreshToken).toBe("refresh-token");
  });

  it("should set error", () => {
    useAuthStore.getState().setError("Auth failed");

    const state = useAuthStore.getState();
    expect(state.error).toBe("Auth failed");
  });

  it("should set loading state", () => {
    useAuthStore.getState().setLoading(true);

    const state = useAuthStore.getState();
    expect(state.isLoading).toBe(true);

    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it("should logout and reset user state", () => {
    const mockUser = {
      id: "123",
      email: "test@example.com",
      name: "John Doe",
      createdAt: "2024-01-01",
      role: "freelancer" as const,
    };

    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setTokens("access-token", "refresh-token");
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should persist state to localStorage", () => {
    const mockUser = {
      id: "123",
      email: "test@example.com",
      name: "John Doe",
      createdAt: "2024-01-01",
      role: "freelancer" as const,
    };

    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setTokens("access-token", "refresh-token");

    // Check localStorage
    const stored = localStorage.getItem("auth-store");
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored || "{}");
    expect(parsed.state.user).toEqual(mockUser);
    expect(parsed.state.token).toBe("access-token");
  });
});
