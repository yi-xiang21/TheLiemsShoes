import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../../config/config.js";

function CreateProducts() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    price: "",
    description: "",
    category_id: "",
    product_type_id: "",
    stock_quantity: "0"
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(getApiUrl("/categories"));
        setCategories(Array.isArray(response.data?.data) ? response.data.data : []);
      } catch {
        setError("Không tải được danh mục, vui lòng thử lại");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    setImages(Array.from(event.target.files || []));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.product_name.trim() || !formData.price || !formData.description.trim() || !formData.category_id) {
      setError("Vui lòng nhập đầy đủ các trường bắt buộc");
      return;
    }

    try {
      setIsSubmitting(true);
      const body = new FormData();
      body.append("product_name", formData.product_name.trim());
      body.append("price", formData.price);
      body.append("description", formData.description.trim());
      body.append("category_id", formData.category_id);
      body.append("stock_quantity", formData.stock_quantity || "0");

      if (formData.product_type_id) {
        body.append("product_type_id", formData.product_type_id);
      }

      images.forEach((file) => {
        body.append("images", file);
      });

      await axios.post(getApiUrl("/products"), body);

      setSuccess("Thêm sản phẩm thành công");
      setTimeout(() => {
        navigate("/admin/products");
      }, 700);
    } catch (err) {
      setError(err.response?.data?.message || "Thêm sản phẩm thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <h2>Create Product</h2>
      </div>

      {error && <p className="admin-form-message error">{error}</p>}
      {success && <p className="admin-form-message success">{success}</p>}

      <form className="create-account-form create-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="product_name">Tên sản phẩm</label>
          <input
            id="product_name"
            name="product_name"
            type="text"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Nhập tên sản phẩm"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Giá</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="Nhập giá"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category_id">Danh mục</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="product_type_id">Product type id (tùy chọn)</label>
          <input
            id="product_type_id"
            name="product_type_id"
            type="number"
            min="1"
            value={formData.product_type_id}
            onChange={handleChange}
            placeholder="Ví dụ: 1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock_quantity">Số lượng tồn</label>
          <input
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            min="0"
            value={formData.stock_quantity}
            onChange={handleChange}
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Nhập mô tả sản phẩm"
            required
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="images">Hình ảnh (tối đa 10 ảnh)</label>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <small className="admin-form-hint">Đã chọn: {images.length} ảnh</small>
        </div>

        <div className="admin-form-actions form-group-full">
          <button type="submit" className="button" disabled={isSubmitting}>
            {isSubmitting ? "Đang thêm..." : "Thêm sản phẩm"}
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigate("/admin/products")}
            disabled={isSubmitting}
          >
            Hủy
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreateProducts;