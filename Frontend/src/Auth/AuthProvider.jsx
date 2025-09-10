import { jwtDecode } from "jwt-decode";
import axios from "axios";
import React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token, role, and user info
  const [token, setToken_] = useState(() => {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem("role");
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      // console.log("🔄 Loading saved user from localStorage:", savedUser);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing saved user:", error);
      return null;
    }
  });

  // Function to set the authentication token
  const setToken = (newToken) => {
    console.log(
      "🔧 Setting new token:",
      newToken ? "Token received" : "Token cleared"
    );

    setToken_(newToken);

    if (newToken) {
      try {
        const decoded = jwtDecode(newToken);
        console.log("🔍 Decoded token payload:", decoded);

        const userRole = decoded.role || null;
        const userData = {
          id: decoded.id || decoded.userId || decoded._id || null,
          name: decoded.name || decoded.username || decoded.userName || null,
          email: decoded.email || null,
        };

        console.log("👤 Extracted user data:", userData);
        console.log("🎭 Extracted role:", userRole);

        setRole(userRole);
        setUser(userData);

        // Store in localStorage with error handling
        try {
          localStorage.setItem("role", userRole || "");
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", newToken);
          console.log("💾 Data saved to localStorage successfully");
        } catch (storageError) {
          console.error("Error saving to localStorage:", storageError);
        }
      } catch (err) {
        console.error("❌ Failed to decode token", err);
        setRole(null);
        setUser(null);

        try {
          localStorage.removeItem("role");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        } catch (storageError) {
          console.error("Error clearing localStorage:", storageError);
        }
      }
    } else {
      console.log("🧹 Clearing all auth data");
      setRole(null);
      setUser(null);

      try {
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } catch (storageError) {
        console.error("Error clearing localStorage:", storageError);
      }
    }
  };

  // Function to update user info (useful for profile updates)
  const setUserInfo = (userInfo) => {
    console.log("📝 Updating user info:", userInfo);
    setUser(userInfo);

    if (userInfo) {
      try {
        localStorage.setItem("user", JSON.stringify(userInfo));
      } catch (error) {
        console.error("Error saving user info:", error);
      }
    } else {
      try {
        localStorage.removeItem("user");
      } catch (error) {
        console.error("Error removing user info:", error);
      }
    }
  };

  // Function to logout
  const logout = () => {
    console.log("👋 Logging out user");
    setToken_(null);
    setRole(null);
    setUser(null);

    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail"); // Also remove the email you store in login
    } catch (error) {
      console.error("Error during logout cleanup:", error);
    }

    delete axios.defaults.headers.common["Authorization"];
  };

  // Initialize axios headers and handle existing tokens
  useEffect(() => {
    console.log(
      "🔄 Auth effect running - token:",
      token ? "present" : "absent",
      "user:",
      user ? "present" : "absent"
    );

    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      // 🔧 Fix for existing tokens - extract user data if missing
      if (!user) {
        console.log(
          "🔧 User data missing, attempting to extract from token..."
        );
        try {
          const decoded = jwtDecode(token);
          console.log("🔍 Decoded existing token:", decoded);

          const userData = {
            id: decoded.id || decoded.userId || decoded._id || null,
            name:
              decoded.name ||
              decoded.username ||
              decoded.userName ||
              decoded.fullName ||
              null,
            email: decoded.email || null,
          };

          if (userData.name || userData.email || userData.id) {
            console.log(
              "✅ Extracted user data from existing token:",
              userData
            );
            setUser(userData);
            try {
              localStorage.setItem("user", JSON.stringify(userData));
            } catch (storageError) {
              console.error("Error saving extracted user data:", storageError);
            }
          } else {
            console.warn("⚠️ No valid user data found in token");
          }
        } catch (err) {
          console.error(
            "❌ Failed to extract user data from existing token:",
            err
          );
          // Token might be invalid, clear everything
          logout();
        }
      }
    } else {
      console.log("🧹 No token, clearing axios headers");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token, user]);

  // Debug effect to log state changes
  // useEffect(() => {
  //   console.log("🎯 Auth state changed:", 
  //     {
  //     hasToken: !!token,
  //     hasUser: !!user,
  //     userName: user?.name,
  //     userEmail: user?.email,
  //     role: role,
  //   });
  // }, [token, user, role]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      role,
      setRole,
      user,
      setUserInfo,
      logout,
      isAuthenticated: !!token,
      isLoading: false, // You can add loading state if needed
    }),
    [token, role, user]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
