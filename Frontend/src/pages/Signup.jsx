// src/pages/Signup.jsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [email, setEmail] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const API =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_PROD
      : import.meta.env.VITE_API_DEV;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordValue = watch("password");

  // Check password strength
  // Check password strength
  const checkPasswordStrength = (password) => {
    if (!password) return "";

    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    if (password.length < 6) {
      return "Weak";
    }

    if (password.length >= 6 && hasLetters && hasNumber) {
      return "Medium";
    }

    if (password.length >= 8 && hasLetters && hasNumber && hasSpecial) {
      return "Strong";
    }

    return "Weak";
  };

  React.useEffect(() => {
    setPasswordStrength(checkPasswordStrength(passwordValue));
  }, [passwordValue]);

  const notifySuccess = () =>
    toast.success("You have successfully signed up 🎉");
  const notifyError = () => toast.error("Signup failed ❌");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${API}/auth/signup`,
        data
      );

      if (response.status === 200) {
        setEmail(data.email);
        setShowOtpModal(true);
      } else {
        notifyError();
      }
    } catch (error) {
      // console.error(error);
      notifyError();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        `${API}/auth/verify-otp`,
        { otp }
      );

      if (response.status === 200) {
        notifySuccess();
        navigate("/login");
      } else {
        setOtpError(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      // console.error(error);
      setOtpError("Error verifying OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-sky-100 to-blue-200 px-4">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Signup Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create an Account ✨
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <input
              type="text"
              placeholder="Username"
              {...register("name", { required: true })}
              className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">*Name* is mandatory</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
              className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">*Email* is mandatory</p>
            )}
          </div>

          {/* Password + Strength Indicator */}
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
              className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                *Password* is mandatory
              </p>
            )}

            {passwordStrength && (
              <p
                className={`mt-1 text-sm font-medium ${
                  passwordStrength === "Weak"
                    ? "text-red-500"
                    : passwordStrength === "Medium"
                    ? "text-yellow-500"
                    : "text-green-600"
                }`}
              >
                Password Strength: {passwordStrength}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-600">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-sky-500 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Enter OTP</h2>
            <p className="text-sm text-gray-600 mb-4">
              We’ve sent a verification code to{" "}
              <span className="font-medium text-sky-600">{email}</span>
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-3 mb-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />

            {otpError && (
              <p className="text-sm text-red-500 mb-2">{otpError}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowOtpModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
