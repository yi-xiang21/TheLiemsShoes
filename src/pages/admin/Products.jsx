import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../../config/config.js";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const [productsResponse, productTypesResponse] = await Promise.all([
          axios.get(getApiUrl("/products")),
          axios.get(getApiUrl("/products/types"))
        ]);

        setProducts(Array.isArray(productsResponse.data?.data) ? productsResponse.data.data : []);
        setProductTypes(Array.isArray(productTypesResponse.data?.data) ? productTypesResponse.data.data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const columns = [
    { field: "id", label: "Mã SP" },
    { field: "product_name", label: "Tên sản phẩm" },
    { field: "price", label: "Giá" },
    { field: "stock_quantity", label: "Tồn kho" },
    { field: "category_name", label: "Danh mục" },
    { field: "product_type_name", label: "Loại sản phẩm" }
  ];

  const productTypeMap = useMemo(() => {
    return productTypes.reduce((map, type) => {
      map[type.id] = type.type_name;
      return map;
    }, {});
  }, [productTypes]);

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
                {columns.map((column) => (
                  <th key={column.field}>{column.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1}>Không có dữ liệu sản phẩm</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    {columns.map((column) => {
                      const value =
                        column.field === "product_type_name"
                          ? productTypeMap[product.product_type_id]
                          : product[column.field];

                      return <td key={`${product.id}-${column.field}`}>{formatCellValue(value)}</td>;
                    })}
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
