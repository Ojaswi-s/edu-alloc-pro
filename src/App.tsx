import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/AppShell";
import Dashboard from "./pages/Dashboard.tsx";
import SchoolDashboard from "./pages/SchoolDashboard.tsx";
import TeacherDashboard from "./pages/TeacherDashboard.tsx";
import Deploy from "./pages/Deploy.tsx";
import Plan from "./pages/Plan.tsx";
import Briefing from "./pages/Briefing.tsx";
import Schools from "./pages/Schools.tsx";
import Teachers from "./pages/Teachers.tsx";
import FieldVerification from "./pages/FieldVerification.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.tsx";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return <AppShell>{children}</AppShell>;
};

const RoleBasedHome = () => {
  const { user } = useAuth();
  if (user?.role === 'school') return <SchoolDashboard />;
  if (user?.role === 'teacher') return <TeacherDashboard />;
  return <Dashboard />; // Default to collector dashboard
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<ProtectedRoute><RoleBasedHome /></ProtectedRoute>} />
            <Route path="/deploy" element={<ProtectedRoute><Deploy /></ProtectedRoute>} />
            <Route path="/plan" element={<ProtectedRoute><Plan /></ProtectedRoute>} />
            <Route path="/briefing" element={<ProtectedRoute><Briefing /></ProtectedRoute>} />
            <Route path="/schools" element={<ProtectedRoute><Schools /></ProtectedRoute>} />
            <Route path="/teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
            <Route path="/verify" element={<ProtectedRoute><FieldVerification /></ProtectedRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
