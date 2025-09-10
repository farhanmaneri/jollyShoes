import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  Share2,
  ArrowLeft,
  CheckCircle,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { add } from "../redux/features/navbar/navbarSlice";
import toast, { Toaster } from "react-hot-toast";

import "../styles/SingleProduct.css";

function SingleProduct(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock additional images - you can make this dynamic based on your data
  const productImages = [
    props.productDetails.image,
    // props.productDetails.image, // Add more images if available
    // props.productDetails.image,
    // props.productDetails.image,
  ];

  const handleAddToCart = () => {
    // Add multiple quantities if selected
    for (let i = 0; i < quantity; i++) {
      dispatch(add(props.productDetails));
    }

    setIsAdded(true);
    toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart!`, {
      icon: "🛒",
      style: {
        borderRadius: "12px",
        background: "#10B981",
        color: "#fff",
        fontWeight: "600",
      },
      duration: 3000,
    });

    // Reset the added state after 3 seconds
    setTimeout(() => setIsAdded(false), 3000);
  };
// const handleBuyNow = () => Navigate("/checkout");
const handleBuyNow = () => navigate("/checkout");
  // const handleWishlist = () => {
  //   setIsWishlisted(!isWishlisted);
  //   toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
  //     icon: isWishlisted ? "💔" : "❤️",
  //     style: {
  //       borderRadius: "12px",
  //       background: isWishlisted ? "#EF4444" : "#EC4899",
  //       color: "#fff",
  //       fontWeight: "600",
  //     },
  //   });
  // };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: props.productDetails.title,
        text: props.productDetails.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!", {
        icon: "🔗",
        style: {
          borderRadius: "12px",
          background: "#3B82F6",
          color: "#fff",
          fontWeight: "600",
        },
      });
    }
  };

  const increaseQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="single-product-container">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        <div className="product-detail-wrapper">
          {/* Product Images Section */}
          <div className="product-images-section">
            <div className="main-image-container">
              <img
                src={productImages[selectedImage]}
                alt={props.productDetails.title}
                className="main-product-image"
              />
              {/* <button
                className={`wishlist-btn-detail ${
                  isWishlisted ? "active" : ""
                }`}
                onClick={handleWishlist}
              >
                <Heart size={24} fill={isWishlisted ? "#EF4444" : "none"} />
              </button> */}
            </div>

            <div className="thumbnail-images">
              {productImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${props.productDetails.title} ${index + 1}`}
                  className={`thumbnail ${
                    selectedImage === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="product-details-section">
            <div className="product-header-detail">
              <div className="brand-category">
                <span className="brand">
                  {props.productDetails.brand || "Premium Brand"}
                </span>
                <span className="category-badge">
                  {props.productDetails.category}
                </span>
              </div>

              <button className="share-button" onClick={handleShare}>
                <Share2 size={20} />
              </button>
            </div>

            <h1 className="product-title-detail">
              {props.productDetails.title}
            </h1>

            {/* Rating Section */}
            {/* <div className="rating-section">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={i < 4 ? "#FCD34D" : "none"}
                    color={i < 4 ? "#FCD34D" : "#D1D5DB"}
                  />
                ))}
              </div>
              <span className="rating-text">(4.0) • 127 reviews</span>
            </div> */}

            {/* Price Section */}
            <div className="price-section-detail">
              <div className="current-price">
                <span className="currency">Rs</span>
                <span className="price">
                  {props.productDetails.finalPrice ??
                    props.productDetails.price}
                </span>
              </div>

              <div className="product-weight">
                <small>
                  Weight: {props.productDetails.weightInGrams} grams
                </small>
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <h3>Description</h3>
              <p>"{props.productDetails.description}"</p>
            </div>

            {/* Features */}
            {/* <div className="features-section">
              <div className="feature-item">
                <Truck size={20} />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="feature-item">
                <Shield size={20} />
                <span>2 year warranty included</span>
              </div>
              <div className="feature-item">
                <RotateCcw size={20} />
                <span>30-day return policy</span>
              </div>
            </div> */}

            {/* Quantity and Add to Cart */}
            <div className="purchase-section">
              <div className="quantity-selector">
                <span className="quantity-label">Quantity:</span>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={increaseQuantity}
                    disabled={quantity >= 10}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className={`add-to-cart-btn-detail ${isAdded ? "added" : ""}`}
                  onClick={handleAddToCart}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle size={20} />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button onClick={handleBuyNow} className="buy-now-btn">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="stock-info">
              <div className="stock-indicator in-stock">
                <div className="stock-dot"></div>
                <span>In Stock - Ready to ship</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleProduct;
