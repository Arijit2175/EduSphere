import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import API_URL from "../config";

const buildUser = (data) => {
  const first_name = data.first_name || data.email?.split("@")[0] || "User";
  const last_name = data.last_name || "";
  const name = data.name || `${first_name} ${last_name}`.trim() || data.email || "Learner";
  return { ...data, first_name, last_name, name };
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

  // Restore user from localStorage on app load for persistent login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password, role = "student") => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }
      const data = await response.json();
      // Fetch full user profile after login
      const profileRes = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      let profile = {};
      if (profileRes.ok) {
        profile = await profileRes.json();
      }
      const userObj = buildUser({ ...profile, email, access_token: data.access_token, token_type: data.token_type });
      setUser(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));
      return userObj;
    } catch (err) {
      throw err;
    }
  }, []);
  
  const register = useCallback(async (formData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }
      // Registration does not log in automatically. Require user to login after registration.
      return await response.json();
    } catch (err) {
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("enrolledCourses");
  }, []);

  // Add updateUser to allow profile editing (now updates backend too)
  const updateUser = useCallback(async (updatedFields) => {
    setUser((prev) => {
      if (!prev || !prev.access_token) return prev;
      return buildUser({ ...prev, ...updatedFields });
    });
    
    if (!user || !user.access_token) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      // Optionally handle error (show toast, etc.)
    }
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }), [user, loading, login, register, logout, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
