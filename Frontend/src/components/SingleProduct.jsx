import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle,
  Plus,
  Minus,
} from "lucide-react";
import { add } from "../redux/features/navbar/navbarSlice";
import toast, { Toaster } from "react-hot-toast";

function SingleProduct(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  const product = props.productDetails;

  // Early return if product not yet loaded
  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  const productImages = [product.image];

  // Handlers
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size first", {
        style: {
          borderRadius: "12px",
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
    if (!sizeInfo || sizeInfo.stock < quantity) {
      toast.error("Not enough stock available", {
        style: {
          borderRadius: "12px",
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
      quantity,
    };

    dispatch(add(cartItem));
    setIsAdded(true);

    toast.success(`Added ${quantity} item(s) to cart!`, {
      icon: "🛒",
      style: {
        borderRadius: "12px",
        background: "#10B981",
        color: "#fff",
        fontWeight: "600",
      },
      duration: 3000,
    });

    setTimeout(() => setIsAdded(false), 3000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size first", {
        style: {
          borderRadius: "12px",
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
    if (!sizeInfo || sizeInfo.stock < quantity) {
      toast.error("Not enough stock available", {
        style: {
          borderRadius: "12px",
          background: "#EF4444",
          color: "#fff",
          fontWeight: "600",
        },
      });
      return;
    }

    navigate("/checkout");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
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
    const maxStock =
      product.sizes?.find((s) => s.size === Number(selectedSize))?.stock || 1;
    if (quantity < maxStock) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="text-sm font-medium">Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images Section */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={product.title}
                className="w-full h-[400px] object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {productImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${
                    selectedImage === index
                      ? "border-blue-500"
                      : "border-transparent"
                  } hover:border-blue-300 transition-all duration-200`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-sm text-gray-500 uppercase font-medium">
                  {product.brand || "Premium Brand"} • {product.category}
                </span>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">
                  {product.title}
                </h1>
              </div>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <Share2 size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Price Section */}
            <div className="mb-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-semibold text-gray-900">
                  Rs {product.finalPrice ?? product.price}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Description
              </h3>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label
                  htmlFor="size-selector"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Size
                </label>
                <select
                  id="size-selector"
                  value={selectedSize}
                  onChange={(e) => {
                    setSelectedSize(e.target.value);
                    setQuantity(1);
                  }}
                  className="w-full max-w-xs p-2 border rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="" disabled>
                    Choose a size
                  </option>
                  {product.sizes.map((s, idx) => (
                    <option key={idx} value={s.size}>
                      {s.size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity and Actions */}
            {selectedSize && (
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 text-gray-900 font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="p-2 text-gray-600 hover:text-gray-800"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className={`flex items-center justify-center px-6 py-3 rounded-md text-white font-medium transition-all duration-200 ${
                      isAdded ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle size={20} className="mr-2" />
                        Added!
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} className="mr-2" />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="px-6 py-3 rounded-md bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all duration-200"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleProduct;
