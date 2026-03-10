import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

function EditAccount() {
    const navigate = useNavigate()
    const location = useLocation()
    const selectedUser = location.state?.user

    const [formData, setFormData] = useState({
        username: selectedUser?.username || "",
        email: selectedUser?.email || "",
        phone_number: selectedUser?.phone_number || "",
        role: selectedUser?.role || "",
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!selectedUser?.id) {
            setError("Khong tim thay tai khoan can sua. Vui long quay lai trang danh sach.")
            return
        }

        setIsSubmitting(true)
        try {
            await axios.put(`http://localhost:3000/api/users/${selectedUser.id}`, {
                username: formData.username,
                email: formData.email,
                role: formData.role,
                phone_number: formData.phone_number,
            })
            setSuccess("Cap nhat tai khoan thanh cong")
            setTimeout(() => {
                navigate("/admin/account")
            }, 500)
        } catch (err) {
            setError(err.response?.data?.message || "Cap nhat tai khoan that bai")
        } finally {
            setIsSubmitting(false)
        }
    }

  return (
    <div>
        <h2>Edit Account</h2>
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
        <form className="create-account-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="phone_number">Phone Number</label>
                <input type="text" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="role">Role</label>
                <select id="role" name="role" value={formData.role} onChange={handleChange} required>
                    <option value="">Select Role</option>   
                    <option value="admin">Admin</option>
                    <option value="customer">Customer</option>
                </select>
            </div>
            <button type="submit" className="button" disabled={isSubmitting || !selectedUser?.id}>
                {isSubmitting ? "Dang cap nhat..." : "Update Account"}
            </button>
        </form>
    </div>
    )
}
export default EditAccount