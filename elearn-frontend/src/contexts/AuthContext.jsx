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

  // Enforce login-first entry: do not auto-restore sessions
  useEffect(() => {
    localStorage.removeItem("user");
    setUser(null);
    setLoading(false);
  }, []);

  const login = async (email, password, role = "student") => {
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }
      const data = await response.json();
      const userData = data.user || data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      throw err;
    }
  };
    const register = async (formData) => {
      try {
        const response = await fetch("http://127.0.0.1:8000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Registration failed");
        }
        const data = await response.json();
        // Adjust this based on your backend's response structure
        const userData = data.user || data;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      } catch (err) {
        throw err;
      }
    };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("enrolledCourses");
  };

  // Add updateUser to allow profile editing
  const updateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
