import axios from "axios"
import { useEffect, useState } from "react"
import { getApiUrl } from "../../config/config.js"
import AccountTable from "../../components/admin/AccountTable"
import AccountFormModal from "../../components/admin/AccountFormModal"

export interface AccountType {
  id: number
  username: string
  email: string
  role: string
  phone_number: string
}

export interface AccountFormData {
  username: string
  email: string
  password: string
  phone_number: string
  role: string
}

export type AccountModalMode = "create" | "edit"

function Account() {
  const [users, setUsers] = useState<AccountType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<AccountModalMode>("create")
  const [selectedUser, setSelectedUser] = useState<AccountType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const openCreateModal = () => {
    setModalMode("create")
    setSelectedUser(null)
    setIsModalOpen(true)
    setError("")
  }

  const openEditModal = (user: AccountType) => {
    setModalMode("edit")
    setSelectedUser(user)
    setIsModalOpen(true)
    setError("")
  }

  const closeModal = () => {
    if (isSubmitting) {
      return
    }
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleUpsert = async (formData: AccountFormData) => {
    setError("")
    setIsSubmitting(true)

    try {
      if (modalMode === "create") {
        const res = await axios.post(getApiUrl("/users"), {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone_number: formData.phone_number,
        })

        const createdUser = res.data?.data
        if (createdUser?.id) {
          setUsers((prevUsers) => [createdUser, ...prevUsers])
        } else {
          const reload = await axios.get(getApiUrl("/users"))
          setUsers(reload.data.data || [])
        }
      } else {
        if (!selectedUser?.id) {
          throw new Error("Cannot find account id")
        }

        await axios.put(getApiUrl(`/users/${selectedUser.id}`), {
          username: formData.username,
          email: formData.email,
          role: formData.role,
          phone_number: formData.phone_number,
        })

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id
              ? {
                  ...user,
                  username: formData.username,
                  email: formData.email,
                  role: formData.role,
                  phone_number: formData.phone_number,
                }
              : user
          )
        )
      }

      closeModal()
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save account")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (userId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this account?")
    if (!confirmed) {
      return
    }

    setError("")
    setDeletingId(userId)
    try {
      await axios.delete(getApiUrl(`/users/${userId}`))
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete account")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <h2>Account Management</h2>
        <button className="button" onClick={openCreateModal}>
          + Add New Account
        </button>
      </div>
      <div className="admin-card-body">
        {loading && <p>Loading data... (If loading takes more than 30s, open https://be-theliemsshoes.onrender.com to wake the API)</p>}
        {error && <p>{error}</p>}

        <AccountTable users={users} loading={loading} deletingId={deletingId} onEdit={openEditModal} onDelete={handleDelete} />
      </div>

      <AccountFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        user={selectedUser}
        submitting={isSubmitting}
        onClose={closeModal}
        onSubmit={handleUpsert}
      />
    </section>
  )
}

export default Account
