import { useState, useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import SideBarShop from "../components/shared/SideBarShop.jsx";
import UserLoadingOverlay from "../components/shared/UserLoadingOverlay.jsx";
import { getApiUrl } from "../config/config.js";
import "../assets/css/shop-layout.css";

function Shop() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await axios.get(getApiUrl("/categories"));
        setCategories(response.data.data);
        console.log("Fetched categories:", response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Không thể tải dữ liệu cửa hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  const handleCategoryClick = (categoryId) => {
    if(categoryId === null){
      navigate("/Shop");
    } else{
      navigate(`?categoryId=${categoryId}`);
    }
  };

  if (loading) {
    return <UserLoadingOverlay show={loading} text="Đang tải dữ liệu cửa hàng..." />;
  }

  if (error) {
    return <div className="shop-container">{error}</div>;
  }

  

  return (
    <>
      <div className="shop-container">
        {/* Left Sidebar - Categories */}
        <aside className="shop-sidebar">
          <p className="shop-sidebar__tagline">Premium footwear</p>
          <div className="sidebar-scroll">
             <SideBarShop
              title="All Products"
              isActive={!currentCategoryId}
              onClick={()=>handleCategoryClick(null)}
            />
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <SideBarShop 
                  key={category.id} 
                  title={category.category_name}
                  isActive={currentCategoryId === String(category.id)}
                  onClick={()=>handleCategoryClick(category.id)}
                  />
                ))
              ) : (
                <div style={{ padding: "16px", color: "#999" }}>
                  No categories available
                </div>
              )}
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