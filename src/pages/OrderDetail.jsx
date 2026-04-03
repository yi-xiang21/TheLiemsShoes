import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/config";
import { useAuth } from "../context/useAuth";
import "../assets/css/order-detail.css";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN").format(Number(value) || 0) + " ₫";
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    const time = date.toLocaleTimeString("vi-VN");
    const day = date.toLocaleDateString("vi-VN");
    return `${time} ${day}`;
  };

  const orderStatusLabel = useMemo(() => {
    const rawStatus = String(orderData?.order?.status || "").toLowerCase();
    if (rawStatus === "completed") return "Completed";
    if (rawStatus === "shipping") return "In delivery";
    if (rawStatus === "cancelled") return "Cancelled";
    return "Pending";
  }, [orderData?.order?.status]);

  const paymentStatusLabel = useMemo(() => {
    const paymentMethod = String(orderData?.order?.payment_method || "cod").toLowerCase();
    const paymentStatus = String(orderData?.order?.payment_status || "").toLowerCase();

    if (paymentMethod !== "momo") return "Paid";
    if (["success", "paid", "completed"].includes(paymentStatus) || orderData?.order?.payment_trans_id) {
      return "Paid";
    }
    return "Unpaid";
  }, [orderData?.order?.payment_method, orderData?.order?.payment_status, orderData?.order?.payment_trans_id]);

  const fetchOrderDetail = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(getApiUrl(`/orders/${id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderData(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id, token]);

  const normalizeImage = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("http") ? imagePath : getApiUrl(imagePath);
  };

  if (!token) {
    return (
      <section className="order-detail-page">
        <div className="order-detail-card state">
          <h1>Order Details</h1>
          <p>Please log in to view your order.</p>
          <button type="button" className="order-detail-action" onClick={() => navigate("/Login")}>Log In</button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="order-detail-page">
        <div className="order-detail-card state">Loading order details...</div>
      </section>
    );
  }

  if (error || !orderData?.order) {
    return (
      <section className="order-detail-page">
        <div className="order-detail-card state">
          <p>{error || "Unable to load this order."}</p>
          <button type="button" className="order-detail-action" onClick={() => navigate("/my-orders")}>Back to order history</button>
        </div>
      </section>
    );
  }

  const { order, items = [] } = orderData;
  const totalAmount = Number(order.final_amount) || Number(order.total_amount) || 0;

  return (
    <section className="order-detail-page">
      <div className="order-detail-headline">
        <h1>Order Details</h1>
        <button type="button" className="order-detail-link-back" onClick={() => navigate("/my-orders")}>
          Back to order history
        </button>
      </div>

      <div className="order-status-strip">{orderStatusLabel}</div>

      <div className="order-detail-card">
        <h2>Order information</h2>
        <p><strong>Order code:</strong> HN-{String(order.id).padStart(7, "0")}</p>
        <p><strong>Placed at:</strong> {formatDateTime(order.created_at)}</p>
        <p><strong>Payment status:</strong> {paymentStatusLabel}</p>
        <p><strong>Shipping provider:</strong> Bike delivery (Free)</p>
      </div>

      <div className="order-detail-card">
        <h2>Shipping information</h2>
        <p><strong>Full name:</strong> {order.recipient_name || order.username || "-"}</p>
        <p><strong>Email:</strong> {order.email || "-"}</p>
        <p><strong>Phone number:</strong> {order.recipient_phone || "-"}</p>
        <p><strong>Address:</strong> {order.recipient_address || "-"}</p>
        <p><strong>Note:</strong> None</p>
      </div>

      <div className="order-detail-card">
        <h2>Ordered items</h2>
        <div className="order-detail-item-list">
          {items.map((item) => {
            const lineTotal = (Number(item.price) || 0) * (Number(item.quantity) || 0);
            const imageUrl = normalizeImage(item.image_url);
            return (
              <article key={item.id} className="order-detail-item">
                <div className="order-detail-item-left">
                  <div className="order-detail-item-image-wrap">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.product_name || "Product"} className="order-detail-item-image" />
                    ) : (
                      <div className="order-detail-item-image-placeholder">No image</div>
                    )}
                  </div>
                  <div className="order-detail-item-text">
                    <h3>{item.product_name || "Product"}</h3>
                    <p>Color / Size: Pink Pastel / {item.size_name || "-"}</p>
                    <p>Quantity: {item.quantity || 0}</p>
                  </div>
                </div>
                <p className="order-detail-item-price">{formatCurrency(lineTotal)}</p>
              </article>
            );
          })}
        </div>
        <div className="order-detail-total-line">
          <span>Total payment</span>
          <strong>{formatCurrency(totalAmount)}</strong>
        </div>
      </div>
    </section>
  );
}

export default OrderDetail;
