import { useState } from "react"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { getApiUrl } from "../config/config"
import "../assets/css/login&Register.css"

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    role: "customer",
  })
  const [showPassword, setShowPassword] = useState(false)
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
        role: "customer",
      })
      setTimeout(() => {
        navigate("/Login")
      }, 700)
    } catch (err) {
      setError(err.response?.data?.message || "Tạo tài khoản thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Tạo tài khoản</h1>
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Mật khẩu</label>
            <div className="auth-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tạo mật khẩu"
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <div className="auth-field">
            <label htmlFor="phone_number">Số điện thoại</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              required
            />
          </div>
          <button type="submit" className="auth-btn auth-btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo tài khoản"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Đã có tài khoản?</span>
          <Link to="/Login" className="auth-btn auth-btn-outline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Register