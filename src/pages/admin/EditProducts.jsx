import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../../config/config.js";

function EditProducts() {
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.product?.id;

  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    price: "",
    description: "",
    category_id: "",
    product_type_id: "",
    stock_quantity: "0"
  });
  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!productId) {
      setError("Không tìm thấy sản phẩm cần sửa");
      setLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError("");

        const [categoriesResponse, productTypesResponse, productResponse] = await Promise.all([
          axios.get(getApiUrl("/categories")),
          axios.get(getApiUrl("/products/types")),
          axios.get(getApiUrl(`/products/${productId}`))
        ]);

        setCategories(Array.isArray(categoriesResponse.data?.data) ? categoriesResponse.data.data : []);
        setProductTypes(Array.isArray(productTypesResponse.data?.data) ? productTypesResponse.data.data : []);

        const productData = productResponse.data?.data;
        if (!productData) {
          setError("Không tải được thông tin sản phẩm");
          return;
        }

        setFormData({
          product_name: productData.product_name || "",
          price: productData.price ?? "",
          description: productData.description || "",
          category_id: String(productData.category_id || ""),
          product_type_id: String(productData.product_type_id || ""),
          stock_quantity: String(productData.stock_quantity ?? "0")
        });

        const normalizedExistingImages = Array.isArray(productData.images)
          ? productData.images
              .map((image) => ({
                id: image?.id,
                image_url: image?.image_url || "",
                isUpdating: false,
                replacementFile: null
              }))
              .filter((image) => image.image_url)
          : [];

        setExistingImages(normalizedExistingImages);
      } catch (err) {
        setError(err.response?.data?.message || "Không tải được dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [productId]);

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

  const resolveImageUrl = (url) => {
    if (!url) {
      return "";
    }

    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    return getApiUrl(url.startsWith("/") ? url : `/${url}`);
  };

  const handleEnableImageUpdate = (imageId) => {
    setExistingImages((prev) =>
      prev.map((image) =>
        image.id === imageId
          ? {
              ...image,
              isUpdating: true
            }
          : image
      )
    );
  };

  const handleReplacementFileChange = (imageId, event) => {
    const selectedFile = event.target.files?.[0] || null;

    setExistingImages((prev) =>
      prev.map((image) =>
        image.id === imageId
          ? {
              ...image,
              replacementFile: selectedFile
            }
          : image
      )
    );
  };

  const handleRemoveExistingImage = (imageId) => {
    setExistingImages((prev) => prev.filter((image) => image.id !== imageId));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!productId) {
      setError("Không xác định được sản phẩm để cập nhật");
      return;
    }

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

      const replacementFiles = existingImages
        .filter((image) => image.isUpdating && image.replacementFile)
        .map((image) => image.replacementFile);

      const keptImageUrls = existingImages
        .filter((image) => !(image.isUpdating && image.replacementFile))
        .map((image) => image.image_url)
        .filter(Boolean);

      const allFilesToUpload = [...replacementFiles, ...images];
      if (keptImageUrls.length + allFilesToUpload.length > 10) {
        setError("Tổng số ảnh của sản phẩm không được vượt quá 10 ảnh");
        return;
      }

      body.append("image_urls", JSON.stringify(keptImageUrls));

      allFilesToUpload.forEach((file) => {
        body.append("images", file);
      });

      await axios.put(getApiUrl(`/products/${productId}`), body);
      setSuccess("Cập nhật sản phẩm thành công");

      setTimeout(() => {
        navigate("/admin/products");
      }, 700);
    } catch (err) {
      setError(err.response?.data?.message || "Cập nhật sản phẩm thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="admin-card">
        <p>Đang tải dữ liệu sản phẩm...</p>
      </section>
    );
  }

  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <h2>Edit Product</h2>
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
          <label htmlFor="product_type_id">Loại sản phẩm (tùy chọn)</label>
          <select
            id="product_type_id"
            name="product_type_id"
            value={formData.product_type_id}
            onChange={handleChange}
          >
            <option value="">Chọn loại sản phẩm</option>
            {productTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.type_name}
              </option>
            ))}
          </select>
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
          <label>Ảnh hiện tại của sản phẩm</label>

          {existingImages.length === 0 ? (
            <small className="admin-form-hint">Không có ảnh hiện tại.</small>
          ) : (
            <div className="edit-product-image-list">
              {existingImages.map((image, index) => (
                <div className="edit-product-image-item" key={image.id ?? `${image.image_url}-${index}`}>
                  <img
                    className="edit-product-image-preview"
                    src={resolveImageUrl(image.image_url)}
                    alt={`Ảnh sản phẩm ${index + 1}`}
                  />

                  {image.isUpdating ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleReplacementFileChange(image.id, event)}
                    />
                  ) : (
                    <input type="text" value={image.image_url} readOnly />
                  )}

                  <div className="admin-row-actions">
                    <button
                      type="button"
                      className="button button-action"
                      onClick={() => handleEnableImageUpdate(image.id)}
                      disabled={isSubmitting}
                    >
                      Update img
                    </button>
                    <button
                      type="button"
                      className="button button-action button-delete"
                      onClick={() => handleRemoveExistingImage(image.id)}
                      disabled={isSubmitting}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="images">Thêm ảnh mới (input file)</label>
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
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
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

export default EditProducts;