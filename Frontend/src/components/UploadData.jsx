import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";

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

  const [goldRate, setGoldRate] = useState(0);

const [productData, setProductData] = useState({
  title: "",
  description: "",
  category: "",
  image: "",
  weightInGrams: "", // 👈 empty string, not 0
  makingCharges: "",
  price: "",
});

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setCroppedFile(null); // reset previous crop
    } else {
      setFile(null);
      setPreview("");
    }
  };

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const applyCrop = async () => {
    try {
      const cropped = await getCroppedImg(preview, croppedAreaPixels, zoom);
      setCroppedFile(cropped);
      toast.success("Crop applied!");
    } catch (e) {
      console.error("Crop failed", e);
      toast.error("Failed to crop image");
    }
  };

  const handleProductDataChange = (event) => {
    setProductData({
      ...productData,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setProductData({
      title: "",
      description: "",
      category: "",
      weightInGrams: 0,
      makingCharges: 0,
      price: 0,
      rating: {},
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

  const API =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_PROD
      : import.meta.env.VITE_API_DEV;

const handleUpload = async () => {
  setTouched(true);

  // Basic validation
  if (
    isFieldEmpty(productData.title) ||
    isFieldEmpty(productData.description) ||
    isFieldEmpty(productData.category) ||
    (!file && !croppedFile)
  ) {
    toast.error("Please fill all fields and select/crop an image");
    return;
  }

  // Gold items: must have weight
  if (
    productData.category.toLowerCase() === "gold" &&
    (!productData.weightInGrams || productData.weightInGrams <= 0)
  ) {
    toast.error("Please enter weight for gold items");
    return;
  }

  setUploading(true);
  try {
    const formData = new FormData();
    formData.append("file", croppedFile || file);

    const fileUploadResponse = await axios.post(
      `${API}/admin/upload`,
      formData
    );

    const url = fileUploadResponse.data.url;
    if (!url) throw new Error("File upload failed, no URL received.");

    // Build final product data
    let finalData = { ...productData, image: url };

    if (productData.category.toLowerCase() === "gold") {
  finalData.price =
    productData.weightInGrams * goldRate +
    (Number(productData.makingCharges) || 0);
} else {
  finalData.price =
    (Number(productData.price) || 0) +
    (Number(productData.makingCharges) || 0);
}


    await axios.post(`${API}/admin`, finalData);

    toast.success("Product uploaded successfully");
    resetForm();
  } catch (error) {
    toast.error("Failed to upload");
    console.error(
      "Error uploading file or product:",
      error.response?.data || error.message
    );
  } finally {
    setUploading(false);
  }
};

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await axios.get(`${API}/auth/gold-rate`);
        setGoldRate(res.data?.rate || 0);
      } catch {
        toast.error("Failed to fetch gold rate");
      }
    };
    fetchRate();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 w-full">
      <Toaster />

      {/* File input */}
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className={`w-full mb-2 ${
          touched && !file ? "border border-red-500" : "border"
        } p-2 rounded`}
      />
      {touched && !file && (
        <div className="text-red-600 text-sm mb-2">Please select an image</div>
      )}

      {/* Cropper UI */}
      {preview && !croppedFile && (
        <>
          <div className="relative w-full h-64 bg-gray-200 mb-2">
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

          {/* Zoom slider */}
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-full mb-2"
          />

          <button
            onClick={applyCrop}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 mb-3 rounded"
          >
            Apply Crop
          </button>
        </>
      )}

      {/* Cropped preview */}
      {croppedFile && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold">Cropped Preview:</h4>
          <img
            src={URL.createObjectURL(croppedFile)}
            alt="cropped"
            className="w-full h-40 object-cover rounded border"
          />
        </div>
      )}

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        name="title"
        value={productData.title}
        onChange={handleProductDataChange}
        className={`w-full mb-2 p-2 rounded border ${
          touched && isFieldEmpty(productData.title) ? "border-red-500" : ""
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
        className={`w-full mb-2 p-2 rounded border ${
          touched && isFieldEmpty(productData.description)
            ? "border-red-500"
            : ""
        }`}
      />
      {touched && isFieldEmpty(productData.description) && (
        <div className="text-red-600 text-sm mb-2">Description is required</div>
      )}

{/* Category */}
<input
  type="text"
  placeholder="Category"
  name="category"
  value={productData.category}
  onChange={handleProductDataChange}
  className={`w-full mb-2 p-2 rounded border ${
    touched && isFieldEmpty(productData.category) ? "border-red-500" : ""
  }`}
/>
{touched && isFieldEmpty(productData.category) && (
  <div className="text-red-600 text-sm mb-2">Category is required</div>
)}

{/* Common fields for all categories */}
<input
  type="number"
  placeholder="Weight in grams"
  value={productData.weightInGrams}
  onChange={(e) =>
    setProductData({ ...productData, weightInGrams: e.target.value })
  }
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

{/* Price section */}
{/* Price section */}
{productData.category.toLowerCase() === "gold" ? (
  <>
    <div className="flex items-center justify-between mb-2">
      <span className="font-medium">Current Gold Rate:</span>
      <span className="text-yellow-600 font-bold">{goldRate} / gram</span>
    </div>

    <input
      type="number"
      value={
        productData.weightInGrams * goldRate +
        (Number(productData.makingCharges) || 0)
      }
      readOnly
      className="w-full mb-2 p-2 rounded border bg-gray-100 text-green-600 font-bold"
    />
  </>
) : (
  <>
    {/* Manual base price input */}
    <input
      type="number"
      placeholder="Base Price (without making charges)"
      name="price"
      value={productData.price}
      onChange={handleProductDataChange}
      className={`w-full mb-2 p-2 rounded border ${
        touched && isFieldEmpty(productData.price) ? "border-red-500" : ""
      }`}
    />

    {/* Final calculated price (read-only) */}
    <input
      type="number"
      value={
        (Number(productData.price) || 0) +
        (Number(productData.makingCharges) || 0)
      }
      readOnly
      className="w-full mb-2 p-2 rounded border bg-gray-100 text-green-600 font-bold"
    />
  </>
)}


      {/* Submit */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`w-full mt-3 p-2 ${
          uploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        } text-white rounded font-semibold`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadData;
