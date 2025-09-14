// src/Login.jsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { FaFacebook,  FaGoogle, FaGoogleDrive } from "react-icons/fa"; // 👈 Facebook icon
import Navbar from "../components/Navbar";

function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const API =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_PROD
      : import.meta.env.VITE_API_DEV;

  // Normal email/password login
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${API}/auth/login`, data);
      const result = response.data.data;

      if (result && result.token) {
        localStorage.removeItem("userEmail");
        setToken(result.token);
        navigate("/");
        toast.success("Login successful 🎉");
      } else {
        toast.error("Login failed - no token received");
      }
    } catch (error) {
      toast.error("Invalid email or password ❌");
    }
  };

  // Facebook login handler
  const handleGoogleLogin = () => {
    window.location.href = `${API}/auth/google`;
    // 👆 redirects user to backend google login
  };
  // Facebook login handler
  const handleFacebookLogin = () => {
    window.location.href = `${API}/auth/facebook`;
    // 👆 redirects user to backend FB login
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r mt-8 from-sky-100 to-blue-200 px-4">
        <Toaster position="top-center" reverseOrder={false} />

        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
                className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  *Email* is mandatory
                </p>
              )}
            </div>
            {/* Password Input with Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: true })}
                className="w-full px-4 py-3 pr-12 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  *Password* is mandatory
                </p>
              )}
            </div>
            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-sky-500 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition duration-300"
            >
              Login
            </button>{" "}
            <p className="mt-6 text-center text-gray-600">
              Not registered?{" "}
              <Link
                to="/signup"
                className="text-sky-500 font-medium hover:underline"
              >
                Create an account
              </Link>
            </p>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 py-3 bg-sky-500 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
          >
            <FaGoogle size={20} /> Continue with Google
          </button>
          {/* <button
            onClick={handleFacebookLogin}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
          >
            <FaFacebook size={20} /> Continue with Facebook
          </button> */}

          {/* Footer */}
        </div>
      </div>
    </>
  );
}

export default Login;
