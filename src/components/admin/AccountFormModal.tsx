import { useEffect, useState } from "react"
import type { AccountType, AccountFormData, AccountModalMode } from "../../pages/admin/Account"

const EMPTY_FORM: AccountFormData = {
  username: "",
  email: "",
  password: "",
  phone_number: "",
  role: "",
}

interface AccountFormModalProps {
  isOpen: boolean
  mode: AccountModalMode
  user: AccountType | null
  submitting: boolean
  onClose: () => void
  onSubmit: (formData: AccountFormData) => void
}

function AccountFormModal({ isOpen, mode, user, submitting, onClose, onSubmit }: AccountFormModalProps) {
  const [formData, setFormData] = useState<AccountFormData>(EMPTY_FORM)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (mode === "edit" && user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "",
        phone_number: user.phone_number || "",
        role: user.role || "",
      })
      return
    }

    setFormData(EMPTY_FORM)
  }, [isOpen, mode, user])

  if (!isOpen) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isEditMode = mode === "edit"

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-card-header">
          <h2>{isEditMode ? "Edit Account" : "Create New Account"}</h2>
          <button type="button" className="button button-secondary" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="create-account-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          {!isEditMode && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <button type="submit" className="button" disabled={submitting}>
            {submitting ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Account" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AccountFormModal
