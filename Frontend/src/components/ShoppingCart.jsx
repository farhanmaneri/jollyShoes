import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ZeroProduct from "./ZeroProduct.jsx";
import { FaTrashAlt } from "react-icons/fa";
import {
  add,
  clearCart,
  remove,
  removeOne,
} from "../redux/features/navbar/navbarSlice";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { MdShoppingCart, MdPayment } from "react-icons/md";
import Navbar from "./Navbar.jsx";
import toast from "react-hot-toast"; // Import toast directly

function ShoppingCart() {
  const productsInShoppingCart = useSelector(
    (state) => state.navbarReducer.value
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculate totals with finalPrice fallback
  function calculateTotalPrice() {
    return productsInShoppingCart.reduce((acc, product) => {
      const unitPrice = product.finalPrice ?? product.price;
      return acc + unitPrice * product.quantity;
    }, 0);
  }

  // Extra details for display
  const totalItems = productsInShoppingCart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = calculateTotalPrice();
  const shipping = totalPrice > 1000 ? 0 : 50;
  const finalTotal = totalPrice + shipping;

  const handleClearCart = () => {
    // Dismiss any existing toasts first
    toast.dismiss();
    
    dispatch(clearCart());
    
    // Show success toast with unique ID
    toast.success("Cart cleared successfully!", {
      id: `clear-cart-${Date.now()}`,
      duration: 2000,
      icon: "🗑️"
    });

    // Navigate after a short delay
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  // Handle navigation back to products
  const handleContinueShopping = () => {
    // Dismiss toasts when navigating
    toast.dismiss();
    navigate("/");
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-8">
            <MdShoppingCart className="text-3xl text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
            <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
              {totalItems} items
            </span>
          </div>

          {totalPrice === 0 ? (
            <ZeroProduct />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <button
                  onClick={handleContinueShopping}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4 transition-colors duration-200"
                >
                  <AiOutlineArrowLeft />
                  Continue Shopping
                </button>

                {productsInShoppingCart.map((eachProduct, index) => {
                  const unitPrice = eachProduct.finalPrice ?? eachProduct.price;
                  const totalRowPrice = unitPrice * eachProduct.quantity;
                  const sizeInfo = eachProduct.sizes?.find(
                    (s) => s.size === Number(eachProduct.selectedSize)
                  );
                  const stock = sizeInfo ? sizeInfo.stock : 0;

                  const handleIncrease = () => {
                    if (eachProduct.quantity >= stock) {
                      toast.error("Cannot add more, stock limit reached", {
                        id: `stock-limit-${eachProduct._id}-${eachProduct.selectedSize}-${Date.now()}`,
                        duration: 3000,
                        icon: "⚠️"
                      });
                      return;
                    }
                    
                    dispatch(add({ ...eachProduct, quantity: 1 }));
                    
                    toast.success("Quantity increased!", {
                      id: `increase-${eachProduct._id}-${eachProduct.selectedSize}-${Date.now()}`,
                      duration: 1500,
                      icon: "➕"
                    });
                  };

                  const handleDecrease = () => {
                    dispatch(
                      removeOne({
                        _id: eachProduct._id,
                        selectedSize: eachProduct.selectedSize,
                      })
                    );
                    
                    if (eachProduct.quantity === 1) {
                      toast.success("Item removed from cart", {
                        id: `remove-${eachProduct._id}-${eachProduct.selectedSize}-${Date.now()}`,
                        duration: 2000,
                        icon: "🗑️"
                      });
                    } else {
                      toast.success("Quantity decreased!", {
                        id: `decrease-${eachProduct._id}-${eachProduct.selectedSize}-${Date.now()}`,
                        duration: 1500,
                        icon: "➖"
                      });
                    }
                  };

                  const handleRemoveProduct = () => {
                    dispatch(
                      remove({
                        _id: eachProduct._id,
                        selectedSize: eachProduct.selectedSize,
                      })
                    );
                    
                    toast.success("Product removed from cart", {
                      id: `remove-product-${eachProduct._id}-${eachProduct.selectedSize}-${Date.now()}`,
                      duration: 2000,
                      icon: "🗑️"
                    });
                  };

                  return (
                    <div
                      key={`${eachProduct._id}-${eachProduct.selectedSize}`}
                      className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Image */}
                        <div className="flex-shrink-0 self-center sm:self-start">
                          <img
                            src={eachProduct.image}
                            alt={eachProduct.title}
                            className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity duration-200 mx-auto sm:mx-0"
                            onClick={() => {
                              toast.dismiss();
                              navigate(`/details/${eachProduct._id}`);
                            }}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          <div className="text-center sm:text-left">
                            <h3 className="font-semibold text-gray-800 text-lg">
                              {eachProduct.brand}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {eachProduct.title}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Size: {eachProduct.selectedSize}
                            </p>
                            {eachProduct.weightInGrams > 0 && (
                              <p className="text-gray-600 text-sm">
                                Weight: {eachProduct.weightInGrams} grams
                              </p>
                            )}
                          </div>

                          {/* Controls */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center justify-center sm:justify-start gap-3">
                              <button
                                onClick={handleDecrease}
                                disabled={eachProduct.quantity < 1}
                                className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 border-gray-300 flex items-center justify-center font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:border-indigo-600 hover:text-indigo-600 transition-colors duration-200"
                              >
                                -
                              </button>
                              <span className="font-semibold min-w-[3rem] sm:min-w-[2rem] text-center text-lg sm:text-base">
                                {eachProduct.quantity}
                              </span>
                              <button
                                onClick={handleIncrease}
                                className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 border-gray-300 flex items-center justify-center font-bold hover:border-indigo-600 hover:text-indigo-600 transition-colors duration-200"
                              >
                                +
                              </button>
                            </div>

                            {/* Price + Delete */}
                            <div className="flex items-center justify-center sm:justify-end gap-4">
                              <div className="text-center sm:text-right">
                                <div className="font-bold text-xl sm:text-lg text-gray-800">
                                  Rs. {totalRowPrice.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Rs. {unitPrice.toLocaleString()} each
                                </div>
                              </div>
                              <button
                                onClick={handleRemoveProduct}
                                className="text-red-500 hover:text-red-700 p-3 sm:p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
                              >
                                <FaTrashAlt className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg border p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <MdPayment className="text-indigo-600" />
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>Rs. {totalPrice.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
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

                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total</span>
                      <span>Rs. {finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-6">
                    <button
                      onClick={() => {
                        toast.dismiss();
                        navigate("/checkout");
                      }}
                      className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <MdPayment className="text-lg" />
                      Proceed to Checkout
                      <AiOutlineArrowRight className="text-lg" />
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                      </div>
                    </div>

                    <button
                      onClick={handleClearCart}
                      className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:border-red-400 hover:text-red-600 transition-colors duration-200"
                    >
                      Clear Cart
                    </button>
                  </div>

                  {/* Security */}
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">
                        Secure Checkout
                      </span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Your payment information is protected
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ShoppingCart;