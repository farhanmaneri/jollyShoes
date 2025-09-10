import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar"

const GoldRateManager = () => {
  const [rate, setRate] = useState("");
  const [currentRate, setCurrentRate] = useState(null);
  const [loading, setLoading] = useState(false);

  const API =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_PROD
      : import.meta.env.VITE_API_DEV;

  // Fetch current gold rate on mount
  useEffect(() => {
    fetchRate();
  }, []);

  const fetchRate = async () => {
    try {
      const res = await axios.get(`${API}/auth/gold-rate`);
      setCurrentRate(res.data?.rate || 0);
    } catch {
      toast.error("Failed to fetch gold rate");
    }
  };

  const handleUpdateRate = async () => {
    if (!rate || Number(rate) <= 0) {
      toast.error("Please enter a valid gold rate");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/admin/gold-rate`, { rate: Number(rate) });
      toast.success("Gold rate updated successfully ✅");
      setRate("");
      fetchRate(); // Refresh current rate after update
    } catch (err) {
      console.error(err);
      toast.error("Failed to update gold rate ❌");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="max-w-md mx-auto p-4">
      <Toaster />

      <h2 className="text-xl font-semibold mb-4">Gold Rate Manager</h2>

      {/* Input */}
      <input
        type="number"
        placeholder="Enter new gold rate"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
        className="w-full mb-3 p-2 rounded border"
      />

      {/* Submit button */}
      <button
        onClick={handleUpdateRate}
        disabled={loading}
        className={`w-full py-2 mb-4 rounded font-semibold text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Updating..." : "Update Rate"}
      </button>

      {/* Current rate display */}
      <div className="p-3 rounded bg-gray-100 border text-center">
        <span className="font-medium">Current Gold Rate: </span>
        <span className="text-yellow-600 font-bold">
          {currentRate ? `${currentRate} per gram` : "Not available"}
        </span>
      </div>
    </div>
  );
};

export default GoldRateManager;
