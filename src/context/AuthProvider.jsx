// src/context/AuthProvider.jsx
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.js";
import API from "../utils/axios";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      console.log("🔑 Token found in localStorage, verifying...");

      API.get("/auth/verify")
        .then((res) => {
          console.log("✅ Full API Response:", res.data);
          console.log("👤 User data:", res.data.user);
          console.log("🆔 User ID:", res.data.user?._id);
          console.log("🆔 User ID (alt):", res.data.user?.id);
          setUser(res.data.user);
        })
        .catch((err) => {
          console.error("❌ Verification failed", err);
          console.error("❌ Error response:", err.response?.data);
          localStorage.clear();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      console.log("ℹ️ No token found");
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    console.log("🔐 Login called with:", userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;