import { useEffect, useState } from "react";
import CardProducts from "../components/shared/CardProducts";
import "../assets/css/home.css";
import CardCategorys from "../components/shared/CardCategorys";
import CardTypeShoes from "../components/shared/CardTypeShoes";
import axios from "axios";
import { getApiUrl } from "../config/config";

function Home() {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(getApiUrl("/categories"));

        setCategory(res.data.data);

      } catch (err) {
        setError(
          "Không thể tải được danh sách danh mục (kiểm tra link https://be-theliemsshoes.onrender.com có hoạt động không)",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  if (loading) {
    return <div className="homePageContent">Loading...</div>;
  }

  if (error) {
    return <div className="homePageContent">{error}</div>;
  }

  return (
    <div className="homePageContent">
      <div className="homeBanner">
        <p className="homeBannerSubtitle">Discover the latest trends in footwear</p>
      </div>
      <div className="homeCollection">
        <p className="title">News Collections</p>
        <div className="collectionItems">
          {/* {products.map((product) => (
            <CardProducts
              key={product.id}
              product={product}
            />
          ))} */}
        </div>
      </div>
      <div className="homeCollection">
        <p className="title">Shop by Sport</p>
        <div className="collectionTypes">
          
        </div>
      </div>  
      <div className="homeCategory">
        <p className="title">Category</p>
        <div className="categoryItems">
          {category.map((item) => (
            <CardCategorys
              id={item.id}
              name={item.category_name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;