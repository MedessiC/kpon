/**
 * Supabase Auth Service
 * Handle authentication with Supabase
 * Triggers email confirmation for signup
 */

import { supabase, handleSupabaseError } from "@/lib/supabase";
import { AuthResponse, User } from "@/types";
import { LoginFormData, SignupFormData } from "@/lib/schemas";

export const supabaseAuthService = {
  /**
   * Signup with email and password
   * Sends email confirmation link to user
   */
  async signup(data: SignupFormData): Promise<AuthResponse> {
    try {
      // Create auth user in Supabase Auth
      // This will trigger email confirmation email if configured
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            full_name: data.name,
          },
          // Redirect URL for email confirmation link
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("User creation failed");
      }

      // Check if profile already exists (race condition or duplicate signup attempt)
      const { data: existingProfile } = await supabase
        .from("users")
        .select("id")
        .eq("email", data.email)
        .limit(1);

      // Create user profile if it doesn't exist
      if (!existingProfile || existingProfile.length === 0) {
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: authData.user.id,
            email: data.email,
            name: data.name,
            role: "freelancer", // Default role
          },
        ] as any);

        if (profileError) {
          // If duplicate email still occurs, it's OK - race condition handled
          if (profileError.code === "23505") {
            console.log("User profile already exists for this email");
          } else {
            console.warn("Profile creation warning:", profileError);
          }
          // Don't throw - auth user was created successfully
        }
      }

      return {
        user: {
          id: authData.user.id,
          email: data.email,
          name: data.name,
          role: "freelancer",
          createdAt: authData.user.created_at || new Date().toISOString(),
        },
        token: authData.session?.access_token || "",
        refreshToken: authData.session?.refresh_token || "",
      };
    } catch (error: any) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Login with email and password
   * User must have confirmed email first
   */
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      // Authenticate with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

      if (authError) throw authError;

      if (!authData.user || !authData.session) {
        throw new Error("Login failed");
      }

      // Check if email is confirmed
      if (!authData.user.email_confirmed_at) {
        throw new Error(
          "Please confirm your email before logging in. Check your inbox for confirmation link."
        );
      }

      // Get user profile from users table (avoid .single() due to 406 errors)
      const { data: userProfiles, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .limit(1);

      if (profileError) throw profileError;

      const userProfile = userProfiles?.[0];
      if (!userProfile) {
        throw new Error("User profile not found");
      }

      return {
        user: {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role,
          createdAt: userProfile.created_at,
        },
        token: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
      };
    } catch (error: any) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(handleSupabaseError(error));
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        throw new Error("Not authenticated");
      }

      // Get user profile from users table (avoid .single() due to 406 errors)
      const { data: userProfiles, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .limit(1);

      if (profileError) throw profileError;

      const userProfile = userProfiles?.[0];
      if (!userProfile) {
        throw new Error("User profile not found");
      }

      return {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        createdAt: userProfile.created_at,
      };
    } catch (error: any) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("users")
        .update({
          ...(data.name && { name: data.name }),
          ...(data.role && { role: data.role }),
        })
        .eq("id", authUser.id);

      if (error) throw error;

      return this.getCurrentUser();
    } catch (error: any) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Change password
   */
  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      // Verify old password by trying to sign in
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    } catch (error: any) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Resend confirmation email
   */
  async resendConfirmationEmail(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Refresh token
   */
  async refreshToken(): Promise<string> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession();

      if (error || !session) throw new Error("Failed to refresh token");

      return session.access_token;
    } catch (error: any) {
      throw new Error(handleSupabaseError(error));
    }
  },
};
