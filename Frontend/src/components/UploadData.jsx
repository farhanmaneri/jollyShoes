import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";
import { MdImage, MdAddCircle, MdRemoveCircle } from "react-icons/md";

const UploadData = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [touched, setTouched] = useState(false);

  // Cropper states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);

  // Product data with sizes array
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    sizes: [{ size: "", stock: "" }],
    image: "",
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setCroppedFile(null); // Reset previous crop
      setTouched(true);
    } else {
      setFile(null);
      setPreview("");
      setCroppedFile(null);
    }
  };

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const applyCrop = async () => {
    try {
      const cropped = await getCroppedImg(preview, croppedAreaPixels, zoom);
      setCroppedFile(cropped);
      toast.success("Crop applied!", {
        style: {
          borderRadius: "10px",
          background: "#10B981",
          color: "#fff",
          fontWeight: "600",
        },
      });
    } catch (e) {
      // console.error("Crop failed", e);
      toast.error("Failed to crop image", {
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
          fontWeight: "600",
        },
      });
    }
  };

  const handleProductDataChange = (event) => {
    setProductData({
      ...productData,
      [event.target.name]: event.target.value,
    });
    setTouched(true);
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...productData.sizes];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setProductData({ ...productData, sizes: updatedSizes });
    setTouched(true);
  };

  const addSizeField = () => {
    setProductData({
      ...productData,
      sizes: [...productData.sizes, { size: "", stock: "" }],
    });
  };

  const removeSizeField = (index) => {
    if (productData.sizes.length > 1) {
      const updatedSizes = productData.sizes.filter((_, i) => i !== index);
      setProductData({ ...productData, sizes: updatedSizes });
    }
  };

  const resetForm = () => {
    setProductData({
      title: "",
      description: "",
      category: "",
      brand: "",
      price: "",
      sizes: [{ size: "", stock: "" }],
      image: "",
    });
    setFile(null);
    setPreview("");
    setCroppedFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setTouched(false);
  };

  const isFieldEmpty = (field) => !field || field.toString().trim() === "";

  const validateSizes = () => {
    return (
      productData.sizes.length > 0 &&
      productData.sizes.every(
        (s) =>
          !isFieldEmpty(s.size) &&
          !isFieldEmpty(s.stock) &&
          Number(s.size) > 0 &&
          Number(s.stock) >= 0
      )
    );
  };

  const API =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_PROD
      : import.meta.env.VITE_API_DEV;

  const handleUpload = async () => {
    setTouched(true);

    // Validation
    if (
      isFieldEmpty(productData.title) ||
      isFieldEmpty(productData.description) ||
      isFieldEmpty(productData.category) ||
      isFieldEmpty(productData.price) ||
      (!file && !croppedFile) ||
      !validateSizes()
    ) {
      toast.error(
        "Please fill all required fields and add at least one valid size with stock",
        {
          style: {
            borderRadius: "10px",
            background: "#EF4444",
            color: "#fff",
            fontWeight: "600",
          },
        }
      );
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", croppedFile || file);

      const fileUploadResponse = await axios.post(
        `${API}/admin/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const url = fileUploadResponse.data.url;
      if (!url) throw new Error("File upload failed, no URL received.");

      // Build final product data
      const finalData = {
        ...productData,
        image: url,
        price: Number(productData.price),
        sizes: productData.sizes.map((s) => ({
          size: Number(s.size),
          stock: Number(s.stock),
        })),
      };

      await axios.post(`${API}/admin`, finalData);

      toast.success("Product uploaded successfully!", {
        style: {
          borderRadius: "10px",
          background: "#10B981",
          color: "#fff",
          fontWeight: "600",
        },
      });
      resetForm();
    } catch (error) {
      toast.error("Failed to upload product", {
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
          fontWeight: "600",
        },
      });
      console.error(
        "Error uploading file or product:",
        error.response?.data || error.message
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MdImage className="text-indigo-600" />
        Upload New Shoe Product
      </h2>

      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        {/* File input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              touched && !file && !croppedFile
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {touched && !file && !croppedFile && (
            <p className="text-red-500 text-sm mt-1">Please select an image</p>
          )}
        </div>

        {/* Cropper UI */}
        {preview && !croppedFile && (
          <div className="mb-4">
            <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full mt-2"
            />
            <button
              onClick={applyCrop}
              className="w-full mt-2 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Apply Crop
            </button>
          </div>
        )}

        {/* Cropped preview */}
        {croppedFile && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Cropped Preview
            </h4>
            <img
              src={URL.createObjectURL(croppedFile)}
              alt="Cropped product"
              className="w-full h-40 object-cover rounded-lg border border-gray-300"
            />
          </div>
        )}

        {/* Product Form */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter product title"
              name="title"
              value={productData.title}
              onChange={handleProductDataChange}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                touched && isFieldEmpty(productData.title)
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {touched && isFieldEmpty(productData.title) && (
              <p className="text-red-500 text-sm mt-1">Title is required</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter product description"
              name="description"
              value={productData.description}
              onChange={handleProductDataChange}
              rows="4"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                touched && isFieldEmpty(productData.description)
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {touched && isFieldEmpty(productData.description) && (
              <p className="text-red-500 text-sm mt-1">
                Description is required
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              placeholder="Enter category (e.g., Sneakers, Boots)"
              name="category"
              value={productData.category}
              onChange={handleProductDataChange}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                touched && isFieldEmpty(productData.category)
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {touched && isFieldEmpty(productData.category) && (
              <p className="text-red-500 text-sm mt-1">Category is required</p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <input
              type="text"
              placeholder="Enter brand (e.g., Nike, Adidas)"
              name="brand"
              value={productData.brand}
              onChange={handleProductDataChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (Rs)
            </label>
            <input
              type="number"
              placeholder="Enter base price"
              name="price"
              value={productData.price}
              onChange={handleProductDataChange}
              min="0"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                touched && isFieldEmpty(productData.price)
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {touched && isFieldEmpty(productData.price) && (
              <p className="text-red-500 text-sm mt-1">Price is required</p>
            )}
          </div>

          {/* Sizes and Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sizes and Stock
            </label>
            {productData.sizes.map((sizeObj, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Size (e.g., 40)"
                  value={sizeObj.size}
                  onChange={(e) =>
                    handleSizeChange(index, "size", e.target.value)
                  }
                  min="1"
                  className={`w-1/2 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    touched && isFieldEmpty(sizeObj.size)
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={sizeObj.stock}
                  onChange={(e) =>
                    handleSizeChange(index, "stock", e.target.value)
                  }
                  min="0"
                  className={`w-1/2 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    touched && isFieldEmpty(sizeObj.stock)
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {productData.sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSizeField(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <MdRemoveCircle size={20} />
                  </button>
                )}
              </div>
            ))}
            {touched && !validateSizes() && (
              <p className="text-red-500 text-sm mt-1">
                At least one valid size and stock is required
              </p>
            )}
            <button
              type="button"
              onClick={addSizeField}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mt-2 text-sm transition-colors duration-200"
            >
              <MdAddCircle size={20} />
              Add Size
            </button>
          </div>

          {/* Submit */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full mt-4 bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base`}
          >
            <MdImage />
            {uploading ? "Uploading..." : "Upload Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadData;
