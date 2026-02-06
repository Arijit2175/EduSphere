import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Alert, Snackbar, Box, CircularProgress } from "@mui/material";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { CoursesProvider } from "./contexts/CoursesContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { FormalEducationProvider } from "./contexts/FormalEducationContext";
import { NonFormalProvider } from "./contexts/NonFormalContext";
import theme from "./theme";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import FormalLearning from "./pages/FormalLearning";
import NonFormalLearning from "./pages/NonFormalLearning";
const NonFormalHome = lazy(() => import("./pages/NonFormalHome"));
import NonFormalCourseDetail from "./pages/NonFormalCourseDetail";
import NonFormalLearner from "./pages/NonFormalLearner";
import InformalLearning from "./pages/InformalLearning";
import AITutor from "./pages/AITutor";
import CodeHub from "./pages/CodeHub";
import CourseDetailPage from "./pages/CourseDetailPage";
import QuizPage from "./pages/QuizPage";
import Profile from "./pages/Profile";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import DataProtection from "./pages/DataProtection";
import TermsOfService from "./pages/TermsOfService";
import CookieSettings from "./pages/CookieSettings";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";

const SessionExpiredToast = () => {
  const { sessionExpired, clearSessionExpired } = useAuth();

  useEffect(() => {
    if (!sessionExpired) return;
    const timer = setTimeout(() => {
      clearSessionExpired();
      window.location.href = "/login";
    }, 2000);
    return () => clearTimeout(timer);
  }, [sessionExpired, clearSessionExpired]);

  return (
    <Snackbar
      open={sessionExpired}
      onClose={clearSessionExpired}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={2000}
    >
      <Alert onClose={clearSessionExpired} severity="warning" variant="filled">
        Session has expired. Please log in again.
      </Alert>
    </Snackbar>
  );
};

const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [, forceUpdate] = useState(0);

  // Listen to popstate AND watch for URL changes that React Router misses
  useEffect(() => {
    let rafId = null;
    let lastUrl = window.location.pathname + window.location.search + window.location.hash;

    const syncRouter = () => {
      const currentUrl = window.location.pathname + window.location.search + window.location.hash;
      const routerUrl = location.pathname + location.search + location.hash;
      
      if (currentUrl !== routerUrl) {
        navigate(currentUrl, { replace: true });
        forceUpdate(n => n + 1);
      }
      lastUrl = currentUrl;
    };

    // Check periodically for URL mismatches (handles edge cases)
    const checkUrl = () => {
      const newUrl = window.location.pathname + window.location.search + window.location.hash;
      if (newUrl !== lastUrl) {
        syncRouter();
      }
      rafId = requestAnimationFrame(checkUrl);
    };

    // Also listen to popstate for back/forward buttons
    const handlePopState = () => syncRouter();
    window.addEventListener("popstate", handlePopState);
    
    rafId = requestAnimationFrame(checkUrl);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [location.pathname, location.search, location.hash, navigate]);

  return (
    <CoursesProvider>
      <FormalEducationProvider>
        <NonFormalProvider>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/formal"
                element={
                  <ProtectedRoute>
                    <FormalLearning />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/nonformal"
                element={
                  <ProtectedRoute>
                    <Suspense
                      fallback={
                        <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <CircularProgress />
                        </Box>
                      }
                    >
                      <NonFormalHome />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/nonformal/course/:courseId"
                element={
                  <ProtectedRoute>
                    <NonFormalCourseDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/nonformal/learn/:courseId"
                element={
                  <ProtectedRoute>
                    <NonFormalLearner />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/informal"
                element={
                  <ProtectedRoute>
                    <InformalLearning />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ai"
                element={
                  <ProtectedRoute>
                    <AITutor />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/codehub"
                element={
                  <ProtectedRoute>
                    <CodeHub />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/course/:courseId"
                element={
                  <ProtectedRoute>
                    <CourseDetailPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/course/:courseId/quiz/:quizId"
                element={
                  <ProtectedRoute>
                    <QuizPage />
                  </ProtectedRoute>
                }
              />

                {/* Footer Pages - Public Access */}
                <Route path="/about" element={<AboutUs />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/data-protection" element={<DataProtection />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/cookie-settings" element={<CookieSettings />} />
                <Route path="/contact" element={<ContactUs />} />

                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarProvider>
          </NonFormalProvider>
        </FormalEducationProvider>
      </CoursesProvider>
  );
};

export default function App() {
  // Global fetch interceptor for session expiration
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Only handle session expiration if:
        // 1. User is authenticated (has a token)
        // 2. Response is 401 Unauthorized
        // 3. Request had Authorization header (was an authenticated request)
        const [url, options] = args;
        const hasAuthHeader = options?.headers?.Authorization || options?.headers?.authorization;
        const userLoggedIn = localStorage.getItem("user");
        
        if (response.status === 401 && hasAuthHeader && userLoggedIn && window.handleAuthError) {
          window.handleAuthError(response);
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    };
    
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Global demo reset for Informal Learning data on app startup
  useEffect(() => {
    try {
      localStorage.removeItem("informalPosts");
      localStorage.removeItem("informalSaved");
      localStorage.removeItem("informalFollowingTopics");
      localStorage.removeItem("informalFollowingCreators");
      localStorage.removeItem("informalBadges");
    } catch {}
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <LoadingProvider>
            <SessionExpiredToast />
            <ErrorBoundary>
              <AppShell />
            </ErrorBoundary>
          </LoadingProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}