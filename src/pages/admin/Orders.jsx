import { useState } from "react";
// import axios from "axios";
// import { getApiUrl } from "../../config/config.js";

function Orders() {
  // Demo data for UI visualization
  const [orders] = useState([
    {
      id: 1,
      user_id: 101,
      user_name: "Nguyễn Văn A",
      total_amount: 1500000,
      status: "pending",
      created_at: "2023-10-25T08:30:00Z"
    },
    {
      id: 2,
      user_id: 102,
      user_name: "Trần Thị B",
      total_amount: 250000,
      status: "completed",
      created_at: "2023-10-24T14:15:00Z"
    },
    {
      id: 3,
      user_id: 103,
      user_name: "Lê Văn C",
      total_amount: 890000,
      status: "cancelled",
      created_at: "2023-10-23T09:00:00Z"
    },
    {
      id: 4,
      user_id: 104,
      user_name: "Phạm Thị D",
      total_amount: 3200000,
      status: "shipping",
      created_at: "2023-10-22T16:45:00Z"
    }
  ]);

  const loading = false;
  const error = "";

  const columns = [
    { field: "id", label: "Mã Đơn" },
    { field: "user_name", label: "Khách Hàng" },
    { field: "total_amount", label: "Tổng Tiền" },
    { field: "status", label: "Trạng Thái" },
    { field: "created_at", label: "Ngày Tạo" }
  ];

  const handleUpdateStatus = (orderId) => {
    alert(`(Demo) Đổi trạng thái đơn hàng #${orderId}`);
  };

  const handleViewOrder = (orderId) => {
    alert(`(Demo) Xem chi tiết đơn hàng #${orderId}`);
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
        <button className="button button-action" style={{ marginLeft: "auto" }} onClick={() => alert("Làm mới dữ liệu")}>
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
