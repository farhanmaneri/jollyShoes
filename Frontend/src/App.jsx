import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "./redux/features/products/productsSlice";
import AuthProvider from './Auth/AuthProvider';
import Routes from './routes/index';
import { Toaster } from "react-hot-toast";
import "../src/styles/App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const loading = useSelector((state) => state.productsReducer.loading);

  return (
    <AuthProvider>
      <Routes />
      <Toaster
        position="top-right"
        gutter={8}
        containerStyle={{ 
          zIndex: 9999,
          top: '80px' // Adjust based on your navbar height
        }}
        toastOptions={{
          duration: 2500, // Reduced duration
          style: {
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: '14px',
            maxWidth: '350px'
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff'
            },
            style: {
              background: "#10B981",
              color: "#fff",
            }
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: '#EF4444', 
              secondary: '#fff'
            },
            style: {
              background: "#EF4444",
              color: "#fff",
            }
          }
        }}
      />
    </AuthProvider>
  );
}

export default App;