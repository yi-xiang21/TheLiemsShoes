import { NavLink } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-brand">TheLiems Admin</h2>
      <nav className="admin-nav">
        <NavLink to="/admin" end className="admin-nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/admin/products" className="admin-nav-link">
          Products
        </NavLink>
        <NavLink to="/admin/orders" className="admin-nav-link">
          Orders
        </NavLink>
        <NavLink to="/admin/account" className="admin-nav-link">
          Account
        </NavLink>
        <NavLink to="/" className="admin-nav-link">
          Home
        </NavLink>
         <NavLink to="/logout" className="admin-nav-link">
          Logout
        </NavLink>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
