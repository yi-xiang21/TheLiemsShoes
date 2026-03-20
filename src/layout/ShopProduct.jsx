import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Header from "../components/shared/Header.jsx";
import Footer from "../components/shared/Footer.jsx";
import SideBarShop from "../components/shared/SideBarShop.jsx";
import { getApiUrl } from "../config/config.js";
import "../assets/css/shop-layout.css";

function Shop() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await axios.get(getApiUrl("/categories"));
        setCategories(response.data.data);
        console.log("Fetched categories:", response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div className="shop-container">
        {/* Left Sidebar - Categories */}
        <aside className="shop-sidebar">
          <div className="sidebar-scroll">
            <a style={{ textDecoration: "none" }} href="/#">
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <SideBarShop key={category.id} title={category.category_name} />
                ))
              ) : (
                <div style={{ padding: "16px", color: "#999" }}>
                  No categories available
                </div>
              )}
            </a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="shop-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Shop;