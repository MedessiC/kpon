import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useAuthStore } from "./useAuthStore";
import { supabaseAuthService } from "@/lib/services";
import { User, AuthResponse } from "@/types";
import { LoginFormData, SignupFormData } from "@/lib/schemas";
import { handleError } from "@/lib/error-handler";

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);

  return useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      setLoading(true);
      try {
        const response = await supabaseAuthService.login(credentials);
        setUser(response.user);
        setTokens(response.token, response.refreshToken);
        setError(null);
        return response;
      } catch (error) {
        handleError(error, "login");
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });
}

export function useSignup() {
  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);

  return useMutation({
    mutationFn: async (data: SignupFormData) => {
      setLoading(true);
      try {
        const response = await supabaseAuthService.signup(data);
        setUser(response.user);
        setTokens(response.token, response.refreshToken);
        setError(null);
        return response;
      } catch (error) {
        handleError(error, "signup");
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await supabaseAuthService.logout();
      } catch (error) {
        handleError(error, "logout");
      }
    },
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
}

export function useCurrentUser() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<User>({
    queryKey: ["user", "current"],
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error("Not authenticated");
      }
      return supabaseAuthService.getCurrentUser();
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: user ?? undefined,
  });
}
