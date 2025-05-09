import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

import { AuthProvider } from "@/contexts/auth-context";
import { TodoProvider } from "@/contexts/todo-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import HomePage from "@/pages/HomePage";
import ProjectPage from "@/pages/ProjectPage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// 🔁 Fix: Keyed Wrapper for ProjectPage to ensure rerender on route param change
const ProjectPageWrapper = () => {
  const { projectId } = useParams();
  return <ProjectPage key={projectId} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TodoProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/project/:projectId" 
                element={
                  <ProtectedRoute>
                    <ProjectPageWrapper />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TodoProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
