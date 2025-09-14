import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
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

  const [productData, setProductData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    sizes: [], // Array of { size, stock, _id } objects
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API}/auth/product/${id}`, {
          withCredentials: true,
        });
        setProductData({
          ...response.data,
          price: response.data.price || "", // Ensure price is a string for input
          sizes: response.data.sizes || [], // Ensure sizes is an array
        });
      } catch (error) {
        toast.error("Failed to load product", {
          id: `load-error-${id}`,
        });
      }
    };

    fetchProduct();
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

  // Handle changes to size and stock inputs
  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...productData.sizes];
    updatedSizes[index] = {
      ...updatedSizes[index],
      [field]: field === "size" ? Number(value) : Number(value) || 0,
    };
    setProductData({ ...productData, sizes: updatedSizes });
  };

  // Add a new size-stock pair
  const addSize = () => {
    setProductData({
      ...productData,
      sizes: [...productData.sizes, { size: "", stock: 0 }],
    });
  };

  // Remove a size-stock pair
  const removeSize = (index) => {
    const updatedSizes = productData.sizes.filter((_, i) => i !== index);
    setProductData({ ...productData, sizes: updatedSizes });
  };

  const handleUpdate = async () => {
    setTouched(true);

    // Validate required fields
    if (
      isFieldEmpty(productData.title) ||
      isFieldEmpty(productData.description) ||
      isFieldEmpty(productData.category) ||
      isFieldEmpty(productData.price) ||
      productData.sizes.length === 0 ||
      productData.sizes.some((s) => isFieldEmpty(s.size) || s.stock < 0)
    ) {
      toast.error(
        "Please fill all required fields and ensure valid sizes/stocks",
        {
          id: `validation-error-${id}`,
        }
      );
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
          formData,
          {
            withCredentials: true,
          }
        );

        imageUrl = fileUploadResponse.data.url;
      }

      const finalData = {
        ...productData,
        image: imageUrl,
        price: Number(productData.price) || 0,
        sizes: productData.sizes.map(({ size, stock, _id }) => ({
          size: Number(size),
          stock: Number(stock),
          _id, // Preserve _id if it exists
        })),
      };

      await axios.put(`${API}/admin/${id}`, finalData, {
        withCredentials: true,
      });

      toast.success("Product updated successfully", {
        id: `update-success-${id}`,
      });
      setTimeout(() => {
        navigate(-1); // Navigate to products page after 500ms
      }, 500);
    } catch (error) {
      toast.error("Update failed", {
        id: `update-error-${id}`,
      });
      // console.log(
      //   "Error updating product:",
      //   error.response?.data || error.message
      // );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Navbar /> {/* Added Navbar */}
      <div className="max-w-md mx-auto p-4 w-full">
        <h2 className="text-xl font-semibold mb-4">Edit Shoe Product</h2>

        {/* File Input */}
        <input
          type="file"
          accept="image/*"
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
        {touched && isFieldEmpty(productData.title) && (
          <div className="text-red-600 text-sm mb-2">Title is required</div>
        )}

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
        {touched && isFieldEmpty(productData.description) && (
          <div className="text-red-600 text-sm mb-2">
            Description is required
          </div>
        )}

        {/* Category */}
        <input
          type="text"
          placeholder="Category (e.g., Sneakers)"
          name="category"
          value={productData.category}
          onChange={handleProductDataChange}
          className={`w-full mb-1 p-2 rounded ${
            touched && isFieldEmpty(productData.category)
              ? "border border-red-500"
              : "border"
          }`}
        />
        {touched && isFieldEmpty(productData.category) && (
          <div className="text-red-600 text-sm mb-2">Category is required</div>
        )}

        {/* Price */}
        <input
          type="number"
          placeholder="Price"
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

        {/* Sizes and Stock */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sizes and Stock
          </label>
          {productData.sizes.map((sizeObj, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="number"
                placeholder="Size (e.g., 40)"
                value={sizeObj.size}
                onChange={(e) =>
                  handleSizeChange(index, "size", e.target.value)
                }
                className={`w-1/2 p-2 rounded ${
                  touched && isFieldEmpty(sizeObj.size)
                    ? "border border-red-500"
                    : "border"
                }`}
              />
              <input
                type="number"
                placeholder="Stock"
                value={sizeObj.stock}
                onChange={(e) =>
                  handleSizeChange(index, "stock", e.target.value)
                }
                className={`w-1/2 p-2 rounded ${
                  touched && sizeObj.stock < 0
                    ? "border border-red-500"
                    : "border"
                }`}
              />
              <button
                onClick={() => removeSize(index)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          {touched && productData.sizes.length === 0 && (
            <div className="text-red-600 text-sm mb-2">
              At least one size is required
            </div>
          )}
          <button
            onClick={addSize}
            className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Size
          </button>
        </div>

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
            onClick={() => navigate("/products")}
            className="w-full mt-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditData;
