import "../../assets/css/header.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/useAuth.js";


function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAccountClick = () => {
    const token = localStorage.getItem("token");  
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin");
      return;
    }
    if (token) {
      navigate("/UserProfile");
      return;
    }
    

    navigate("/Login");
  };



  return (
    <header className="site-header">
      <div className="site-header-inner top-row">
        <a className="brand" href="/">
          <span className="brand-badge"></span>
          <span className="brand-text">THELIEMSSHOES</span>
        </a>

        <form className="header-search" role="search">
          <input type="text" aria-label="Search" />
          <button type="submit" aria-label="Search">
            <FiSearch className="header-icon" aria-hidden="true" />
          </button>
        </form>

        <div className="header-actions" aria-label="Quick actions">
          <button
            type="button"
            aria-label="Account"
            onClick={handleAccountClick}
          >
            <FiUser className="header-icon" aria-hidden="true" />
          </button>
          {user?.email && <span className="header-user-email">{user.email}</span>}
          <button type="button" aria-label="Cart" onClick={() => navigate("/Cart")}>
            <FiShoppingCart className="header-icon" aria-hidden="true" />
          </button>
        </div>
      </div>

      <nav className="site-header-inner nav-row" aria-label="Primary">
        <NavLink to="/">Home </NavLink>
        <NavLink to="/Shop">Shop</NavLink>
        <NavLink to="/About">About</NavLink>
      </nav>
    </header>
  );
}

export default Header;
