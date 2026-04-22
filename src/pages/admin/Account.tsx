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
  id?: number | null
  username: string
  email: string
  password: string
  phone_number: string
  role: string
}

const EMPTY_FORM: AccountFormData = {
  id: null,
  username: "",
  email: "",
  password: "",
  phone_number: "",
  role: "",
}

function Account() {
  const [users, setUsers] = useState<AccountType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<AccountFormData>(EMPTY_FORM)
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
    setFormData(EMPTY_FORM)
    setIsModalOpen(true)
    setError("")
  }

  const openEditModal = (user: AccountType) => {
    setFormData({
      id: user.id,
      username: user.username || "",
      email: user.email || "",
      password: "",
      phone_number: user.phone_number || "",
      role: user.role || "",
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
        await axios.put(getApiUrl(`/users/${formData.id}`), {
          username: formData.username,
          email: formData.email,
          role: formData.role,
          phone_number: formData.phone_number,
        })

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === formData.id
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

      setIsModalOpen(false)
      setFormData(EMPTY_FORM)
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
    try {
      await axios.delete(getApiUrl(`/users/${userId}`))
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete account")
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

        <AccountTable 
        users={users} 
        loading={loading} 
        onEdit={openEditModal} 
        onDelete={handleDelete} 
        />
      </div>

      <AccountFormModal
        isOpen={isModalOpen}
        formData={formData}
        submitting={isSubmitting}
        onChange={setFormData}
        onClose={closeModal}
        onSubmit={handleUpsert}
      />
    </section>
  )
}

export default Account
