import { useState } from "react"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { Link } from "react-router-dom"
import "../assets/css/login&Register.css"
//fix login
function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      await axios.post(getApiUrl("/auth/login"), {
    
        email: formData.email,
        password: formData.password,
      })

      setSuccess("Đăng nhập thành công")
      setFormData({

        email: "",
        password: "",

      })
      setTimeout(() => {
        navigate("/Login")
      }, 700)
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Đăng nhập</h1>
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Nhập email của bạn"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Mật khẩu</label>
            <div className="auth-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Nhập mật khẩu"
                required
                value={formData.password}
                onChange={handleChange}

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
          <button type="submit" className="auth-btn auth-btn-primary">
            Đăng nhập
          </button>
        </form>

        <div className="auth-footer">
          <span>Chưa có tài khoản?</span>
          <Link to="/Register" className="auth-btn auth-btn-outline">
            Tạo tài khoản
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Login