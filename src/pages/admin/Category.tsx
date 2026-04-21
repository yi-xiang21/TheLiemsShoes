import { useEffect, useState } from "react"
import axios from "axios"
import { getApiUrl } from "../../config/config.js"
import "../../assets/css/category.css"
import CategoryTable from "../../components/admin/CategoryTable"
import CategoryFormModal from "../../components/admin/CategoryFormModal"

export interface CategoryType {
  id: number
  category_name: string
  description: string | null
}

export interface CategoryFormData {
  category_name: string
  description: string
}

export type CategoryModalMode = "create" | "edit"

function Category() {
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<CategoryModalMode>("create")
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get(getApiUrl("/categories"))
      setCategories(response.data.data || [])
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching categories")
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setModalMode("create")
    setSelectedCategory(null)
    setIsModalOpen(true)
    setError("")
  }

  const openEditModal = (category: CategoryType) => {
    setModalMode("edit")
    setSelectedCategory(category)
    setIsModalOpen(true)
    setError("")
  }

  const closeModal = () => {
    if (isSubmitting) {
      return
    }
    setIsModalOpen(false)
    setSelectedCategory(null)
  }

  const handleUpsert = async (formData: CategoryFormData) => {
    setError("")
    setIsSubmitting(true)

    try {
      if (modalMode === "create") {
        const response = await axios.post(getApiUrl("/categories"), {
          category_name: formData.category_name.trim(),
          description: formData.description.trim() || null,
        })

        const createdCategory = response.data?.data
        if (createdCategory?.id) {
          setCategories((prev) => [createdCategory, ...prev])
        } else {
          await fetchCategories()
        }
      } else {
        if (!selectedCategory?.id) {
          throw new Error("Category not found")
        }

        await axios.put(getApiUrl(`/categories/${selectedCategory.id}`), {
          category_name: formData.category_name.trim(),
          description: formData.description.trim() || null,
        })

        setCategories((prev) =>
          prev.map((category) =>
            category.id === selectedCategory.id
              ? {
                  ...category,
                  category_name: formData.category_name.trim(),
                  description: formData.description.trim() || null,
                }
              : category
          )
        )
      }

      closeModal()
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save category")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return
    }

    setError("")
    setDeletingId(categoryId)
    try {
      await axios.delete(getApiUrl(`/categories/${categoryId}`))
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryId))
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete category")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="category-container">
      <div className="category-header">
        <h1>Category Management</h1>
        <button className="btn-add-category" onClick={openCreateModal}>
          + Add Category
        </button>
      </div>

      {error && <div className="error-message" style={{ marginBottom: "16px" }}>{error}</div>}

      {loading ? (
        <div className="category-loading">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : categories.length > 0 ? (
        <CategoryTable
          categories={categories}
          loading={loading}
          deletingId={deletingId}
          onEdit={openEditModal}
          onDelete={handleDeleteCategory}
        />
      ) : (
        <div className="no-categories">
          <p>No categories found. Add a new category to get started.</p>
          <button className="btn-add-category" onClick={openCreateModal}>
            + Add Category Now
          </button>
        </div>
      )}

      <CategoryFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        category={selectedCategory}
        submitting={isSubmitting}
        error={error}
        onClose={closeModal}
        onSubmit={handleUpsert}
      />
    </div>
  )
}

export default Category
