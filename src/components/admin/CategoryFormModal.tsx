import { useEffect, useState } from "react"
import type { CategoryFormData, CategoryModalMode, CategoryType } from "../../pages/admin/Category"

const EMPTY_FORM: CategoryFormData = {
  category_name: "",
  description: "",
}

interface CategoryFormModalProps {
  isOpen: boolean
  mode: CategoryModalMode
  category: CategoryType | null
  submitting: boolean
  error: string
  onClose: () => void
  onSubmit: (formData: CategoryFormData) => void
}

function CategoryFormModal({ isOpen, mode, category, submitting, error, onClose, onSubmit }: CategoryFormModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (mode === "edit" && category) {
      setFormData({
        category_name: category.category_name || "",
        description: category.description || "",
      })
      setFormErrors({})
      return
    }

    setFormData(EMPTY_FORM)
    setFormErrors({})
  }, [isOpen, mode, category])

  if (!isOpen) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.category_name.trim()) {
      newErrors.category_name = "Category name is required"
    }

    if (formData.category_name.trim().length < 2) {
      newErrors.category_name = "Category name must have at least 2 characters"
    }

    if (formData.category_name.trim().length > 100) {
      newErrors.category_name = "Category name must not exceed 100 characters"
    }

    if (formData.description.trim().length > 500) {
      newErrors.description = "Description must not exceed 500 characters"
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    onSubmit(formData)
  }

  const isEditMode = mode === "edit"

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h1>{isEditMode ? "Edit Category" : "Add New Category"}</h1>
          <button className="btn-back" onClick={onClose} type="button" disabled={submitting}>
            Close
          </button>
        </div>

        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message" style={{ marginBottom: "20px" }}>{error}</div>}

            <div className="form-group required">
              <label htmlFor="category_name">Category Name</label>
              <input
                type="text"
                id="category_name"
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
                placeholder="Enter category name"
                disabled={submitting}
                maxLength={100}
              />
              {formErrors.category_name && <div className="error-message">{formErrors.category_name}</div>}
              <small style={{ color: "#999", fontSize: "12px", marginTop: "5px", display: "block" }}>
                {formData.category_name.length}/100 characters
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter category description (optional)"
                disabled={submitting}
                maxLength={500}
              />
              {formErrors.description && <div className="error-message">{formErrors.description}</div>}
              <small style={{ color: "#999", fontSize: "12px", marginTop: "5px", display: "block" }}>
                {formData.description.length}/500 characters
              </small>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Save Changes" : "Create Category"}
              </button>
              <button type="button" className="btn-cancel" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CategoryFormModal
