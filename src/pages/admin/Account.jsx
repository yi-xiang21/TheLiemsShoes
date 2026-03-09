import { useNavigate } from "react-router-dom"

function Account() {
    const navigate = useNavigate()
  return (
     <section className="admin-card">
      <div className="admin-card-header">
        <h2>Account Management</h2>
        <button className="button" onClick={() => navigate("/admin/CreateAccount")}>
            + Add New Account
        </button>
      </div>
      <div className="admin-card-body">
        <table className="admin-table" >
            <thead>
                <tr>
                    <th>Id</th>
                    <th>UserName</th>
                    <th>email</th>
                    <th>Role</th>
                    <th>Phone Number</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>john.doe@example.com</td>   
                    <td>john.doe@example.com</td>
                    <td>Admin</td>
                    <td>
                        <button className="button" onClick={() => navigate("/admin/EditAccount")}>
                            Edit
                        </button>
                        <button className="button" >Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </section>
  )
}
export default Account