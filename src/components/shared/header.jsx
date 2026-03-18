import "../../assets/css/header.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";

function Header() {
  const navigate = useNavigate();

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
            onClick={() => navigate("/Login")}
          >
            <FiUser className="header-icon" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Cart">
            <FiShoppingCart className="header-icon" aria-hidden="true" />
          </button>
        </div>
      </div>

      <nav className="site-header-inner nav-row" aria-label="Primary">
        <NavLink to="/">Home </NavLink>
      </nav>
    </header>
  );
}

export default Header;