// src/components/OAuthCallback.jsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import toast from "react-hot-toast";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setToken } = useAuth();

  useEffect(() => {
    // console.log("🔍 OAuth Callback - Full URL:", window.location.href); 
    // the console is commented again after checking the issue
    // console.log("🔍 Search Params:", Object.fromEntries(searchParams));

    const token = searchParams.get("token");
    const userData = searchParams.get("user");
    const redirectUrl = searchParams.get("redirectUrl") || "/"; 
    const error = searchParams.get("error");

    // console.log("🔍 Extracted values:", {
    //   token: token ? "Present" : "Missing",
    //   userData: userData ? "Present" : "Missing",
    //   error,
    // });

    if (error) {
      //   console.error("❌ OAuth Error:", error);
      toast.error("Authentication failed. Please try again.");
      navigate("/login");
      return;
    }

    if (token && userData) {
      try {
        // console.log("🔧 Parsing user data...");
        const user = JSON.parse(decodeURIComponent(userData));
        // console.log("✅ Parsed user:", user);

        // Set token in auth context
        // console.log("🔧 Setting token...");
        setToken(token);

        // Store user data if needed
        localStorage.setItem("user", JSON.stringify(user));
        // console.log("✅ User data stored in localStorage");

        toast.success(`Welcome ${user.name}! 🎉`);
        // console.log("🔧 Navigating to home...");
        navigate(redirectUrl); // ✅ go back where user started
      } catch (err) {
        // console.error("❌ Error parsing user data:", err);
        // console.error("❌ Raw userData string:", userData);
        toast.error("Authentication failed. Please try again.");
        navigate("/login");
      }
    } else {
      //   console.error("❌ Missing token or userData");
      //   console.log("🔍 Token present:", !!token);
      //   console.log("🔍 UserData present:", !!userData);
      //   toast.error("Authentication failed. Please try again.");
      navigate("/login");
    }
  }, [searchParams, navigate, setToken]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing authentication...</p>
        <p className="mt-2 text-sm text-gray-500">
          URL: {window.location.href}
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;
