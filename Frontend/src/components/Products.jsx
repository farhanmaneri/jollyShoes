import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Edit3, Trash2, Eye, CheckCircle } from "lucide-react";
import { add } from "../redux/features/navbar/navbarSlice";
import toast, { Toaster } from "react-hot-toast";
import { removeProduct } from "../redux/features/products/productsSlice";
import { useAuth } from "../Auth/AuthProvider";
import axios from "axios";

function Products() {
  const products = useSelector((state) => state.productsReducer.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addedItems, setAddedItems] = useState(new Set());
  const [selectedSizes, setSelectedSizes] = useState(new Map());

  const { role } = useAuth();
  const API =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_PROD
      : import.meta.env.VITE_API_DEV;

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes.get(product._id);
    if (!selectedSize) {
      toast.error("Please select a size first", {
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
          fontWeight: "600",
        },
      });
      return;
    }

    const sizeInfo = product.sizes?.find(
      (s) => s.size === Number(selectedSize)
    );
    if (!sizeInfo || sizeInfo.stock === 0) {
      toast.error("Selected size is out of stock", {
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
          fontWeight: "600",
        },
      });
      return;
    }

    const cartItem = {
      ...product,
      selectedSize,
      quantity: 1,
    };

    dispatch(add(cartItem));
    setAddedItems(
      (prev) => new Set([...prev, `${product._id}-${selectedSize}`])
    );
    toast.success("Added to cart!", {
      icon: "🛒",
      style: {
        borderRadius: "10px",
        background: "#10B981",
        color: "#fff",
        fontWeight: "600",
      },
    });

    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(`${product._id}-${selectedSize}`);
        return newSet;
      });
    }, 2000);
  };

  const handleDelete = async (product) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(`${API}/admin/${product._id}`, {
          withCredentials: true,
        });
        toast.success("Product deleted successfully", {
          icon: "🗑️",
          style: {
            borderRadius: "10px",
            background: "#EF4444",
            color: "#fff",
            fontWeight: "600",
          },
        });
        dispatch(removeProduct(product._id));
      } catch (error) {
        console.error("Delete error:", error.response?.data || error.message);
        toast.error(
          error.response?.data?.message || "Failed to delete product",
          {
            style: {
              borderRadius: "10px",
              background: "#EF4444",
              color: "#fff",
              fontWeight: "600",
            },
          }
        );
      }
    }
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => {
      const newMap = new Map(prev);
      newMap.set(productId, size);
      return newMap;
    });
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Our{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-500">
              Shoes
            </span>
          </h1>
          <p className="text-gray-600 mt-2">
            Explore our latest collection of premium shoes
          </p>
        </div>

        {products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => navigate(`/details/${product._id}`)}
                  />
                  <button
                    onClick={() => navigate(`/details/${product._id}`)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Eye size={18} className="text-gray-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <span className="text-sm text-gray-500 uppercase font-medium">
                    {product.category}
                  </span>
                  <h3
                    className="text-lg font-semibold text-gray-900 mt-1 cursor-pointer hover:text-blue-600"
                    onClick={() => navigate(`/details/${product._id}`)}
                  >
                    {product.title}
                  </h3>

                  {/* Sizes */}
                  <div className="mt-2">
                    <label
                      htmlFor={`size-selector-${product._id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Select Size
                    </label>
                    <select
                      id={`size-selector-${product._id}`}
                      value={selectedSizes.get(product._id) || ""}
                      onChange={(e) =>
                        handleSizeChange(product._id, e.target.value)
                      }
                      className="w-full max-w-xs p-2 border rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="" disabled>
                        Choose a size
                      </option>
                      {product.sizes?.length > 0 ? (
                        product.sizes.map((s, idx) => (
                          <option key={idx} value={s.size}>
                            {s.size}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No sizes listed
                        </option>
                      )}
                    </select>
                  </div>

                  {/* Footer with price + cart */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-baseline">
                      <span className="text-sm text-gray-600">Rs</span>
                      <span className="text-lg font-semibold text-gray-900 ml-1">
                        {product.price}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`flex items-center px-4 py-2 rounded-md text-white font-medium transition-all duration-200 ${
                        addedItems.has(
                          `${product._id}-${selectedSizes.get(product._id)}`
                        )
                          ? "bg-green-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {addedItems.has(
                        `${product._id}-${selectedSizes.get(product._id)}`
                      ) ? (
                        <>
                          <CheckCircle size={18} className="mr-2" />
                          Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={18} className="mr-2" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>

                  {/* Admin Controls */}
                  {role === "admin" && (
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => navigate(`/edit/${product._id}`)}
                        className="flex items-center px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors duration-200"
                      >
                        <Edit3 size={16} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="flex items-center px-3 py-1 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors duration-200"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart size={64} className="mx-auto text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mt-4">
              No products available
            </h3>
            <p className="text-gray-600 mt-2">
              Check back later for new shoes!
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Products;
