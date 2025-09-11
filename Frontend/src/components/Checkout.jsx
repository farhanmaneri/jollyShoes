import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/features/navbar/navbarSlice";
import Navbar from "./Navbar";
import { Toaster, toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../Auth/AuthProvider";
import { Link } from "react-router-dom";
import {
  MdSecurity,
  MdShoppingCart,
  MdVerifiedUser,
  MdPayment,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdPerson,
  MdLock,
  MdLogin,
  MdTimer,
  MdRefresh,
} from "react-icons/md";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Eye, EyeOff } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

const Checkout = () => {
  const productsInCart = useSelector((state) => state.navbarReducer.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  const [isOTPStage, setIsOTPStage] = useState(false);
  const [serverOtp, setServerOtp] = useState("");
  const [formData, setFormData] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP resend logic
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputRef = useRef(null);

  const totalPrice = productsInCart.reduce(
    (acc, product) =>
      acc + (product.finalPrice ?? product.price) * product.quantity,
    0
  );

  const totalItems = productsInCart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const shipping = totalPrice > 1000 ? 0 : 50;
  const finalTotal = totalPrice + shipping;

  const API =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_PROD
      : import.meta.env.VITE_API_DEV;

  const handleGoogleLogin = () => {
    const redirectUrl = window.location.pathname; // Current page (checkout)
    window.location.href = `${API}/auth/google?redirectUrl=${redirectUrl}`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm();

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API}/auth/profile/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            setUserProfile(response.data.data);
          }
        } catch (error) {
          if (
            error.response?.data?.code === "TOKEN_EXPIRED" ||
            error.response?.data?.error?.includes("expired")
          ) {
            localStorage.removeItem("token");
            setToken(null);
            navigate("/login");
            toast.error("Session expired. Please login again.", {
              style: {
                borderRadius: "10px",
                background: "#EF4444",
                color: "#fff",
                fontWeight: "600",
              },
            });
          }
        }
      }
    };
    fetchUserProfile();
  }, [token, navigate, setToken]);

  // Timer countdown for resend
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Auto-focus OTP input
  useEffect(() => {
    if (isOTPStage && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [isOTPStage]);

  // Handle login
  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API}/auth/login`,
        { email: data.email, password: data.password },
        { headers: { "Content-Type": "application/json" } }
      );

      const result = response.data.data;

      if (result && result.token) {
        localStorage.removeItem("userEmail");
        localStorage.setItem("token", result.token);
        setToken(result.token);
        setShowLogin(false);
        toast.success("Login successful 🎉", {
          style: {
            borderRadius: "10px",
            background: "#10B981",
            color: "#fff",
            fontWeight: "600",
          },
        });
      } else {
        toast.error("Login failed - no token received", {
          style: {
            borderRadius: "10px",
            background: "#EF4444",
            color: "#fff",
            fontWeight: "600",
          },
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Invalid email or password ❌",
        {
          style: {
            borderRadius: "10px",
            background: "#EF4444",
            color: "#fff",
            fontWeight: "600",
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP for guest user
  const handleSendOTP = async (data) => {
    setIsLoading(true);
    try {
      setFormData(data);
      const response = await axios.post(`${API}/auth/send-otp`, {
        email: data.email,
        name: data.userName,
        purpose: "order_verification",
        totalAmount: totalPrice,
        itemCount: totalItems,
      });
      if (response.data.success) {
        setServerOtp(response.data.code || response.data.otp);
        toast.success(`OTP sent to ${data.email}!`, {
          style: {
            borderRadius: "10px",
            background: "#10B981",
            color: "#fff",
            fontWeight: "600",
          },
        });
        setIsOTPStage(true);
        setResendTimer(30);
      } else {
        toast.error(response.data.message, {
          style: {
            borderRadius: "10px",
            background: "#EF4444",
            color: "#fff",
            fontWeight: "600",
          },
        });
      }
    } catch (error) {
      toast.error("Error sending OTP. Try again.", {
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
          fontWeight: "600",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    await handleSendOTP(formData);
  };

  // Verify OTP and place order for guest
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp === serverOtp) {
      await placeOrder(formData);
    } else {
      toast.error("Invalid OTP! Please try again.", {
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
          fontWeight: "600",
        },
      });
    }
  };

  // Direct order placement for logged-in user
  const handlePlaceOrderDirect = async (data) => {
    await placeOrder({
      ...data,
      email: userProfile?.email,
      userName: userProfile?.name,
    });
  };

  // Common order placement
  const placeOrder = async (data) => {
    try {
      const orderData = {
        products: productsInCart.map((product) => ({
          _id: product._id,
          selectedSize: product.selectedSize,
          quantity: product.quantity,
          price: product.finalPrice ?? product.price,
          title: product.title,
          brand: product.brand,
          weightInGrams: product.weightInGrams,
          image: product.image,
        })),
        totalPrice,
        contact: data.contact,
        address: data.address,
        email: data.email,
        userName: data.userName,
      };
      const res = await axios.post(`${API}/auth/place-order`, orderData, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (res.data.success) {
        toast.success("Order placed successfully!", {
          style: {
            borderRadius: "10px",
            background: "#10B981",
            color: "#fff",
            fontWeight: "600",
          },
        });
        dispatch(clearCart());
        navigate("/");
      } else {
        toast.error(res.data.message, {
          style: {
            borderRadius: "10px",
            background: "#EF4444",
            color: "#fff",
            fontWeight: "600",
          },
        });
      }
    } catch (error) {
      toast.error("Error placing order. Try again.", {
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
          fontWeight: "600",
        },
      });
    }
  };

  // Empty cart check
  if (productsInCart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            <MdShoppingCart className="mx-auto text-6xl text-gray-400 mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">
              Add some items to your cart to proceed with checkout
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Toaster />

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <button
              onClick={() => navigate("/shopping-cart")}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4 transition-colors duration-200"
            >
              <AiOutlineArrowLeft />
              Back to Cart
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-3">
                <MdPayment className="text-2xl sm:text-3xl text-indigo-600" />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Checkout
                </h1>
              </div>
              <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium w-fit">
                {totalItems} items
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MdShoppingCart className="text-indigo-600" />
                  Order Summary ({totalItems} items)
                </h2>
                <div className="space-y-3 sm:space-y-4 max-h-64 sm:max-h-80 overflow-y-auto">
                  {productsInCart.map((product) => (
                    <div
                      key={`${product._id}-${product.selectedSize}`}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2">
                          {product.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-1">
                          <p>{product.brand}</p>
                          <p>Size: {product.selectedSize}</p>
                          <p>Qty: {product.quantity}</p>
                          {product.weightInGrams > 0 && (
                            <p>Weight: {product.weightInGrams}g</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right w-full sm:w-auto flex justify-between sm:block">
                        <div className="sm:hidden text-gray-600 text-sm">
                          Total:
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm sm:text-base">
                            Rs.{" "}
                            {(
                              (product.finalPrice ?? product.price) *
                              product.quantity
                            ).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Rs.{" "}
                            {(
                              product.finalPrice ?? product.price
                            ).toLocaleString()}{" "}
                            each
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Authentication/Checkout Form */}
              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                {!token ? (
                  !isOTPStage ? (
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                        Choose Your Option
                      </h2>

                      {/* Login Option */}
                      <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 sm:p-6 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                          <MdLogin className="text-2xl text-indigo-600 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              Already have an account?
                            </h3>
                            <p className="text-sm text-gray-600">
                              Sign in for faster checkout
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowLogin(!showLogin)}
                          className="w-full bg-indigo-600 text-white font-semibold px-4 sm:px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm sm:text-base"
                        >
                          {showLogin ? "Close" : "Sign In to Your Account"}
                        </button>

                        {/* Login Dropdown */}
                        {showLogin && (
                          <div className="mt-4 border-t pt-4">
                            <form
                              onSubmit={handleLoginSubmit(handleLogin)}
                              className="space-y-4"
                            >
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  <MdEmail className="inline mr-1" />
                                  Email Address
                                </label>
                                <input
                                  type="email"
                                  placeholder="Enter your email"
                                  {...registerLogin("email", {
                                    required: "Email is required",
                                    pattern: {
                                      value: /^\S+@\S+$/i,
                                      message: "Invalid email address",
                                    },
                                  })}
                                  className="w-full px-3 sm:px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                                />
                                {loginErrors.email && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {loginErrors.email.message}
                                  </p>
                                )}
                              </div>

                              <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  <MdLock className="inline mr-1" />
                                  Password
                                </label>
                                <input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  {...registerLogin("password", {
                                    required: "Password is required",
                                    minLength: {
                                      value: 6,
                                      message:
                                        "Password must be at least 6 characters",
                                    },
                                  })}
                                  className="w-full px-3 sm:px-4 py-3 pr-12 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute inset-y-0 right-3 top-8 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                  {showPassword ? (
                                    <EyeOff size={20} />
                                  ) : (
                                    <Eye size={20} />
                                  )}
                                </button>
                                {loginErrors.password && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {loginErrors.password.message}
                                  </p>
                                )}
                              </div>

                              <div className="flex justify-end">
                                <Link
                                  to="/forgot-password"
                                  className="text-sm text-indigo-600 hover:text-indigo-700"
                                >
                                  Forgot password?
                                </Link>
                              </div>

                              <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
                                  isLoading
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                <MdLogin />
                                {isLoading ? "Logging In..." : "Sign In"}
                              </button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center my-6">
                              <hr className="flex-1 border-gray-300" />
                              <span className="px-2 text-gray-500 text-sm">
                                OR
                              </span>
                              <hr className="flex-1 border-gray-300" />
                            </div>

                            {/* Google button */}
                            {/* <button
                              type="button"
                              onClick={handleGoogleLogin}
                              className="w-full flex items-center justify-center gap-2 py-3 bg-sky-500 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base"
                            >
                              <FaGoogle size={20} />
                              Continue with Google
                            </button> */}
                          </div>
                        )}
                      </div>

                      {/* Guest Checkout */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <MdPerson className="text-indigo-600" />
                          Continue as Guest
                        </h3>
                        <form
                          onSubmit={handleSubmit(handleSendOTP)}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MdPerson className="inline mr-1" />
                                Full Name
                              </label>
                              <input
                                type="text"
                                placeholder="Enter your full name"
                                {...register("userName", {
                                  required: "Name is required",
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                              />
                              {errors.userName && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.userName.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MdEmail className="inline mr-1" />
                                Email Address
                              </label>
                              <input
                                type="email"
                                placeholder="Enter your email"
                                {...register("email", {
                                  required: "Email is required",
                                  pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address",
                                  },
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                              />
                              {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.email.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <MdPhone className="inline mr-1" />
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              placeholder="Enter your phone number"
                              {...register("contact", {
                                required: "Phone number is required",
                              })}
                              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                            />
                            {errors.contact && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.contact.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <MdLocationOn className="inline mr-1" />
                              Delivery Address
                            </label>
                            <textarea
                              placeholder="Enter your complete delivery address"
                              rows="3"
                              {...register("address", {
                                required: "Address is required",
                              })}
                              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                            />
                            {errors.address && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.address.message}
                              </p>
                            )}
                          </div>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-600 text-white font-semibold py-4 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                          >
                            <MdEmail />
                            {isLoading
                              ? "Sending OTP..."
                              : "Send Verification Code"}
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    // OTP Verification Stage
                    <div className="text-center">
                      <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MdEmail className="text-3xl text-green-600" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                        Verify Your Email
                      </h2>
                      <p className="text-gray-600 mb-8 text-sm sm:text-base px-4">
                        We've sent a verification code to <br />
                        <span className="font-semibold text-indigo-600 break-all">
                          {formData.email}
                        </span>
                      </p>
                      <form
                        onSubmit={handleVerifyOTP}
                        className="max-w-sm mx-auto px-4"
                      >
                        <div className="mb-6">
                          <input
                            type="text"
                            placeholder="Enter verification code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            ref={otpInputRef}
                            maxLength="6"
                            className="w-full text-center text-xl sm:text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-lg py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            required
                          />
                        </div>
                        <div className="mb-6">
                          {resendTimer > 0 ? (
                            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                              <MdTimer />
                              <span>Resend code in {resendTimer}s</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOTP}
                              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mx-auto text-sm transition-colors duration-200"
                            >
                              <MdRefresh />
                              Resend Code
                            </button>
                          )}
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          <MdVerifiedUser />
                          Verify & Place Order
                        </button>
                      </form>
                      <button
                        onClick={() => setIsOTPStage(false)}
                        className="text-gray-500 hover:text-gray-700 mt-4 text-sm transition-colors duration-200"
                      >
                        ← Change email address
                      </button>
                    </div>
                  )
                ) : (
                  // Logged-in User Flow
                  <div>
                    {userProfile ? (
                      <>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <MdVerifiedUser className="text-2xl text-green-600 flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                Welcome back, {userProfile.name}!
                              </h3>
                              <p className="text-sm text-gray-600 break-all">
                                Signed in as {userProfile.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                          Delivery Information
                        </h2>
                        <form
                          onSubmit={handleSubmit(handlePlaceOrderDirect)}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <MdPhone className="inline mr-1" />
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              placeholder="Enter your phone number"
                              {...register("contact", {
                                required: "Phone number is required",
                              })}
                              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                            />
                            {errors.contact && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.contact.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <MdLocationOn className="inline mr-1" />
                              Delivery Address
                            </label>
                            <textarea
                              placeholder="Enter your complete delivery address"
                              rows="3"
                              {...register("address", {
                                required: "Address is required",
                              })}
                              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                            />
                            {errors.address && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.address.message}
                              </p>
                            )}
                          </div>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                          >
                            <MdPayment />
                            {isLoading ? "Placing Order..." : "Place Order"}
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your profile...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Order Total Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg border p-4 sm:p-6 lg:sticky lg:top-24">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                  Order Total
                </h2>
                <div className="space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <div className="flex flex-col">
                      <span>Shipping</span>
                      {shipping === 0 && (
                        <span className="text-xs text-green-600">
                          Free shipping!
                        </span>
                      )}
                    </div>
                    <span>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span>Rs. {finalTotal.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg border border-green-200 p-3 sm:p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <MdSecurity className="flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">
                      Secure Checkout
                    </span>
                  </div>
                  <ul className="text-xs text-green-600 space-y-1">
                    <li>• SSL encrypted payment</li>
                    <li>• Your data is protected</li>
                    <li>• Safe & secure ordering</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
