import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./contexts/AuthContext";
import { CoursesProvider } from "./contexts/CoursesContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { FormalEducationProvider } from "./contexts/FormalEducationContext";
import { NonFormalProvider } from "./contexts/NonFormalContext";
import theme from "./theme";
import ProtectedRoute from "./components/ProtectedRoute";
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
import CourseDetailPage from "./pages/CourseDetailPage";
import QuizPage from "./pages/QuizPage";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <CoursesProvider>
            <FormalEducationProvider>
              <NonFormalProvider>
                <SidebarProvider>
                <Routes>
                <Route path="/" element={<Login />} />
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
                      <Suspense fallback={<div />}> 
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

                {/* Default entry fallback */}
                <Route path="*" element={<Login />} />
              </Routes>
              </SidebarProvider>
              </NonFormalProvider>
            </FormalEducationProvider>
          </CoursesProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
