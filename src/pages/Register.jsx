import { useState } from "react"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { Link } from "react-router-dom"
import "../assets/css/login&Register.css"

function Register() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Tạo tài khoản</h1>
        <form className="auth-form">
          <div className="auth-field">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Nhập họ và tên"
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
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
          <button type="submit" className="auth-btn auth-btn-primary">
            Tạo tài khoản
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