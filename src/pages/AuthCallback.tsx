/**
 * AuthCallback Page
 * Handles email confirmation link redirection
 * Called when user clicks confirmation link in email
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Loader2 } from "lucide-react";
import Logo from "@/components/Logo";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setTokens } = useAuthStore();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus("processing");

        // Supabase automatically exchanges the code from the URL for a session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session || !session.user) {
          // Sometimes the session takes a moment to update
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const {
            data: { session: retrySession },
            error: retryError,
          } = await supabase.auth.getSession();

          if (retryError || !retrySession) {
            throw new Error("No session found. Please try signing up again.");
          }

          const finalSession = retrySession;
          await processSession(finalSession);
        } else {
          await processSession(session);
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        setError(error.message || "Failed to confirm email");
        setStatus("error");
      }
    };

    const processSession = async (session: any) => {
      try {
        // Verify email was confirmed
        if (!session.user?.email_confirmed_at) {
          throw new Error("Email confirmation pending. Please check your email.");
        }

        // Get user profile from database
        const { data: userProfiles, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .limit(1);

        if (profileError) throw profileError;

        const userProfile = userProfiles?.[0];
        if (!userProfile) {
          throw new Error("User profile not found");
        }

        // Update auth store
        setUser({
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role,
          createdAt: userProfile.created_at,
        });
        setTokens(session.access_token, session.refresh_token || "");

        setStatus("success");

        // Redirect to dashboard after 1 second
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1000);
      } catch (error: any) {
        throw error;
      }
    };

    handleCallback();
  }, [navigate, setUser, setTokens]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {status === "processing" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Confirming Your Email
            </h1>
            <p className="text-center text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Email Confirmed!</h1>
            <p className="text-center text-gray-600">
              Your email has been verified successfully. Redirecting to dashboard...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Confirmation Failed</h1>
            <p className="text-center text-red-600 text-sm">{error}</p>
            <div className="flex gap-3 w-full mt-6">
              <button
                onClick={() => navigate("/auth?tab=signup", { replace: true })}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
              >
                Sign Up Again
              </button>
              <button
                onClick={() => navigate("/auth?tab=login", { replace: true })}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

