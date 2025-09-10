
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

// ✅ Get cart key for the current user
function getUserCartKey() {
  const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user
  return user ? `cart_${user._id}` : "cart_guest"; // Use user-specific key
}

// ✅ Fetch cart from localStorage
function fetchFromLocalStorage() {
  let value = localStorage.getItem(getUserCartKey());
  return value ? JSON.parse(value) : []; // Return cart or empty array
}

// ✅ Store cart in localStorage
function storeInLocalStorage(data) {
  localStorage.setItem(getUserCartKey(), JSON.stringify(data));
}

const initialState = {
  value: fetchFromLocalStorage(),
};

export const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    add: (state, action) => {
      const existingProduct = state.value.find(
        (eachProduct) => eachProduct._id === action.payload._id
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.value.push({ ...action.payload, quantity: 1 });
      }

      storeInLocalStorage(state.value);
      toast.success("Product added to Cart!");
    },

    remove: (state, action) => {
      state.value = state.value.filter(
        (product) => product._id !== action.payload
      );
      storeInLocalStorage(state.value);
      toast.success("Product removed from Cart!");
    },

    removeOne: (state, action) => {
      const product = state.value.find((p) => p._id === action.payload);
      if (product && product.quantity > 1) {
        product.quantity -= 1;
        storeInLocalStorage(state.value);
        toast.success("Product quantity decreased!");
      }
    },

    clearCart: (state) => {
      state.value = [];
      storeInLocalStorage(state.value);
      toast.success("Cart is cleared!");
    },

    // ✅ Logout function to clear user data + cart
    logoutUser: (state) => {
      // localStorage.removeItem(getUserCartKey()); // Remove cart for user
      localStorage.removeItem("user"); // Remove user data
      // state.value = []; // Clear Redux state
      toast.success("User logged out!");
    },
  },
});

export const { add, remove, removeOne, clearCart, logoutUser } =
  navbarSlice.actions;

export default navbarSlice.reducer;
