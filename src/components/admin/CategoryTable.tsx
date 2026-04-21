import type { CategoryType } from "../../pages/admin/Category"

interface CategoryTableProps {
  categories: CategoryType[]
  loading: boolean
  onEdit: (category: CategoryType) => void
  onDelete: (categoryId: number) => void
}

function CategoryTable({ categories, loading, onEdit, onDelete }: CategoryTableProps) {
  return (
    <div className="category-table-wrapper">
      <table className="category-table">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>ID</th>
            <th style={{ width: "20%" }}>Category Name</th>
            <th style={{ width: "50%" }}>Description</th>
            <th style={{ width: "20%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!loading && categories.length === 0 && (
            <tr>
              <td colSpan={4}>No categories found</td>
            </tr>
          )}
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="category-id">{category.id}</td>
              <td className="category-name">{category.category_name}</td>
              <td className="category-description">{category.description || "-"}</td>
              <td className="category-actions">
                <button className="btn-edit" onClick={() => onEdit(category)}>
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(category.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CategoryTable
