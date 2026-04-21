import type { ProductItem, ProductTypeOption } from "../../pages/admin/Products"

interface ProductTableProps {
  products: ProductItem[]
  productTypes: ProductTypeOption[]
  loading: boolean
  deletingId: number | null
  onEdit: (product: ProductItem) => void
  onDelete: (productId: number) => void
}

function ProductTable({ products, productTypes, loading, deletingId, onEdit, onDelete }: ProductTableProps) {
  const columns = [
    { field: "id", label: "Product ID" },
    { field: "product_name", label: "Product Name" },
    { field: "price", label: "Price" },
    { field: "stock_quantity", label: "Stock" },
    { field: "category_name", label: "Category" },
    { field: "product_type_name", label: "Product Type" },
  ]

  const formatCellValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") {
      return "-"
    }

    if (typeof value === "string" && !Number.isNaN(Date.parse(value)) && value.includes("T")) {
      return new Date(value).toLocaleString("vi-VN")
    }

    return String(value)
  }

  return (
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
        {!loading && products.length === 0 ? (
          <tr>
            <td colSpan={columns.length + 1}>No products found</td>
          </tr>
        ) : (
          products.map((product) => (
            <tr key={product.id}>
              {columns.map((column) => {
                const value =
                  column.field === "product_type_name"
                    ? productTypes.find((type) => type.id === product.product_type_id)?.type_name
                    : product[column.field as keyof ProductItem]

                return <td key={`${product.id}-${column.field}`}>{formatCellValue(value)}</td>
              })}
              <td>
                <div className="admin-row-actions">
                  <button className="button button-action" onClick={() => onEdit(product)}>
                    Edit
                  </button>
                  <button
                    className="button button-action button-delete"
                    onClick={() => onDelete(product.id)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

export default ProductTable
