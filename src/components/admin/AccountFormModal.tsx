import type { AccountFormData } from "../../pages/admin/Account"

interface AccountFormModalProps {
  isOpen: boolean
  formData: AccountFormData
  submitting: boolean
  onChange: React.Dispatch<React.SetStateAction<AccountFormData>>
  onClose: () => void
  onSubmit: () => void
}

function AccountFormModal({ isOpen, formData, submitting, onChange, onClose, onSubmit }: AccountFormModalProps) {
  if (!isOpen) {
    return null
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  const isEditMode = Boolean(formData.id)

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
            <input type="text" id="username" name="username" value={formData.username} onChange={(e)=> onChange({...formData,username: e.target.value})} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={(e)=> onChange({...formData,email: e.target.value})} required />
          </div>

          {!isEditMode && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={(e)=> onChange({...formData,password: e.target.value})} required />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={(e)=> onChange({...formData,phone_number: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={formData.role} onChange={(e)=> onChange({...formData,role: e.target.value})} required>
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
