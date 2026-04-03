import { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../../config/config.js";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(getApiUrl("/orders"));
      const data = response.data?.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Unable to load order list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    { field: "id", label: "Order ID" },
    { field: "user_name", label: "Customer" },
    { field: "total_amount", label: "Total" },
    { field: "status", label: "Status" },
    { field: "created_at", label: "Created At" }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleUpdateStatus = async (orderId) => {
    const newStatus = window.prompt("Enter new status (pending, shipping, completed, cancelled):");
    if (!newStatus) return;

    const validStatuses = ['pending', 'shipping', 'completed', 'cancelled'];
    if (!validStatuses.includes(newStatus.toLowerCase())) {
      alert("Invalid status. Please enter: pending, shipping, completed, or cancelled.");
      return;
    }

    try {
      await axios.put(getApiUrl(`/orders/${orderId}/status`), { status: newStatus.toLowerCase() });
      alert("Status updated successfully.");
      fetchOrders();
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    }
  };

  const handleViewOrder = async (order) => {
    setSelectedOrder(order);
    setDetailLoading(true);
    try {
      const response = await axios.get(getApiUrl(`/orders/${order.id}`));
      setOrderDetails(response.data);
    } catch (err) {
      console.error("Error loading order details:", err);
      alert("Failed to load order details");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  const isMomoOrder = orderDetails?.order?.payment_method === "momo";
  const isPaidMomo =
    isMomoOrder &&
    (orderDetails?.order?.payment_status === "success" || Boolean(orderDetails?.order?.payment_trans_id));

  const formatCellValue = (field, value) => {
    if (value === null || value === undefined || value === "") return "-";

    if (field === "total_amount") {
      try {
        return formatCurrency(value);
      } catch (e) {
        return value + " VND";
      }
    }

    if (field === "created_at") {
      if (!Number.isNaN(Date.parse(value))) {
        return formatDate(value);
      }
    }

    return String(value);
  };

  const getStatusColor = (status) => {
    status = (status || '').toLowerCase();
    switch (status) {
      case 'completed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'shipping': return '#17a2b8';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <h2>Order Management</h2>
        <button className="button button-action" style={{ marginLeft: "auto" }} onClick={fetchOrders}>
          Refresh
        </button>
      </div>

      <div className="admin-card-body admin-table-wrap">
        {loading && <p>Loading orders...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.field}>{column.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} style={{ textAlign: "center", padding: "20px" }}>
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    {columns.map((column) => (
                      <td key={`${order.id}-${column.field}`}>
                        {column.field === "status" ? (
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "0.85em",
                              fontWeight: "bold",
                              color: "white",
                              backgroundColor: getStatusColor(order.status),
                              textTransform: "capitalize"
                            }}
                          >
                            {order.status}
                          </span>
                        ) : (
                          formatCellValue(column.field, order[column.field])
                        )}
                      </td>
                    ))}
                    <td>
                      <div className="admin-row-actions">
                        <button
                          className="button button-action"
                          onClick={() => handleViewOrder(order)}
                          style={{ marginRight: "5px" }}
                        >
                          View
                        </button>
                        <button
                          className="button button-action"
                          onClick={() => handleUpdateStatus(order.id)}
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="order-detail-modal-overlay" onClick={closeModal}>
          <div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="order-detail-modal-close" onClick={closeModal}>×</button>

            {detailLoading ? (
              <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>
            ) : orderDetails ? (
              <div className="order-detail-modal-content">
                {/* LEFT COLUMN */}
                <div className="order-detail-left">
                  <h2 style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "600" }}>Order Details</h2>

                  {/* Order Info */}
                  <div style={{ marginBottom: "30px" }}>
                    <h4 style={{ marginBottom: "15px", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", color: "#666" }}>Order Information</h4>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #eee", fontSize: "13px" }}>
                      <span style={{ color: "#666" }}>Placed At:</span>
                      <span style={{ fontWeight: "500" }}>{formatDate(orderDetails.order.created_at)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #eee", fontSize: "13px", marginTop: "8px" }}>
                      <span style={{ color: "#666" }}>Order Code:</span>
                      <span style={{ fontWeight: "500" }}>HN-{String(orderDetails.order.id).padStart(7, "0")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", fontSize: "13px", marginTop: "8px" }}>
                      <span style={{ color: "#666" }}>Total:</span>
                      <span style={{ fontWeight: "600", color: "#8B0000", fontSize: "14px" }}>
                        {formatCurrency(orderDetails.order.total_amount)}
                      </span>
                    </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #eee", fontSize: "13px", marginTop: "8px" }}>
                        <span style={{ color: "#666" }}>
                          {isMomoOrder ? "Payment status:" : "Payment method:"}
                        </span>
                        <span style={{ fontWeight: "500" }}>
                          {isMomoOrder ? (isPaidMomo ? "Paid" : "Unpaid") : "COD"}
                        </span>
                      </div>
                  </div>

                  {/* Recipient Info */}
                  <div style={{ marginBottom: "30px" }}>
                    <h4 style={{ marginBottom: "15px", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", color: "#666" }}>Recipient Information</h4>
                    <div style={{ fontSize: "13px" }}>
                      <div style={{ marginBottom: "8px" }}>
                        <span style={{ color: "#666" }}>Full Name:</span> <span style={{ marginLeft: "8px", fontWeight: "500" }}>{orderDetails.order.recipient_name || orderDetails.order.username || "-"}</span>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <span style={{ color: "#666" }}>Phone:</span> <span style={{ marginLeft: "8px", fontWeight: "500" }}>{orderDetails.order.recipient_phone || "-"}</span>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <span style={{ color: "#666" }}>Address:</span> <span style={{ marginLeft: "8px", fontWeight: "500" }}>{orderDetails.order.recipient_address || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div>
                    <h4 style={{ marginBottom: "15px", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", color: "#666" }}>Products</h4>
                    <div style={{ background: "#f9f9f9", borderRadius: "4px" }}>
                      {orderDetails.items && orderDetails.items.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", gap: "12px", padding: "12px", borderBottom: idx < orderDetails.items.length - 1 ? "1px solid #eee" : "none" }}>
                          <img
                            src={item.image_url?.startsWith("http") ? item.image_url : getApiUrl(item.image_url || "")}
                            alt={item.product_name}
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "500", fontSize: "13px", marginBottom: "4px" }}>{item.product_name}</div>
                            <div style={{ fontSize: "12px", color: "#999" }}>Size: {item.size_name}</div>
                            <div style={{ fontSize: "12px", color: "#999" }}>x{item.quantity}</div>
                            <div style={{ fontWeight: "600", color: "#8B0000", fontSize: "13px", marginTop: "4px" }}>
                              {formatCurrency(item.price)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="order-detail-right">
                  {/* Shipping Info */}
                  <div style={{ marginBottom: "30px" }}>
                    <h4 style={{ marginBottom: "15px", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", color: "#666" }}>Shipping Information</h4>
                    <div style={{ fontSize: "13px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #eee", marginBottom: "8px" }}>
                        <span style={{ color: "#666" }}>Method:</span>
                        <span style={{ fontWeight: "500" }}>Delivery</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #eee", marginBottom: "8px" }}>
                        <span style={{ color: "#666" }}>Provider:</span>
                        <span style={{ fontWeight: "500" }}>GHT1K</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #eee", marginBottom: "8px" }}>
                        <span style={{ color: "#666" }}>Tracking Code:</span>
                        <span style={{ fontWeight: "500" }}>12999AA1234567890</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#666" }}>ETA:</span>
                        <span style={{ fontWeight: "500", color: "#4CAF50" }}>Nov 6, 2025</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div style={{ marginBottom: "30px" }}>
                    <h4 style={{ marginBottom: "15px", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", color: "#666" }}>Payment Details</h4>
                    <div style={{ fontSize: "13px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #eee", marginBottom: "8px" }}>
                        <span style={{ color: "#666" }}>Subtotal:</span>
                            <span style={{ fontWeight: "500" }}>
                          {isPaidMomo ? formatCurrency(0) : formatCurrency(orderDetails.order.total_amount)}
                            </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #eee", marginBottom: "8px" }}>
                        <span style={{ color: "#666" }}>Shipping:</span>
                        <span style={{ fontWeight: "500" }}>Free</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #eee", marginBottom: "8px" }}>
                        <span style={{ color: "#666" }}>Tax:</span>
                        <span style={{ fontWeight: "500" }}>0</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "2px solid #eee", marginBottom: "8px" }}>
                        <span style={{ color: "#333", fontWeight: "600" }}>Total:</span>
                        <span style={{ fontWeight: "700", color: "#8B0000", fontSize: "16px" }}>
                          {formatCurrency(orderDetails.order.final_amount || orderDetails.order.total_amount)}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", marginTop: "12px" }}>
                        <span style={{ color: "#666" }}>Status:</span>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "white",
                            backgroundColor: getStatusColor(orderDetails.order.status),
                            textTransform: "capitalize"
                          }}
                        >
                          {orderDetails.order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <button style={{
                      padding: "10px",
                      background: "#8B0000",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500",
                      fontSize: "13px",
                      gridColumn: "1 / -1"
                    }}>
                      Send Customer Email
                    </button>
                    <button style={{
                      padding: "10px",
                      background: "white",
                      color: "#333",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500",
                      fontSize: "13px"
                    }}>
                      Print Order
                    </button>
                    <button style={{
                      padding: "10px",
                      background: "white",
                      color: "#333",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500",
                      fontSize: "13px"
                    }}>
                      Refund
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>Unable to load order details</div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .order-detail-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .order-detail-modal {
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 1100px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .order-detail-modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 32px;
          cursor: pointer;
          color: #999;
          z-index: 10;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .order-detail-modal-close:hover {
          color: #333;
        }

        .order-detail-modal-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          padding: 40px;
        }

        .order-detail-left,
        .order-detail-right {
          /* columns auto-sized */
        }

        @media (max-width: 768px) {
          .order-detail-modal-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </section>
  );
}

export default Orders;
