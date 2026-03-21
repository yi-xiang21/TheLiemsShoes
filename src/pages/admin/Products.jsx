import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../../config/config.js";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(getApiUrl("/products"));
        setProducts(Array.isArray(response.data?.data) ? response.data.data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const dataFields = useMemo(() => {
    if (!products.length) {
      return [
        "id",
        "product name",
        "price",
        "stock quantity",
        "category name"
      ];
    }

    return Object.keys(products[0]).filter((field) => field !== "images");
  }, [products]);

  const handleEditProduct = (product) => {
    navigate("/admin/EditProducts", { state: { product } });
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này không?");
    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(productId);
      await axios.delete(getApiUrl(`/products/${productId}`));
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    } catch (err) {
      setError(err.response?.data?.message || "Xóa sản phẩm thất bại");
    } finally {
      setDeletingId(null);
    }
  };

  const formatCellValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    if (typeof value === "string" && !Number.isNaN(Date.parse(value)) && value.includes("T")) {
      return new Date(value).toLocaleString("vi-VN");
    }

    return String(value);
  };

  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <h2>Product Management</h2>
        <button className="button button-add-product" onClick={() => navigate("/admin/CreateProducts")}>
          + Add New Product
        </button>
      </div>

      <div className="admin-card-body admin-table-wrap">
        {loading && <p>Đang tải dữ liệu sản phẩm...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <table className="admin-table">
            <thead>
              <tr>
                {dataFields.map((header) => (
                  <th key={header}>{header}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={dataFields.length + 1}>Không có dữ liệu sản phẩm</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    {dataFields.map((field) => (
                      <td key={`${product.id}-${field}`}>{formatCellValue(product[field])}</td>
                    ))}
                    <td>
                      <div className="admin-row-actions">
                        <button
                          className="button button-action"
                          onClick={() => handleEditProduct(product)}
                        >
                          Sửa
                        </button>
                        <button
                          className="button button-action button-delete"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deletingId === product.id}
                        >
                          {deletingId === product.id ? "Đang xóa..." : "Xóa"}
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

export default Products;
