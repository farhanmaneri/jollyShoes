import React, { useEffect, useState } from "react";
import "../styles/OrdersPage.css";
import { useAuth } from "../Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_PROD
    : import.meta.env.VITE_API_DEV;
function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        // console.error("Failed to fetch orders:", err);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <p className="orders-container">Loading orders...</p>;
  return (
    <>
      <div className="orders-container">
        <h1 className="orders-title">Orders</h1>
        {orders.length === 0 ? (
          <p className="no-orders">No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-user">{order.userName}</span>
                <span className="order-email">{order.email}</span>
              </div>
              <div className="order-body">
                <p>
                  <strong>Contact:</strong> {order.contact}
                </p>
                <p>
                  <strong>Address:</strong> {order.address}
                </p>
                <p>
                  <strong>Total:</strong> ${order.totalPrice}
                </p>
                <p className="order-date">
                  <strong>Received:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <div className="products-list">
                  {order.products.map((p, idx) => (
                    <div key={idx} className="product-item">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="product-img"
                      />
                      <div>
                        <p className="product-title">{p.title}</p>
                        <p>
                          {p.quantity} × ${p.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default OrdersPage;
