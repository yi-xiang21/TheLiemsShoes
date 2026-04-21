import type { AccountType } from "../../pages/admin/Account"

interface AccountTableProps {
  users: AccountType[]
  loading: boolean
  deletingId: number | null
  onEdit: (user: AccountType) => void
  onDelete: (userId: number) => void
}

function AccountTable({ users, loading, deletingId, onEdit, onDelete }: AccountTableProps) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>UserName</th>
          <th>Email</th>
          <th>Role</th>
          <th>Phone Number</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {!loading && users.length === 0 && (
          <tr>
            <td colSpan={6}>No users found</td>
          </tr>
        )}
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.phone_number}</td>
            <td>
              <button className="button" onClick={() => onEdit(user)}>
                Edit
              </button>
              <button className="button" onClick={() => onDelete(user.id)} disabled={deletingId === user.id}>
                {deletingId === user.id ? "Deleting..." : "Delete"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default AccountTable
