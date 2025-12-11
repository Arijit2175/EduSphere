import { createContext, useContext, useState, useEffect } from "react";

const buildUser = (data) => {
  const firstName = data.firstName || data.email?.split("@")[0] || "User";
  const lastName = data.lastName || "";
  const name = data.name || `${firstName} ${lastName}`.trim() || data.email || "Learner";
  return { ...data, firstName, lastName, name };
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(buildUser(parsed));
      }
    } catch (_) {
      // ignore parse issues and start fresh
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email, password, role = "student") => {
    // Mock login - in real app, this would call your backend
    const mockUser = buildUser({
      id: 1,
      email: email,
      firstName: email.split("@")[0],
      lastName: "User",
      avatar: "👤",
      joinedDate: new Date().toISOString(),
      role,
    });

    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    return mockUser;
  };

  const register = (formData) => {
    // Mock registration
    const mockUser = buildUser({
      id: Date.now(),
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      avatar: "👤",
      joinedDate: new Date().toISOString(),
      role: formData.role || "student",
    });

    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("enrolledCourses");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
