import { useEffect, useState } from "react"
import { getApiUrl } from "../../config/config.js"
import type {
  CategoryOption,
  ExistingImageInput,
  ProductFormState,
  ProductItem,
  ProductModalMode,
  ProductSubmitPayload,
  ProductTypeOption,
  SizeStockInput,
} from "../../pages/admin/Products"

interface ProductFormModalProps {
  isOpen: boolean
  mode: ProductModalMode
  product: ProductItem | null
  categories: CategoryOption[]
  productTypes: ProductTypeOption[]
  loadingDetail: boolean
  submitting: boolean
  error: string
  onClose: () => void
  onSubmit: (payload: ProductSubmitPayload) => void
}

const EMPTY_FORM: ProductFormState = {
  product_name: "",
  price: "",
  description: "",
  category_id: "",
  product_type_id: "",
}

function ProductFormModal({
  isOpen,
  mode,
  product,
  categories,
  productTypes,
  loadingDetail,
  submitting,
  error,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductFormState>(EMPTY_FORM)
  const [sizeStocks, setSizeStocks] = useState<SizeStockInput[]>([{ size_id: null, size_name: "", stock_quantity: "0" }])
  const [existingImages, setExistingImages] = useState<ExistingImageInput[]>([])
  const [newImages, setNewImages] = useState<File[]>([])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (mode === "edit" && product) {
      setFormData({
        product_name: product.product_name || "",
        price: product.price !== null && product.price !== undefined ? String(product.price) : "",
        description: product.description || "",
        category_id: product.category_id ? String(product.category_id) : "",
        product_type_id: product.product_type_id ? String(product.product_type_id) : "",
      })

      const normalizedSizes = Array.isArray(product.sizes)
        ? product.sizes
            .map((item) => ({
              size_id: Number.isInteger(Number(item?.size_id)) ? Number(item.size_id) : null,
              size_name: String(item?.size_name || "").trim(),
              stock_quantity: String(Number(item?.stock_quantity) || 0),
            }))
            .filter((item) => item.size_name)
        : []

      setSizeStocks(
        normalizedSizes.length
          ? normalizedSizes
          : [{ size_id: null, size_name: "", stock_quantity: String(product.stock_quantity ?? 0) }]
      )

      const normalizedImages = Array.isArray(product.images)
        ? product.images
            .map((image) => ({
              id: image?.id ?? null,
              image_url: image?.image_url || "",
              isUpdating: false,
              replacementFile: null,
            }))
            .filter((image) => image.image_url)
        : []

      setExistingImages(normalizedImages)
      setNewImages([])
      return
    }

    setFormData(EMPTY_FORM)
    setSizeStocks([{ size_id: null, size_name: "", stock_quantity: "0" }])
    setExistingImages([])
    setNewImages([])
  }, [isOpen, mode, product])

  if (!isOpen) {
    return null
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewImages(Array.from(event.target.files || []))
  }

  const handleSizeStockChange = (index: number, field: "size_name" | "stock_quantity", value: string) => {
    setSizeStocks((prev) =>
      prev.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              [field]: value,
              ...(field === "size_name" ? { size_id: null } : {}),
            }
          : item
      )
    )
  }

  const addSizeStockRow = () => {
    setSizeStocks((prev) => [...prev, { size_id: null, size_name: "", stock_quantity: "0" }])
  }

  const removeSizeStockRow = (index: number) => {
    setSizeStocks((prev) => {
      if (prev.length <= 1) {
        return [{ size_id: null, size_name: "", stock_quantity: "0" }]
      }

      return prev.filter((_, currentIndex) => currentIndex !== index)
    })
  }

  const resolveImageUrl = (url: string) => {
    if (!url) {
      return ""
    }

    if (/^https?:\/\//i.test(url)) {
      return url
    }

    return getApiUrl(url.startsWith("/") ? url : `/${url}`)
  }

  const handleEnableImageUpdate = (imageId: number | string | null) => {
    setExistingImages((prev) =>
      prev.map((image) =>
        image.id === imageId
          ? {
              ...image,
              isUpdating: true,
            }
          : image
      )
    )
  }

  const handleReplacementFileChange = (imageId: number | string | null, event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null

    setExistingImages((prev) =>
      prev.map((image) =>
        image.id === imageId
          ? {
              ...image,
              replacementFile: selectedFile,
            }
          : image
      )
    )
  }

  const handleRemoveExistingImage = (imageId: number | string | null) => {
    setExistingImages((prev) => prev.filter((image) => image.id !== imageId))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({
      formData,
      sizeStocks,
      existingImages,
      newImages,
    })
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
        <div className="admin-card-header">
          <h2>{mode === "edit" ? "Edit Product" : "Create Product"}</h2>
          <button type="button" className="button button-secondary" onClick={onClose} disabled={submitting}>
            Close
          </button>
        </div>

        {loadingDetail ? (
          <p>Loading product data...</p>
        ) : (
          <>
            {error && <p className="admin-form-message error">{error}</p>}

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
                <select id="category_id" name="category_id" value={formData.category_id} onChange={handleChange} required>
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
                <select id="product_type_id" name="product_type_id" value={formData.product_type_id} onChange={handleChange}>
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
                      disabled={submitting}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" className="button button-secondary" onClick={addSizeStockRow} disabled={submitting}>
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
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  required
                />
              </div>

              {mode === "edit" && (
                <div className="form-group form-group-full">
                  <label>Current product images</label>

                  {existingImages.length === 0 ? (
                    <small className="admin-form-hint">No current images.</small>
                  ) : (
                    <div className="edit-product-image-list">
                      {existingImages.map((image, index) => (
                        <div className="edit-product-image-item" key={image.id ?? `${image.image_url}-${index}`}>
                          <img
                            className="edit-product-image-preview"
                            src={resolveImageUrl(image.image_url)}
                            alt={`Product image ${index + 1}`}
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
                              disabled={submitting}
                            >
                              Update img
                            </button>
                            <button
                              type="button"
                              className="button button-action button-delete"
                              onClick={() => handleRemoveExistingImage(image.id)}
                              disabled={submitting}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="form-group form-group-full">
                <label htmlFor="images">{mode === "edit" ? "Add new images" : "Images"} (max 10 files)</label>
                <input id="images" name="images" type="file" accept="image/*" multiple onChange={handleImageChange} />
                <small className="admin-form-hint">Selected: {newImages.length} image(s)</small>
              </div>

              <div className="admin-form-actions form-group-full">
                <button type="submit" className="button" disabled={submitting}>
                  {submitting ? (mode === "edit" ? "Updating..." : "Creating...") : mode === "edit" ? "Update product" : "Create product"}
                </button>
                <button type="button" className="button button-secondary" onClick={onClose} disabled={submitting}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ProductFormModal
