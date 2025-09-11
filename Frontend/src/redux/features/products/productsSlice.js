
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
  loading: false,
  value: [], // empty array for products
  error: "", // initial empty error message
};
const API =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_PROD 
    : import.meta.env.VITE_API_DEV;

// The async function to fetch products from the API
export const getProducts = createAsyncThunk("getProducts", async () => {
  // Fetching the products from the API
  const response = await fetch(
    `${API}/auth/products`
  );
console.log("API Link",API)
  // If the response is not ok, throw an error
  // console.log("Response Status: ", response.status); // Log status code
//   console.log("Response Headers: ", response.headers); // Log headers
// console.log(response); // Log
  if (!response.ok) {
    throw new Error(`Error fetching products: ${response.statusText}`);
  }

  // Return the products after parsing the response as JSON
  const data = await response.json();

  // Log the data for debugging purposes (optional)
  console.log("Fetched Products:", data);

  return data; // Assuming the response has a 'products' field
});

// The slice that manages the state
export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // ✅ This manually removes a product from state after successful deletion
    removeProduct: (state, action) => {
      const idToRemove = action.payload;
      state.value = state.value.filter((product) => product._id !== idToRemove);
    },
  }, // No reducers are needed for now
  extraReducers: (builder) => {
    // When the fetch is pending (loading)
    builder.addCase(getProducts.pending, (state) => {
      state.loading = true;
    });

    // When the fetch is successful (fulfilled)
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.value = action.payload; // Store the products in state
    });

    // When the fetch fails (rejected)
    builder.addCase(getProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Bad fetching!"; // Capture the error message
    });
  },
});

export const { removeProduct } = productsSlice.actions;
export default productsSlice.reducer;
