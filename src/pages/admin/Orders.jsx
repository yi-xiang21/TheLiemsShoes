import { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../../config/config.js";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(getApiUrl("/orders"));
      // Backend returns { data: [...] }
      const data = response.data?.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    { field: "id", label: "Mã Đơn" },
    { field: "user_name", label: "Khách Hàng" },
    { field: "total_amount", label: "Tổng Tiền" },
    { field: "status", label: "Trạng Thái" },
    { field: "created_at", label: "Ngày Tạo" }
  ];

  const handleUpdateStatus = async (orderId) => {
    const newStatus = window.prompt("Nhập trạng thái mới (pending, shipping, completed, cancelled):");
    if (!newStatus) return;

    const validStatuses = ['pending', 'shipping', 'completed', 'cancelled'];
    if (!validStatuses.includes(newStatus.toLowerCase())) {
        alert("Trạng thái không hợp lệ! Vui lòng nhập: pending, shipping, completed, hoặc cancelled.");
        return;
    }

    try {
        await axios.put(getApiUrl(`/orders/${orderId}/status`), { status: newStatus.toLowerCase() });
        alert("Cập nhật trạng thái thành công!");
        fetchOrders(); // Reload list
    } catch (err) {
        console.error("Update status error:", err);
        alert("Lỗi cập nhật trạng thái: " + (err.response?.data?.message || err.message));
    }
  };

  const handleViewOrder = (orderId) => {
    // Nếu có trang chi tiết thì navigate, tạm thời alert
    alert(`Chức năng xem chi tiết đơn hàng #${orderId} đang phát triển`);
  };

  const formatCellValue = (field, value) => {
    if (value === null || value === undefined || value === "") return "-";

    if (field === "total_amount") {
      try {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
      } catch (e) {
        return value + " VND";
      }
    }

    if (field === "created_at") {
        if (!Number.isNaN(Date.parse(value))) {
            return new Date(value).toLocaleString("vi-VN");
        }
    }
    
    return String(value);
  };

  const getStatusColor = (status) => {
    status = (status || '').toLowerCase();
    switch (status) {
      case 'completed': return '#28a745'; // Green
      case 'pending': return '#ffc107';   // Yellow
      case 'shipping': return '#17a2b8';  // Blue
      case 'cancelled': return '#dc3545'; // Red
      default: return '#6c757d';          // Grey
    }
  };

  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <h2>Quản Lý Đơn Hàng</h2>
        <button className="button button-action" style={{ marginLeft: "auto" }} onClick={fetchOrders}>
          Làm mới
        </button>
      </div>

      <div className="admin-card-body admin-table-wrap">
        {loading && <p>Đang tải dữ liệu đơn hàng...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.field}>{column.label}</th>
                ))}
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} style={{ textAlign: "center", padding: "20px" }}>
                    Chưa có đơn hàng nào
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
                          onClick={() => handleViewOrder(order.id)}
                          style={{ marginRight: "5px" }}
                        >
                          Xem
                        </button>
                        <button
                          className="button button-action"
                          onClick={() => handleUpdateStatus(order.id)}
                        >
                          Cập nhật
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
    </section>
  );
}

export default Orders;
