import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import { getApiUrl } from "../../config/config.js"

function Account() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(getApiUrl("/users"))
        setUsers(res.data.data)
      } catch {
        setError("Unable to load user list (check if https://be-theliemsshoes.onrender.com is available)")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this account?")
    if (!confirmed) {
      return
    }

    setError("")
    setDeletingId(userId)
    try {
      await axios.delete(getApiUrl(`/users/${userId}`))
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <h2>Account Management</h2>
        <button className="button" onClick={() => navigate("/admin/CreateAccount")}>
          + Add New Account
        </button>
      </div>
      <div className="admin-card-body">
        {loading && <p>Loading data... (If loading takes more than 30s, open https://be-theliemsshoes.onrender.com to wake the API)</p>}
        {error && <p>{error}</p>}

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
                <td colSpan="6">No users found</td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id }>
                <td>{user.id }</td>
                <td>{user.username }</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.phone_number}</td>
                <td>
                  <button
                    className="button"
                    onClick={() => navigate("/admin/EditAccount", { state: { user } })}
                  >
                    Edit
                  </button>
                  <button
                    className="button"
                    onClick={() => handleDelete(user.id)}
                    disabled={deletingId === user.id}
                  >
                    {deletingId === user.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Account