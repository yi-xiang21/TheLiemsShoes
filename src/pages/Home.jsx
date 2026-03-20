import { useEffect, useRef, useState } from "react";
import CardProducts from "../components/shared/CardProducts.jsx";
import "../assets/css/home.css";
import CardCategorys from "../components/shared/CardCategorys.jsx";
import CardTypeShoes from "../components/shared/CardTypeShoes.jsx";
import axios from "axios";
import { getApiUrl } from "../config/config.js";
import UserLoadingOverlay from "../components/shared/UserLoadingOverlay.jsx";
import homeVideo1 from "../assets/video/homeVideo1.mp4";
import homeVideo2 from "../assets/video/homeVideo2.mp4";
import homeVideo3 from "../assets/video/homeVideo3.mp4";
import homeBanner1 from "../assets/images/HomeBanner1.jpg";
import homeBanner2 from "../assets/images/HomeBanner2.jpg";
import homeBanner3 from "../assets/images/HomeBanner3.jpg";
import homeBanner4 from "../assets/images/HomeBanner4.jpg";
import homeBanner5 from "../assets/images/HomeBanner5.jpg";

function Home() {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showHomeVideo, setShowHomeVideo] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const homeVideoRef = useRef(null);
  const homeBanners = [homeBanner1, homeBanner2, homeBanner3, homeBanner4, homeBanner5];

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(getApiUrl("/categories"));

        setCategory(res.data.data);
        console.log(res.data.data);

      } catch {
        setError(
          "Không thể tải được danh sách danh mục (kiểm tra link https://be-theliemsshoes.onrender.com có hoạt động không)",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % homeBanners.length);
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [homeBanners.length]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const currentSection = homeVideoRef.current;
    if (!currentSection) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setShowHomeVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setShowHomeVideo(entry.isIntersecting);
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(currentSection);

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  if (loading) {
    return <UserLoadingOverlay show={loading} text="Đang tải dữ liệu trang chủ..." />;
  }

  if (error) {
    return <div className="homePageContent">{error}</div>;
  }

  return (
    <div className="homePageContent">
      <div className="homeBanner">
        <div
          className="homeBannerTrack"
          style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
        >
          {homeBanners.map((banner, index) => (
            <div className="homeBannerSlide" key={index}>
              <img src={banner} alt={`Banner ${index + 1}`} className="homeBannerImage" />
            </div>
          ))}
        </div>
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
      <div
        ref={homeVideoRef}
        className={`HomeVideo ${showHomeVideo ? "HomeVideo--visible" : ""}`}
      >
        <div className="homeVideoLeft homeVideoRevealLeft">
          <video autoPlay muted loop playsInline>
            <source src={homeVideo1} type="video/mp4" />
          </video>
        </div>
        <div className="homeVideoRight">
          <div className="homeVideoTop homeVideoRevealRight homeVideoDelayOne">
            <video autoPlay muted loop playsInline>
              <source src={homeVideo3} type="video/mp4" />
            </video>
          </div>
          <div className="homeVideoBottom homeVideoRevealRight homeVideoDelayTwo">
            <video autoPlay muted loop playsInline>
              <source src={homeVideo2} type="video/mp4" />
            </video>
          </div>
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