import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import * as Sentry from "@sentry/react";
import { initSentry } from "@/lib/sentry";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import ClientPreview from "./pages/ClientPreview";
import Marketplace from "./pages/Marketplace";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";

// Initialize Sentry for error tracking
initSentry();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/projects/new" element={<NewProject />} />
    <Route path="/marketplace" element={<Marketplace />} />
    <Route path="/project/:id" element={<ProjectDetail />} />
    <Route path="/p/:projectId" element={<ClientPreview />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const SentryRoutes = Sentry.withSentryRouting(AppRoutes);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SentryRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default Sentry.withProfiler(App);
