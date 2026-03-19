import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useState } from "react"
import { getApiUrl } from "../../config/config.js"

function CreateAccount() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    role: "",
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
    setIsSubmitting(true)

    try {
      await axios.post(getApiUrl("/users"), {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone_number: formData.phone_number,
      })

      setSuccess("Tạo tài khoản thành công")
      setFormData({
        username: "",
        email: "",
        password: "",
        phone_number: "",
        role: "",
      })
      setTimeout(() => {
        navigate("/admin/account")
      }, 500)
    } catch (err) {
      setError(err.response?.data?.message || "Tạo tài khoản thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
        <h2>Create New Account</h2>
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
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
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
            <button type="submit" className="button" disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Create Account"}
            </button>
        </form>
    </div>
    )
}
export default CreateAccount