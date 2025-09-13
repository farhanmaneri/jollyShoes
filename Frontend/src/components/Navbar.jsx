import React, { useState, useEffect, useRef } from "react";
import {
  LogOut,
  LogIn,
  Upload,
  Store,
  User,
  Users,
  Package,
  X,
  Wallet,
  ShoppingBag,
  Coins,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import { logoutUser } from "../redux/features/navbar/navbarSlice";

function Navbar() {
  const products = useSelector((state) => state.navbarReducer.value);
  const { token, setToken, role, user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogOut = () => {
    dispatch(logoutUser());
    setToken(null);
    navigate("/", { replace: true });
  };

  const handleUpload = () => navigate("/upload");
  const handleUsers = () => navigate("/users");
  const handleOrders = () => navigate("/orders");

  // Get total items and total price
  const numberOfProducts = () =>
    products.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = () =>
    products.reduce((total, item) => total + (item.finalPrice ?? item.price) * item.quantity, 0);

  // ✅ Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Cart display component for reuse
  const CartDisplay = ({ isMobile = false }) => (
    <div
      onClick={() => navigate("/shopping-cart")}
      className={`
        flex items-center gap-3 cursor-pointer group
        ${isMobile ? 'p-1.5' : 'p-2 px-3'}
        border border-gray-200 rounded-lg
        hover:border-indigo-200 hover:bg-indigo-50/30
        transition-all duration-200
      `}
    >
      {/* Price */}
      <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'} text-gray-700`}>
        Rs {totalPrice().toLocaleString()}
      </span>

      {/* Shopping bag with count */}
      <div className="relative">
        <div className="p-1.5 rounded-full bg-gray-50/80 group-hover:bg-indigo-100/80 transition-colors">
          <ShoppingBag
            className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600 group-hover:text-indigo-600`}
          />
          {numberOfProducts() > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {numberOfProducts()}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 fixed inset-x-0 top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Desktop Logo */}
          <div
            className="hidden md:flex items-center text-2xl font-bold text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors"
            onClick={() => navigate("/")}
          >
            <Store className="mr-2 w-7 h-7" />
            Jolly Shoes
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                }`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                }`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                }`
              }
            >
              Contact
            </NavLink>
            {/* User section with professional layout */}
            <div className="flex items-center gap-4 ml-6 pl-6 border-l border-gray-200">
              <CartDisplay />
              {token ? (
                <div className="flex items-center gap-3">
                  {/* User Profile Section */}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    {user?.name && (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 leading-none">
                          Welcome
                        </span>
                        <span className="text-sm font-semibold text-gray-800 leading-none">
                          {user.name}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {role === "admin" && (
                      <button
                        onClick={handleUpload}
                        className="p-2 rounded-full bg-gray-50 hover:bg-blue-50 transition-colors group"
                        title="Upload Products"
                      >
                        <Upload className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                      </button>
                    )}
                    {role === "admin" && (
                      <button
                        onClick={handleUsers}
                        className="p-2 rounded-full bg-gray-50 hover:bg-blue-50 transition-colors group"
                        title="Show Users"
                      >
                        <Users
                          size={20}
                          className="w-5 h-5 text-gray-600 group-hover:text-blue-600"
                        />
                      </button>
                    )}
                  

                    {role === "admin" && (
                      <button
                        onClick={handleOrders}
                        className="p-2 rounded-full bg-gray-50 hover:bg-blue-50 transition-colors group"
                        title=" Orders"
                      >
                        <Package
                          size={20}
                          className="w-5 h-5 text-gray-600 group-hover:text-blue-600"
                        />
                      </button>
                    )}
                    <button
                      onClick={handleLogOut}
                      className="p-2 rounded-full bg-gray-50 hover:bg-red-50 transition-colors group"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </button>
              )}
            </div>
          </div>
          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-between w-full">
            {/* Left - Logo */}
            <div
              className="flex items-center text-lg font-bold text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors"
              onClick={() => navigate("/")}
            >
              <Store className="mr-1 w-5 h-5" />
              <span className="text-sm">Jolly Shoes</span>
            </div>

            {/* Center - Hamburger Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Right side - Cart */}
            <CartDisplay isMobile={true} />
          </div>
        </div>
      </div>

      {/* ✅ Mobile Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-white shadow-lg border-t border-gray-100 relative"
        >
          {/* X Close Button */}
          <div className="flex justify-center p-1">
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6 text-red-600" />
            </button>
          </div>

          <div className="px-4 pb-3 space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </NavLink>
          </div>

          {/* Mobile User Section */}
          <div className="border-t border-gray-100 px-4 py-3">
            {token ? (
              <div className="space-y-3">
                {user?.name && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {user.name}
                      </p>
                    </div>
                  </div>
                )}

                {/* Mobile Action Buttons */}
                <div className="flex gap-2">
                  {role === "admin" && (
                    <button
                      onClick={() => {
                        handleUpload();
                        setMenuOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        Upload
                      </span>
                    </button>
                  )}
                  {role === "admin" && (
                    <button
                      onClick={() => {
                        handleUsers();
                        setMenuOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        Users
                      </span>
                    </button>
                  )}
                  {role === "admin" && (
                    <button
                      onClick={() => navigate("/gold-rate")}
                      className="p-2 rounded-full bg-gray-50 hover:bg-yellow-50 transition-colors group"
                      title="Gold Rate"
                    >
                      <Coins className="w-5 h-5 text-gray-600 group-hover:text-yellow-600" />
                    </button>
                  )}

                  {role === "admin" && (
                    <button
                      onClick={() => {
                        handleOrders();
                        setMenuOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Package className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        Orders
                      </span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    handleLogOut();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-700">
                    Sign Out
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
