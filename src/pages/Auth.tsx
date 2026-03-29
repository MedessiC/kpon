import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";
import { useLogin, useSignup } from "@/hooks/useAuth";
import { supabaseAuthService } from "@/lib/services/supabase-auth.service";
import { LoginSchema, SignupSchema, LoginFormData, SignupFormData } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [verifyEmailAddress, setVerifyEmailAddress] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    mode: "onChange",
  });

  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const onLogin = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      navigate("/dashboard");
    } catch (error: any) {
      // Error is handled by the hook
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onSignup = async (data: SignupFormData) => {
    try {
      await signupMutation.mutateAsync(data);
      // Show email verification screen instead of navigating
      setVerifyEmail(true);
      setVerifyEmailAddress(data.email);
      signupForm.reset();
    } catch (error: any) {
      // Error is handled by the hook
      toast({
        title: "Signup Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleResendEmail = async () => {
    if (!verifyEmailAddress) return;
    try {
      setResendLoading(true);
      await supabaseAuthService.resendConfirmationEmail(verifyEmailAddress);
      toast({
        title: "Email Sent",
        description: "Confirmation email has been resent to your inbox",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const isLoading = isLogin ? loginMutation.isPending : signupMutation.isPending;

  // Email Verification Screen
  if (verifyEmail) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b px-4 h-14 flex items-center">
          <button
            onClick={() => {
              setVerifyEmail(false);
              loginForm.reset();
              signupForm.reset();
            }}
            className="p-2 -ml-2 text-muted-foreground active:text-foreground transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </button>
        </header>

        <div className="flex-1 flex flex-col justify-center px-5 py-8">
          <div className="w-full max-w-sm mx-auto">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-foreground">
                  Check Your Email
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  We've sent a confirmation link to
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {verifyEmailAddress}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left space-y-2">
                <p className="text-sm font-medium text-blue-900">What to do next:</p>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Open your email inbox</li>
                  <li>Click the verification link</li>
                  <li>You'll be automatically logged in</li>
                </ol>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Didn't receive an email? Check your spam folder.</p>
              </div>

              <Button
                onClick={handleResendEmail}
                disabled={resendLoading}
                variant="outline"
                className="w-full h-12 mt-4"
              >
                {resendLoading ? "Resending..." : "Resend Confirmation Email"}
              </Button>

              <button
                onClick={() => {
                  setVerifyEmail(false);
                  setIsLogin(true);
                  loginForm.reset();
                  signupForm.reset();
                }}
                className="text-sm text-muted-foreground active:text-primary transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Mobile header with back */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b px-4 h-14 flex items-center">
        <button
          onClick={() => navigate("/")}
          className="p-2 -ml-2 text-muted-foreground active:text-foreground transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-5" />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center px-5 py-8">
        <div className="w-full max-w-sm mx-auto animate-fade-in">
          {/* Branding */}
          <div className="mb-8">
            <Logo className="text-3xl mb-3" />
            <h1 className="text-2xl font-extrabold text-foreground">
              {isLogin ? "Welcome Back 👋" : "Create Your Account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin
                ? "Sign in to manage your projects securely"
                : "Join designers who secure their deliveries"}
            </p>
          </div>

          {isLogin ? (
            <form
              onSubmit={loginForm.handleSubmit(onLogin)}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...loginForm.register("email")}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-red-500">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...loginForm.register("password")}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-red-500">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {loginMutation.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">
                    {loginMutation.error.message}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                variant="accent"
                className="w-full h-12 text-base font-semibold mt-2"
                disabled={isLoading || !loginForm.formState.isValid}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={signupForm.handleSubmit(onSignup)}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...signupForm.register("name")}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {signupForm.formState.errors.name && (
                  <p className="text-xs text-red-500">
                    {signupForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...signupForm.register("email")}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {signupForm.formState.errors.email && (
                  <p className="text-xs text-red-500">
                    {signupForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...signupForm.register("password")}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {signupForm.formState.errors.password && (
                  <p className="text-xs text-red-500">
                    {signupForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    {...signupForm.register("confirmPassword")}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {signupForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {signupForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {signupMutation.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">
                    {signupMutation.error.message}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                variant="accent"
                className="w-full h-12 text-base font-semibold mt-2"
                disabled={isLoading || !signupForm.formState.isValid}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground active:text-primary transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
