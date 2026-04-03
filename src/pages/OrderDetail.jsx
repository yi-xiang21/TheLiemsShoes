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
    if (rawStatus === "completed") return "Hoàn thành";
    if (rawStatus === "shipping") return "Đang giao";
    if (rawStatus === "cancelled") return "Đã hủy";
    return "Chờ xử lý";
  }, [orderData?.order?.status]);

  const paymentStatusLabel = useMemo(() => {
    const paymentMethod = String(orderData?.order?.payment_method || "cod").toLowerCase();
    const paymentStatus = String(orderData?.order?.payment_status || "").toLowerCase();

    if (paymentMethod !== "momo") return "Đã thanh toán";
    if (["success", "paid", "completed"].includes(paymentStatus) || orderData?.order?.payment_trans_id) {
      return "Đã thanh toán";
    }
    return "Chưa thanh toán";
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
      setError(err?.response?.data?.message || "Không thể tải chi tiết đơn hàng.");
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
          <h1>Chi Tiết Đơn Hàng</h1>
          <p>Vui lòng đăng nhập để xem đơn hàng của bạn.</p>
          <button type="button" className="order-detail-action" onClick={() => navigate("/Login")}>Đăng nhập</button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="order-detail-page">
        <div className="order-detail-card state">Đang tải chi tiết đơn hàng...</div>
      </section>
    );
  }

  if (error || !orderData?.order) {
    return (
      <section className="order-detail-page">
        <div className="order-detail-card state">
          <p>{error || "Không thể tải đơn hàng."}</p>
          <button type="button" className="order-detail-action" onClick={() => navigate("/my-orders")}>Quay lại lịch sử mua hàng</button>
        </div>
      </section>
    );
  }

  const { order, items = [] } = orderData;
  const totalAmount = Number(order.final_amount) || Number(order.total_amount) || 0;

  return (
    <section className="order-detail-page">
      <div className="order-detail-headline">
        <h1>Chi Tiết Đơn Hàng</h1>
        <button type="button" className="order-detail-link-back" onClick={() => navigate("/my-orders")}>
          Quay lại lịch sử mua hàng
        </button>
      </div>

      <div className="order-status-strip">{orderStatusLabel}</div>

      <div className="order-detail-card">
        <h2>Thông tin đơn hàng</h2>
        <p><strong>Mã đơn hàng:</strong> HN-{String(order.id).padStart(7, "0")}</p>
        <p><strong>Ngày đặt:</strong> {formatDateTime(order.created_at)}</p>
        <p><strong>Trạng thái thanh toán:</strong> {paymentStatusLabel}</p>
        <p><strong>Đơn vị vận chuyển:</strong> Xe đạp giao hàng (Free)</p>
      </div>

      <div className="order-detail-card">
        <h2>Thông tin giao hàng</h2>
        <p><strong>Họ tên:</strong> {order.recipient_name || order.username || "-"}</p>
        <p><strong>Email:</strong> {order.email || "-"}</p>
        <p><strong>Số điện thoại:</strong> {order.recipient_phone || "-"}</p>
        <p><strong>Địa chỉ:</strong> {order.recipient_address || "-"}</p>
        <p><strong>Ghi chú:</strong> Không có</p>
      </div>

      <div className="order-detail-card">
        <h2>Sản phẩm đã đặt</h2>
        <div className="order-detail-item-list">
          {items.map((item) => {
            const lineTotal = (Number(item.price) || 0) * (Number(item.quantity) || 0);
            const imageUrl = normalizeImage(item.image_url);
            return (
              <article key={item.id} className="order-detail-item">
                <div className="order-detail-item-left">
                  <div className="order-detail-item-image-wrap">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.product_name || "Sản phẩm"} className="order-detail-item-image" />
                    ) : (
                      <div className="order-detail-item-image-placeholder">No image</div>
                    )}
                  </div>
                  <div className="order-detail-item-text">
                    <h3>{item.product_name || "Sản phẩm"}</h3>
                    <p>Màu / Kích cỡ: Hồng Pastel / {item.size_name || "-"}</p>
                    <p>Số lượng: {item.quantity || 0}</p>
                  </div>
                </div>
                <p className="order-detail-item-price">{formatCurrency(lineTotal)}</p>
              </article>
            );
          })}
        </div>
        <div className="order-detail-total-line">
          <span>Tổng thanh toán</span>
          <strong>{formatCurrency(totalAmount)}</strong>
        </div>
      </div>
    </section>
  );
}

export default OrderDetail;
