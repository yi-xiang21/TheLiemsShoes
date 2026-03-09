import { useNavigate } from "react-router-dom"
function CreateAccount() {
    const navigate = useNavigate()
  return (
    <div>
        <h2>Create New Account</h2>
        <form className="create-account-form">
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
            </div>
            <div className="form-group">
                <label htmlFor="PhoneNumber">PhoneNumber</label>
                <input type="text" id="PhoneNumber" name="PhoneNumber" required />
            </div>
            <div className="form-group">
                <label htmlFor="role">Role</label>
                <select id="role" name="role" required>
                    <option value="">Select Role</option>   
                    <option value="admin">Admin</option>
                    <option value="customer">Customer</option>
                </select>
            </div>
            <button type="submit" className="button" onClick={() => navigate("/admin/account")}>Create Account</button>
        </form>
    </div>
    )
}
export default CreateAccount