import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

// Get cart key for the current user
function getUserCartKey() {
  const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user
  return user ? `cart_${user._id}` : "cart_guest"; // Use user-specific key
}

// Fetch cart from localStorage
function fetchFromLocalStorage() {
  let value = localStorage.getItem(getUserCartKey());
  return value ? JSON.parse(value) : []; // Return cart or empty array
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

      const sizeInfo = sizes?.find((s) => s.size === Number(selectedSize));
      const stock = sizeInfo ? sizeInfo.stock : 0;

      if (
        !sizeInfo ||
        stock <
          (existingProduct
            ? existingProduct.quantity + (quantity || 1)
            : quantity || 1)
      ) {
        toast.error("Not enough stock available!", {
          style: {
            borderRadius: "10px",
            background: "#EF4444",
            color: "#fff",
            fontWeight: "600",
          },
        });
        return;
      }

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
      toast.success("Product added to Cart!", {
        style: {
          borderRadius: "10px",
          background: "#10B981",
          color: "#fff",
          fontWeight: "600",
        },
      });
    },

    remove: (state, action) => {
      const { _id, selectedSize } = action.payload;
      state.value = state.value.filter(
        (product) =>
          !(product._id === _id && product.selectedSize === selectedSize)
      );
      storeInLocalStorage(state.value);
      toast.success("Product removed from Cart!", {
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
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
          fontWeight: "600",
        },
      });
    },

    logoutUser: (state) => {
      localStorage.removeItem(getUserCartKey()); // Remove cart for user
      localStorage.removeItem("user"); // Remove user data
      state.value = []; // Clear Redux state
      toast.success("User logged out!", {
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
