import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";

const EditData = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [touched, setTouched] = useState(false);

  const API =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_PROD
      : import.meta.env.VITE_API_DEV;

  const [goldRate, setGoldRate] = useState(0);

  const [productData, setProductData] = useState({
    title: "",
    price: 0,
    description: "",
    category: "",
    rating: {},
    image: "",
    weightInGrams: "",
    makingCharges: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API}/auth/product/${id}`);
        setProductData(response.data);
      } catch (error) {
        toast.error("Failed to load product");
      }
    };

    const fetchGoldRate = async () => {
      try {
        const response = await axios.get(`${API}/auth/gold-rate`); // ✅ same API as GoldRateManager
        setGoldRate(response.data?.rate || 0);
      } catch (error) {
        toast.error("Failed to load gold rate");
        setGoldRate(0);
      }
    };

    fetchProduct();
    fetchGoldRate();
  }, [id]);

  const isFieldEmpty = (field) => !field || field.toString().trim() === "";

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleProductDataChange = (event) => {
    setProductData({
      ...productData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = async () => {
    setTouched(true);

    if (
      isFieldEmpty(productData.title) ||
      isFieldEmpty(productData.description) ||
      isFieldEmpty(productData.category)
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setUploading(true);

    try {
      let imageUrl = productData.image;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const fileUploadResponse = await axios.post(
          `${API}/admin/upload`,
          formData
        );

        imageUrl = fileUploadResponse.data.url;
      }

      // ✅ Auto-calculate price for gold
      let finalData = { ...productData, image: imageUrl };
      if (productData.category.toLowerCase() === "gold") {
        finalData.price =
          (Number(productData.weightInGrams) || 0) * goldRate +
          (Number(productData.makingCharges) || 0);
      } else {
        // For non-gold, keep manual price but store preview total
        finalData.price =
          (Number(productData.price) || 0) +
          (Number(productData.makingCharges) || 0);
      }

      await axios.put(`${API}/admin/${id}`, finalData);

      toast.success("Product updated successfully");
      navigate("/"); // or products listing
    } catch (error) {
      toast.error("Update failed");
      console.log(
        "Error updating product:",
        error.response?.data || error.message
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 w-full">
      <Toaster />
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

      {/* File Input */}
      <input
        type="file"
        onChange={handleFileChange}
        className={`w-full mb-1 p-2 rounded ${
          touched && !productData.image && !file
            ? "border border-red-500"
            : "border"
        }`}
      />
      {touched && !productData.image && !file && (
        <div className="text-red-600 text-sm mb-2">Image is required</div>
      )}

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        name="title"
        value={productData.title}
        onChange={handleProductDataChange}
        className={`w-full mb-1 p-2 rounded ${
          touched && isFieldEmpty(productData.title)
            ? "border border-red-500"
            : "border"
        }`}
      />

      {/* Description */}
      <input
        type="text"
        placeholder="Description"
        name="description"
        value={productData.description}
        onChange={handleProductDataChange}
        className={`w-full mb-1 p-2 rounded ${
          touched && isFieldEmpty(productData.description)
            ? "border border-red-500"
            : "border"
        }`}
      />

      {/* Category */}
      <input
        type="text"
        placeholder="Category"
        name="category"
        value={productData.category}
        onChange={handleProductDataChange}
        className={`w-full mb-1 p-2 rounded ${
          touched && isFieldEmpty(productData.category)
            ? "border border-red-500"
            : "border"
        }`}
      />

      {/* Common Fields */}
      <input
        type="number"
        placeholder="Weight in grams"
        name="weightInGrams"
        value={productData.weightInGrams}
        onChange={handleProductDataChange}
        className="w-full mb-2 p-2 rounded border"
      />

      <input
        type="number"
        placeholder="Making Charges"
        name="makingCharges"
        value={productData.makingCharges}
        onChange={handleProductDataChange}
        className="w-full mb-2 p-2 rounded border"
      />

      {/* Price Handling */}
      {productData.category.toLowerCase() === "gold" ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Current Gold Rate:</span>
            <span className="text-yellow-600 font-bold">{goldRate} / gram</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Calculated Price:</span>
            <span className="text-green-600 font-bold">
              {(Number(productData.weightInGrams) || 0) * goldRate +
                (Number(productData.makingCharges) || 0)}
            </span>
          </div>
        </>
      ) : (
        <>
          {/* Editable Price Input */}
          <input
            type="number"
            placeholder="Base Price"
            name="price"
            value={productData.price}
            onChange={handleProductDataChange}
            className={`w-full mb-1 p-2 rounded ${
              touched && isFieldEmpty(productData.price)
                ? "border border-red-500"
                : "border"
            }`}
          />
          {touched && isFieldEmpty(productData.price) && (
            <div className="text-red-600 text-sm mb-2">Price is required</div>
          )}

          {/* Preview Total */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Final Price (Price + Making):</span>
            <span className="text-green-600 font-bold">
              {(Number(productData.price) || 0) +
                (Number(productData.makingCharges) || 0)}
            </span>
          </div>
        </>
      )}

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        disabled={uploading}
        className={`w-full mt-3 p-2 ${
          uploading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        } text-white rounded font-semibold`}
      >
        {uploading ? "Updating..." : "Update Product"}
      </button>

      {/* Cancel Button */}
      <div className="px-5">
        <button
          onClick={() => navigate("/")}
          className="w-full mt-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditData;
