import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Edit3,
  Trash2,
  Eye,
  Star,
  Heart,
  Plus,
  CheckCircle,
} from "lucide-react";
import { add } from "../redux/features/navbar/navbarSlice";
import toast, { Toaster } from "react-hot-toast";
// Custom Components
import Hero from "./Hero";
import { removeProduct } from "../redux/features/products/productsSlice";

// Auth Context
import { useAuth } from "../Auth/AuthProvider";

// Styles
import "../styles/Products.css";
import axios from "axios";

function Products() {
  const products = useSelector((state) => state.productsReducer.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addedItems, setAddedItems] = useState(new Set());
  // const [wishlistItems, setWishlistItems] = useState(new Set());

  const { role } = useAuth();
  const API =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_PROD
      : import.meta.env.VITE_API_DEV;

  const handleAddToCart = (product) => {
    dispatch(add(product));
    setAddedItems((prev) => new Set([...prev, product._id]));
    toast.success("Added to cart!", {
      icon: "🛒",
      style: {
        borderRadius: "10px",
        background: "#10B981",
        color: "#fff",
      },
    });

    // Remove the checkmark after 2 seconds
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }, 2000);
  };

  // const toggleWishlist = (productId) => {
  //   setWishlistItems((prev) => {
  //     const newSet = new Set(prev);
  //     if (newSet.has(productId)) {
  //       newSet.delete(productId);
  //       toast("Removed from wishlist", { icon: "💔" });
  //     } else {
  //       newSet.add(productId);
  //       toast("Added to wishlist", { icon: "❤️" });
  //     }
  //     return newSet;
  //   });
  // };

  const handleDelete = async (product) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(`${API}/admin/${product._id}`, {
          withCredentials: true,
        });
        console.log("Deleted:", response.data);
        toast.success("Product deleted successfully", {
          icon: "🗑️",
          style: {
            borderRadius: "10px",
            background: "#EF4444",
            color: "#fff",
          },
        });
        dispatch(removeProduct(product._id));
      } catch (error) {
        console.error("Delete error:", error.response?.data || error.message);
        toast.error(
          error.response?.data?.message || "Failed to delete product"
        );
      }
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      {/* <Hero /> */}

      <div className="products-container">
        <div className="products-header">
          <h1 className="products-title">
            <span className="title-gradient">Our Products</span>
          </h1>
          <p className="products-subtitle">
            Discover our carefully curated collection of premium products
          </p>
        </div>

        {products?.length > 0 ? (
          <div className="products-grid">
            {products.map((product, index) => (
              <div key={product._id} className="product-card">
                {/* Wishlist Button */}
                {/* <button
                  className={`wishlist-btn ${
                    wishlistItems.has(product._id) ? "active" : ""
                  }`}
                  onClick={() => toggleWishlist(product._id)}
                >
                  <Heart
                    size={20}
                    fill={wishlistItems.has(product._id) ? "#EF4444" : "none"}
                  />
                </button> */}
                {/* Product Image */}
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-image"
                    onClick={() => navigate(`/details/${product._id}`)}
                  />
                  <div className="image-overlay">
                    <button
                      className="view-details-btn"
                      onClick={() => navigate(`/details/${product._id}`)}
                    >
                      <Eye size={18} />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
                {/* Product Info */}
                <div className="product-info">
                  <div className="product-category">{product.category}</div>

                  <h3 className="product-title">{product.title}</h3>
                  <div className="weight-section">
                    <span className="weight">Weight in grams</span>
                    <span className="weight-value">
                      {product.weightInGrams}
                    </span>
                  </div>
                  {/* Rating (you can make this dynamic based on your data) */}
                  {/* <div className="product-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < 4 ? "#FCD34D" : "none"}
                        color={i < 4 ? "#FCD34D" : "#D1D5DB"}
                      />
                    ))}
                    <span className="rating-text">(4.0)</span>
                  </div> */}

                  <div className="product-footer">
                    <div className="price-section">
                      <span className="currency">Rs</span>
                      <span className="price">
                        {product.finalPrice ?? product.price}
                      </span>
                    </div>

                    <button
                      className={`add-to-cart-btn ${
                        addedItems.has(product._id) ? "added" : ""
                      }`}
                      onClick={() => handleAddToCart(product)}
                    >
                      {addedItems.has(product._id) ? (
                        <>
                          <CheckCircle size={18} />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Admin Controls */}
                  {role === "admin" && (
                    <div className="admin-controls">
                      <button
                        className="admin-btn edit-btn"
                        onClick={() => navigate(`/edit/${product._id}`)}
                      >
                        <Edit3 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="admin-btn delete-btn"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ShoppingCart size={64} color="#D1D5DB" />
            </div>
            <h3>No products available</h3>
            <p>Check back later for new products!</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Products;
