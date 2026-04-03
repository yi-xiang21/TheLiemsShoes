import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../../config/config.js";

function CreateProducts() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    price: "",
    description: "",
    category_id: "",
    product_type_id: ""
  });
  const [sizeStocks, setSizeStocks] = useState([{ size_name: "", stock_quantity: "0" }]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesResponse, productTypesResponse] = await Promise.all([
          axios.get(getApiUrl("/categories")),
          axios.get(getApiUrl("/products/types"))
        ]);

        setCategories(Array.isArray(categoriesResponse.data?.data) ? categoriesResponse.data.data : []);
        setProductTypes(Array.isArray(productTypesResponse.data?.data) ? productTypesResponse.data.data : []);
      } catch {
        setError("Unable to load category/product type data, please try again");
      }
    };

    fetchInitialData();
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

  const handleSizeStockChange = (index, field, value) => {
    setSizeStocks((prev) =>
      prev.map((item, currentIndex) =>
        currentIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addSizeStockRow = () => {
    setSizeStocks((prev) => [...prev, { size_name: "", stock_quantity: "0" }]);
  };

  const removeSizeStockRow = (index) => {
    setSizeStocks((prev) => {
      if (prev.length <= 1) {
        return [{ size_name: "", stock_quantity: "0" }];
      }

      return prev.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.product_name.trim() || !formData.price || !formData.description.trim() || !formData.category_id) {
      setError("Please fill in all required fields");
      return;
    }

    const normalizedSizeStocks = sizeStocks
      .map((item) => ({
        size_name: String(item.size_name || "").trim(),
        stock_quantity: Number(item.stock_quantity)
      }))
      .filter((item) => item.size_name);

    if (!normalizedSizeStocks.length) {
      setError("Please add at least one valid size");
      return;
    }

    if (normalizedSizeStocks.some((item) => !Number.isInteger(item.stock_quantity) || item.stock_quantity < 0)) {
      setError("Stock quantity for each size must be a non-negative integer");
      return;
    }

    const duplicateSizeName = normalizedSizeStocks.find(
      (item, index) =>
        normalizedSizeStocks.findIndex((candidate) => candidate.size_name.toLowerCase() === item.size_name.toLowerCase()) !== index
    );

    if (duplicateSizeName) {
      setError("Duplicate size detected, please review your size list");
      return;
    }

    const totalStockQuantity = normalizedSizeStocks.reduce(
      (sum, item) => sum + item.stock_quantity,
      0
    );

    try {
      setIsSubmitting(true);
      const body = new FormData();
      body.append("product_name", formData.product_name.trim());
      body.append("price", formData.price);
      body.append("description", formData.description.trim());
      body.append("category_id", formData.category_id);
      body.append("stock_quantity", String(totalStockQuantity));
      body.append("size_stocks", JSON.stringify(normalizedSizeStocks));

      if (formData.product_type_id) {
        body.append("product_type_id", formData.product_type_id);
      }

      images.forEach((file) => {
        body.append("images", file);
      });

      await axios.post(getApiUrl("/products"), body);

      setSuccess("Product created successfully");
      setTimeout(() => {
        navigate("/admin/products");
      }, 700);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
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
          <label htmlFor="product_name">Product name</label>
          <input
            id="product_name"
            name="product_name"
            type="text"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category_id">Category</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="product_type_id">Product type (optional)</label>
          <select
            id="product_type_id"
            name="product_type_id"
            value={formData.product_type_id}
            onChange={handleChange}
          >
            <option value="">Select product type</option>
            {productTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.type_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group form-group-full">
          <label>Sizes and stock quantities</label>
          {sizeStocks.map((item, index) => (
            <div
              key={`size-stock-${index}`}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "8px", marginBottom: "8px" }}
            >
              <input
                type="text"
                value={item.size_name}
                onChange={(event) => handleSizeStockChange(index, "size_name", event.target.value)}
                placeholder="e.g. 39, 40, 41"
              />
              <input
                type="number"
                min="0"
                step="1"
                value={item.stock_quantity}
                onChange={(event) => handleSizeStockChange(index, "stock_quantity", event.target.value)}
                placeholder="Quantity"
              />
              <button
                type="button"
                className="button button-secondary"
                onClick={() => removeSizeStockRow(index)}
                disabled={isSubmitting}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="button button-secondary"
            onClick={addSizeStockRow}
            disabled={isSubmitting}
          >
            + Add size
          </button>
          <small className="admin-form-hint">
            Total stock: {sizeStocks.reduce((sum, item) => sum + Math.max(0, Number(item.stock_quantity) || 0), 0)}
          </small>
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            required
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="images">Images (max 10 files)</label>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <small className="admin-form-hint">Selected: {images.length} image(s)</small>
        </div>

        <div className="admin-form-actions form-group-full">
          <button type="submit" className="button" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create product"}
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigate("/admin/products")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreateProducts;