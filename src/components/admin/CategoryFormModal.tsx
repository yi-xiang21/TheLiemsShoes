import { useState } from "react"
import type { CategoryFormData } from "../../pages/admin/Category"

interface CategoryFormModalProps {
  isOpen: boolean
  formData: CategoryFormData
  submitting: boolean
  error: string
  onChange: React.Dispatch<React.SetStateAction<CategoryFormData>>
  onClose: () => void
  onSubmit: () => void
}

function CategoryFormModal({ isOpen, formData, submitting, error, onChange, onClose, onSubmit }: CategoryFormModalProps) {

  if (!isOpen) {
    return null
  }



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  const isEditMode = Boolean(formData.id)

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
            {error && <div className="error-message form-error-block">{error}</div>}

            <div className="form-group required">
              <label htmlFor="category_name">Category Name</label>
              <input
                type="text"
                id="category_name"
                name="category_name"
                value={formData.category_name}
                onChange={(e) => onChange({...formData, category_name: e.target.value})}
                placeholder="Enter category name"
                disabled={submitting}
                maxLength={100}
              />
              <small className="field-counter">
                {formData.category_name.length}/100 characters
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => onChange({...formData, description: e.target.value})}
                placeholder="Enter category description (optional)"
                disabled={submitting}
                maxLength={500}
              />
              <small className="field-counter">
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
