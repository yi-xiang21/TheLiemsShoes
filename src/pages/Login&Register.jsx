import { useState } from "react"
import { FiEye, FiEyeOff } from "react-icons/fi"
import "../assets/css/login&Register.css"
import axios from "axios"
import { getApiUrl } from "../config/config.js"
import { useNavigate } from "react-router-dom"
import LoginBanner from "../assets/images/pictureLogin.jpg"
import { useAuth } from "../context/useAuth.js"
import UserLoadingOverlay from "../components/shared/UserLoadingOverlay.jsx"

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
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
      const id=response.data?.user?.id
      const role=response.data?.user?.role
      if (token) {
        login(token, id, role)
      }

      
       

      setSuccess("Login successful")
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
        setError("Cannot connect to API. Check that the backend is running and CORS is configured.")
      } else {
        setError("Login failed")
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

      setSuccess("Account created successfully")
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
      setError(err.response?.data?.message || "Account creation failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page auth-page-split">
      <UserLoadingOverlay
        show={isSubmitting}
        text={mode === "login" ? "Signing in..." : "Creating account..."}
      />
      <div className={`auth-shell ${mode === "register" ? "auth-shell--register" : ""}`}>
        <div className="auth-visual" aria-hidden="true">
          <img src={LoginBanner} alt="" />
        </div>

        <div className="auth-card">
          <h1 className="auth-title">{mode === "login" ? "Sign In" : "Create Account"}</h1>
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
                  placeholder="Enter your email"
                  required
                  value={loginData.email}
                  onChange={handleLoginChange}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <div className="auth-password-wrap">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <button type="submit" className="auth-btn auth-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="auth-field">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  placeholder="Enter username"
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
                <label htmlFor="register-password">Password</label>
                <div className="auth-password-wrap">
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    id="register-password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowRegisterPassword((prev) => !prev)}
                    aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                  >
                    {showRegisterPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={registerData.phone_number}
                  onChange={handleRegisterChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <button type="submit" className="auth-btn auth-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
            </form>
          )}

          <div className="auth-footer">
            {mode === "login" ? (
              <>
                <span>Don't have an account?</span>
                <button
                  type="button"
                  className="auth-btn auth-btn-outline"
                  onClick={() => switchMode("register")}
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                <span>Already have an account?</span>
                <button
                  type="button"
                  className="auth-btn auth-btn-outline"
                  onClick={() => switchMode("login")}
                >
                  Back to sign in
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