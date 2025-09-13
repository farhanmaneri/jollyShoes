import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

// Get cart key for the current user
function getUserCartKey() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? `cart_${user._id}` : "cart_guest";
}

// Fetch cart from localStorage
function fetchFromLocalStorage() {
  let value = localStorage.getItem(getUserCartKey());
  return value ? JSON.parse(value) : [];
}

// Store cart in localStorage
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
      const { _id, selectedSize, quantity, sizes, ...product } = action.payload;
      const existingProduct = state.value.find(
        (eachProduct) =>
          eachProduct._id === _id && eachProduct.selectedSize === selectedSize
      );

      if (existingProduct) {
        existingProduct.quantity += quantity || 1;
      } else {
        state.value.push({
          _id,
          selectedSize,
          quantity: quantity || 1,
          sizes,
          ...product,
        });
      }

      storeInLocalStorage(state.value);
    },

    remove: (state, action) => {
      const { _id, selectedSize } = action.payload;
      state.value = state.value.filter(
        (product) =>
          !(product._id === _id && product.selectedSize === selectedSize)
      );
      storeInLocalStorage(state.value);
      toast.success("Product removed from Cart!", {
        id: `remove-${_id}-${selectedSize}`,
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
          fontWeight: "600",
        },
      });
    },

    removeOne: (state, action) => {
      const { _id, selectedSize } = action.payload;
      const product = state.value.find(
        (p) => p._id === _id && p.selectedSize === selectedSize
      );

      if (product && product.quantity > 1) {
        product.quantity -= 1;
        storeInLocalStorage(state.value);
        toast.success("Product quantity decreased!", {
          id: `remove-one-${_id}-${selectedSize}`,
          style: {
            borderRadius: "10px",
            background: "#10B981",
            color: "#fff",
            fontWeight: "600",
          },
        });
      } else if (product) {
        state.value = state.value.filter(
          (p) => !(p._id === _id && p.selectedSize === selectedSize)
        );
        storeInLocalStorage(state.value);
        toast.success("Product removed from Cart!", {
          id: `remove-last-${_id}-${selectedSize}`,
          style: {
            borderRadius: "10px",
            background: "#EF4444",
            color: "#fff",
            fontWeight: "600",
          },
        });
      }
    },

    clearCart: (state) => {
      state.value = [];
      storeInLocalStorage(state.value);
      toast.success("Cart is cleared!", {
        id: "clear-cart",
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
          fontWeight: "600",
        },
      });
    },

    logoutUser: (state) => {
      localStorage.removeItem(getUserCartKey());
      localStorage.removeItem("user");
      state.value = [];
      toast.success("User logged out!", {
        id: "logout-user",
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
          fontWeight: "600",
        },
      });
    },
  },
});

export const { add, remove, removeOne, clearCart, logoutUser } =
  navbarSlice.actions;

export default navbarSlice.reducer;