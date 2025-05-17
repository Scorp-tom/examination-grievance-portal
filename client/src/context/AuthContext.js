import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authProcess, setAuthProcess] = useState({
    inProgress: false,
    completed: false,
  });

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  };

  const loadUser = async () => {
    try {
      const res = await api.get("/api/auth/user");
      setUser(res.data.user);
      setIsAuthenticated(true);
      return res.data.user;
    } catch (err) {
      console.error("Failed to load user:", err);
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post("/api/auth/register", formData);
      setAuthToken(res.data.token);
      const user = await loadUser();
      return { success: true, user };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Registration failed",
      };
    }
  };

  // const login = async (formData) => {
  //   try {
  //     const res = await api.post("/api/auth/login", formData);
  //     setAuthToken(res.data.token);
  //     const user = await loadUser();
  //     return { success: true, user };
  //   } catch (err) {
  //     return {
  //       success: false,
  //       error: err.response?.data?.error || "Login failed",
  //     };
  //   }
  // };

  // Update your login function:
  const login = async (formData) => {
    setAuthProcess({ inProgress: true, completed: false });
    try {
      const res = await api.post("/api/auth/login", formData);
      setAuthToken(res.data.token);
      const userRes = await api.get("/api/auth/user");

      setUser(userRes.data.user);
      setIsAuthenticated(true);
      setAuthProcess({ inProgress: false, completed: true });

      return { success: true, user: userRes.data.user };
    } catch (err) {
      setAuthProcess({ inProgress: false, completed: false });
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        authProcess,
        login,
        logout,
        register,
        api,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
