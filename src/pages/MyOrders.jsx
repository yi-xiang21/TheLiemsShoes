import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/config";
import { useAuth } from "../context/useAuth";
import "../assets/css/my-orders.css";

function MyOrders() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reorderLoadingId, setReorderLoadingId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    if (!toast.message) return;
    const timer = setTimeout(() => setToast({ message: "", type: "success" }), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const formatCurrencyVND = (value) => {
    return new Intl.NumberFormat("vi-VN").format(Number(value) || 0) + "đ";
  };

  const formatOrderCode = (id) => {
    return `HN-${String(id).padStart(7, "0")}`;
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return date.toLocaleString("vi-VN");
  };

  const normalizeImage = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("http") ? imagePath : getApiUrl(imagePath);
  };

  const normalizePaymentStatus = (paymentMethod, paymentStatus) => {
    if (paymentMethod !== "momo") return "Paid";
    if (["success", "paid", "completed"].includes(String(paymentStatus || "").toLowerCase())) {
      return "Paid";
    }
    return "Pending payment";
  };

  const fetchMyOrders = async () => {
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(getApiUrl("/orders/my-orders"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = Array.isArray(response.data?.data) ? response.data.data : [];
      setOrders(list);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load order history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, [token]);

  const handleViewDetails = (orderId) => {
    navigate(`/my-orders/${orderId}`);
  };

  const handleReorder = async (orderId) => {
    if (!token) {
      setToast({ message: "Please log in to reorder.", type: "error" });
      return;
    }

    setReorderLoadingId(orderId);
    try {
      const detailResponse = await axios.get(getApiUrl(`/orders/${orderId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = Array.isArray(detailResponse.data?.items) ? detailResponse.data.items : [];
      if (!items.length) {
        setToast({ message: "This order has no items to reorder.", type: "error" });
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (const item of items) {
        if (!item?.product_size_id) {
          failCount += 1;
          continue;
        }

        try {
          await axios.post(
            getApiUrl("/cart"),
            {
              product_size_id: item.product_size_id,
              quantity: Number(item.quantity) || 1,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          successCount += 1;
        } catch (error) {
          failCount += 1;
        }
      }

      if (successCount > 0) {
        setToast({
          message: failCount > 0
            ? `Added ${successCount} items, but ${failCount} items could not be added.`
            : "Items added to cart.",
          type: failCount > 0 ? "error" : "success",
        });
        setTimeout(() => navigate("/Cart"), 500);
      } else {
        setToast({ message: "No items could be added to cart.", type: "error" });
      }
    } catch (err) {
      setToast({ message: err?.response?.data?.message || "Reorder failed.", type: "error" });
    } finally {
      setReorderLoadingId(null);
    }
  };

  if (!token) {
    return (
      <section className="my-orders-page">
        <div className="my-orders-card my-orders-state">
          <h1>Order History</h1>
          <p>Please log in to view your orders.</p>
          <button type="button" className="my-orders-btn secondary" onClick={() => navigate("/Login")}>Log In</button>
        </div>
      </section>
    );
  }

  return (
    <section className="my-orders-page">
      {toast.message ? (
        <div className={`my-orders-toast ${toast.type === "error" ? "error" : "success"}`}>
          {toast.message}
        </div>
      ) : null}

      <div className="my-orders-header">
        <h1>Order History</h1>
      </div>

      {loading ? (
        <div className="my-orders-card my-orders-state">Loading orders...</div>
      ) : error ? (
        <div className="my-orders-card my-orders-state">{error}</div>
      ) : orders.length === 0 ? (
        <div className="my-orders-card my-orders-state">You do not have any orders yet.</div>
      ) : (
        <div className="my-orders-list">
          {orders.map((order) => {
            const imageUrl = normalizeImage(order.image_url);
            const totalAmount = Number(order.final_amount) || Number(order.total_amount) || 0;
            const canReorder = reorderLoadingId !== order.id;

            return (
              <article key={order.id} className="my-orders-card">
                <div className="my-order-topline">
                  <span className="my-order-code">{formatOrderCode(order.id)}</span>
                  <span className="my-order-date">{formatDateTime(order.created_at)}</span>
                </div>

                <div className="my-order-main">
                  <div className="my-order-preview">
                    <div className="my-order-image-wrap">
                      {imageUrl ? (
                        <img src={imageUrl} alt={order.product_name || "Product"} className="my-order-image" />
                      ) : (
                        <div className="my-order-image-placeholder">No image</div>
                      )}
                    </div>

                    <div className="my-order-text">
                      <h3>{order.product_name || "Product"}</h3>
                      <p>Size: {order.size_name || "-"}</p>
                      <p>Quantity: {order.quantity || 1}</p>
                      <p>Price: {formatCurrencyVND(order.item_total || totalAmount)}</p>
                      {(Number(order.total_items) || 1) > 1 ? (
                        <p className="my-order-more">+ {(Number(order.total_items) || 1) - 1} more items</p>
                      ) : null}
                      <p className="my-order-payment-status">
                        {normalizePaymentStatus(order.payment_method, order.payment_status)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="my-order-bottom">
                  <p className="my-order-total">Order total: {formatCurrencyVND(totalAmount)}</p>
                  <div className="my-order-actions">
                    <button
                      type="button"
                      className="my-orders-btn"
                      disabled={!canReorder}
                      onClick={() => handleReorder(order.id)}
                    >
                      {canReorder ? "Buy Again" : "Processing..."}
                    </button>
                    <button
                      type="button"
                      className="my-orders-btn"
                      onClick={() => handleViewDetails(order.id)}
                    >
                      View Order Details
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MyOrders;
