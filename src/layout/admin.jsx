import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/shared/AdminSidebar.jsx";
import "../assets/css/admin.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <section className="admin-content-wrapper">
        <header className="admin-header">
          <h1>Admin Panel</h1>
          <p>Manage your shoe store in one place</p>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </section>
    </div>
  );
}

export default AdminLayout;