import { useState } from "react"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { Link } from "react-router-dom"
import "../assets/css/login&Register.css"

function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Đăng nhập</h1>
        <form className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Nhập email của bạn"
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
                placeholder="Nhập mật khẩu"
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