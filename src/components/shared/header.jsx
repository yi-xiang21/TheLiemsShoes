import "../../assets/css/header.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl } from "../../config/config";


function Header() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(getApiUrl("/auth/profile"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserEmail(response.data?.user?.email || "");
      } catch {
        setUserEmail("");
      }
    };

    fetchProfile();
  }, []);

  const handleAccountClick = () => {
    const token = localStorage.getItem("token");
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
          {userEmail && <span className="header-user-email">{userEmail}</span>}
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