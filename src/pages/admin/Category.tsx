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
  id?: number | null
  category_name: string
  description: string
}

const EMPTY_FORM: CategoryFormData = {
  id: null,
  category_name: "",
  description: "",
}

function Category() {
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<CategoryFormData>(EMPTY_FORM)
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
    setFormData(EMPTY_FORM)
    setIsModalOpen(true)
    setError("")
  }

  const openEditModal = (category: CategoryType) => {
    setFormData({
      id: category.id,
      category_name: category.category_name || "",
      description: category.description || "",
    })
    setIsModalOpen(true)
    setError("")
  }

  const closeModal = () => {
    if (isSubmitting) {
      return
    }
    setIsModalOpen(false)
    setFormData(EMPTY_FORM)
  }

  const handleUpsert = async () => {
    setError("")
    setIsSubmitting(true)

    try {
      if (!formData.id) {
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
        await axios.put(getApiUrl(`/categories/${formData.id}`), {
          category_name: formData.category_name.trim(),
          description: formData.description.trim() || null,
        })

        setCategories((prev) =>
          prev.map((category) =>
            category.id === formData.id
              ? {
                  ...category,
                  category_name: formData.category_name.trim(),
                  description: formData.description.trim() || null,
                }
              : category
          )
        )
      }

      setIsModalOpen(false)
      setFormData(EMPTY_FORM)
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
    try {
      await axios.delete(getApiUrl(`/categories/${categoryId}`))
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryId))
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete category")
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

      {error && <div className="error-message category-page-error">{error}</div>}

      {loading ? (
        <div className="category-loading">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : categories.length > 0 ? (
        <CategoryTable
          categories={categories}
          loading={loading}
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
        formData={formData}
        submitting={isSubmitting}
        error={error}
        onChange={setFormData}
        onClose={closeModal}
        onSubmit={handleUpsert}
      />
    </div>
  )
}

export default Category
