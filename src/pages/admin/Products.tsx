import { useEffect, useState } from "react"
import axios from "axios"
import { getApiUrl } from "../../config/config.js"
import ProductTable from "../../components/admin/ProductTable"
import ProductFormModal from "../../components/admin/ProductFormModal"

export interface CategoryOption {
  id: number
  category_name: string
}

export interface ProductTypeOption {
  id: number
  type_name: string
}

export interface ProductSize {
  size_id: number | null
  size_name: string
  stock_quantity: number
}

export interface ProductImage {
  id?: number | string | null
  image_url: string
}

export interface ProductItem {
  id: number
  product_name: string
  price: number | string
  description?: string
  stock_quantity?: number
  category_name?: string
  category_id?: number | null
  product_type_id?: number | null
  sizes?: ProductSize[]
  images?: ProductImage[]
  [key: string]: unknown
}

export interface ProductFormState {
  product_name: string
  price: string
  description: string
  category_id: string
  product_type_id: string
}

export interface SizeStockInput {
  size_id: number | null
  size_name: string
  stock_quantity: string
}

export interface ExistingImageInput {
  id: number | string | null
  image_url: string
  isUpdating: boolean
  replacementFile: File | null
}

export interface ProductSubmitPayload {
  formData: ProductFormState
  sizeStocks: SizeStockInput[]
  existingImages: ExistingImageInput[]
  newImages: File[]
}

export type ProductModalMode = "create" | "edit"

function Products() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [productTypes, setProductTypes] = useState<ProductTypeOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ProductModalMode>("create")
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        setError("")

        const [productsResponse, categoriesResponse, productTypesResponse] = await Promise.all([
          axios.get(getApiUrl("/products")),
          axios.get(getApiUrl("/categories")),
          axios.get(getApiUrl("/products/types")),
        ])

        setProducts(Array.isArray(productsResponse.data?.data) ? productsResponse.data.data : [])
        setCategories(Array.isArray(categoriesResponse.data?.data) ? categoriesResponse.data.data : [])
        setProductTypes(Array.isArray(productTypesResponse.data?.data) ? productTypesResponse.data.data : [])
      } catch (err: any) {
        setError(err.response?.data?.message || "Unable to load product list")
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  const refreshProductList = async () => {
    const productsResponse = await axios.get(getApiUrl("/products"))
    setProducts(Array.isArray(productsResponse.data?.data) ? productsResponse.data.data : [])
  }

  const openCreateModal = () => {
    setModalMode("create")
    setSelectedProduct(null)
    setIsModalOpen(true)
    setError("")
  }

  const openEditModal = async (product: ProductItem) => {
    try {
      setError("")
      setLoadingDetail(true)
      setModalMode("edit")
      setIsModalOpen(true)

      const response = await axios.get(getApiUrl(`/products/${product.id}`))
      const productData = response.data?.data
      if (!productData) {
        throw new Error("Unable to load product details")
      }

      setSelectedProduct(productData)
    } catch (err: any) {
      setError(err.response?.data?.message || "Unable to load product details")
      setIsModalOpen(false)
    } finally {
      setLoadingDetail(false)
    }
  }

  const closeModal = () => {
    if (isSubmitting || loadingDetail) {
      return
    }
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      setError("")
      setDeletingId(productId)
      await axios.delete(getApiUrl(`/products/${productId}`))
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId))
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete product")
    } finally {
      setDeletingId(null)
    }
  }

  const handleUpsert = async (payload: ProductSubmitPayload) => {
    setError("")

    const { formData, sizeStocks, existingImages, newImages } = payload

    if (!formData.product_name.trim() || !formData.price || !formData.description.trim() || !formData.category_id) {
      setError("Please fill in all required fields")
      return
    }

    const normalizedSizeStocks = sizeStocks
      .map((item) => {
        const normalizedName = String(item.size_name || "").trim()
        const numericSizeId = Number(item.size_id)
        const hasValidSizeId = Number.isInteger(numericSizeId) && numericSizeId > 0

        return {
          size_id: hasValidSizeId ? numericSizeId : null,
          size_name: normalizedName,
          stock_quantity: Number(item.stock_quantity),
        }
      })
      .filter((item) => item.size_name || item.size_id)

    if (!normalizedSizeStocks.length) {
      setError("Please add at least one valid size")
      return
    }

    if (normalizedSizeStocks.some((item) => !Number.isInteger(item.stock_quantity) || item.stock_quantity < 0)) {
      setError("Stock quantity for each size must be a non-negative integer")
      return
    }

    const duplicateKey = normalizedSizeStocks.find((item, index) => {
      const key = item.size_id ? `id-${item.size_id}` : `name-${item.size_name.toLowerCase()}`
      return (
        normalizedSizeStocks.findIndex((candidate) => {
          const candidateKey = candidate.size_id
            ? `id-${candidate.size_id}`
            : `name-${candidate.size_name.toLowerCase()}`
          return candidateKey === key
        }) !== index
      )
    })

    if (duplicateKey) {
      setError("Duplicate size detected, please review your size list")
      return
    }

    const totalStockQuantity = normalizedSizeStocks.reduce((sum, item) => sum + item.stock_quantity, 0)

    try {
      setIsSubmitting(true)

      const body = new FormData()
      body.append("product_name", formData.product_name.trim())
      body.append("price", formData.price)
      body.append("description", formData.description.trim())
      body.append("category_id", formData.category_id)
      body.append("stock_quantity", String(totalStockQuantity))
      body.append("size_stocks", JSON.stringify(normalizedSizeStocks))

      if (formData.product_type_id) {
        body.append("product_type_id", formData.product_type_id)
      }

      const replacementFiles = existingImages
        .filter((image) => image.isUpdating && image.replacementFile)
        .map((image) => image.replacementFile as File)

      const keptImageUrls = existingImages
        .filter((image) => !(image.isUpdating && image.replacementFile))
        .map((image) => image.image_url)
        .filter(Boolean)

      const allFilesToUpload = [...replacementFiles, ...newImages]
      if (keptImageUrls.length + allFilesToUpload.length > 10) {
        setError("Total product images must not exceed 10 files")
        return
      }

      allFilesToUpload.forEach((file) => {
        body.append("images", file)
      })

      if (modalMode === "edit") {
        if (!selectedProduct?.id) {
          setError("Unable to identify product for update")
          return
        }

        body.append("image_urls", JSON.stringify(keptImageUrls))
        await axios.put(getApiUrl(`/products/${selectedProduct.id}`), body)
      } else {
        await axios.post(getApiUrl("/products"), body)
      }

      await refreshProductList()
      closeModal()
    } catch (err: any) {
      setError(err.response?.data?.message || (modalMode === "edit" ? "Failed to update product" : "Failed to create product"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <h2>Product Management</h2>
        <button className="button button-add-product" onClick={openCreateModal}>
          + Add New Product
        </button>
      </div>

      <div className="admin-card-body admin-table-wrap">
        {loading && <p>Loading products...</p>}
        {error && <p>{error}</p>}

        {!loading && (
          <ProductTable
            products={products}
            productTypes={productTypes}
            loading={loading}
            deletingId={deletingId}
            onEdit={openEditModal}
            onDelete={handleDeleteProduct}
          />
        )}
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        product={selectedProduct}
        categories={categories}
        productTypes={productTypes}
        loadingDetail={loadingDetail}
        submitting={isSubmitting}
        error={error}
        onClose={closeModal}
        onSubmit={handleUpsert}
      />
    </section>
  )
}

export default Products
