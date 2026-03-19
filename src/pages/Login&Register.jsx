import { useState } from "react"
import { FiEye, FiEyeOff } from "react-icons/fi"
import "../assets/css/login&Register.css"
import axios from "axios"
import { getApiUrl } from "../config/config"
import { useNavigate } from "react-router-dom"
import LoginBanner from "../assets/images/pictureLogin.jpg"

function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState("login")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    role: "customer",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setError("")
    setSuccess("")
  }

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      const response = await axios.post(getApiUrl("/auth/login"), {
        email: loginData.email,
        password: loginData.password,
      })

      const token = response.data?.token
      if (token) {
        localStorage.setItem("token", token)
      }

      setSuccess("Đăng nhập thành công")
      setLoginData({
        email: "",
        password: "",
      })
      setTimeout(() => {
        navigate("/")
      }, 700)
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.code === "ERR_NETWORK") {
        setError("Không kết nối được API. Kiểm tra BE đang chạy và CORS.")
      } else {
        setError("Đăng nhập thất bại")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      await axios.post(getApiUrl("/auth/register"), {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        role: registerData.role,
        phone_number: registerData.phone_number,
      })

      setSuccess("Tạo tài khoản thành công")
      setRegisterData({
        username: "",
        email: "",
        password: "",
        phone_number: "",
        role: "customer",
      })
      setTimeout(() => {
        switchMode("login")
      }, 700)
    } catch (err) {
      setError(err.response?.data?.message || "Tạo tài khoản thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page auth-page-split">
      <div className={`auth-shell ${mode === "register" ? "auth-shell--register" : ""}`}>
        <div className="auth-visual" aria-hidden="true">
          <img src={LoginBanner} alt="" />
        </div>

        <div className="auth-card">
          <h1 className="auth-title">{mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}</h1>
          {error && <p className="auth-message auth-message-error">{error}</p>}
          {success && <p className="auth-message auth-message-success">{success}</p>}

          {mode === "login" ? (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Nhập email của bạn"
                  required
                  value={loginData.email}
                  onChange={handleLoginChange}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="password">Mật khẩu</label>
                <div className="auth-password-wrap">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Nhập mật khẩu"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    aria-label={showLoginPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showLoginPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <button type="submit" className="auth-btn auth-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="auth-field">
                <label htmlFor="username">Tên đăng nhập</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>
              <div className="auth-field">
                <label htmlFor="register-email">Email</label>
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="Nhập email"
                  required
                />
              </div>
              <div className="auth-field">
                <label htmlFor="register-password">Mật khẩu</label>
                <div className="auth-password-wrap">
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    id="register-password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="Tạo mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowRegisterPassword((prev) => !prev)}
                    aria-label={showRegisterPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showRegisterPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="phone_number">Số điện thoại</label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={registerData.phone_number}
                  onChange={handleRegisterChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
              <button type="submit" className="auth-btn auth-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tạo tài khoản"}
              </button>
            </form>
          )}

          <div className="auth-footer">
            {mode === "login" ? (
              <>
                <span>Chưa có tài khoản?</span>
                <button
                  type="button"
                  className="auth-btn auth-btn-outline"
                  onClick={() => switchMode("register")}
                >
                  Tạo tài khoản
                </button>
              </>
            ) : (
              <>
                <span>Đã có tài khoản?</span>
                <button
                  type="button"
                  className="auth-btn auth-btn-outline"
                  onClick={() => switchMode("login")}
                >
                  Quay lại đăng nhập
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login