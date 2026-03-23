import { useEffect, useRef, useState } from "react";
import "../assets/css/home.css";
import CardCategorys from "../components/shared/CardCategorys.jsx";
import CardTypeShoes from "../components/shared/CardTypeShoes.jsx";
import FeaturedProductSlider from "../components/shared/FeaturedProductSlider.jsx";
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
import typeImg1 from "../assets/images/Fashion.jpg";
import typeImg2 from "../assets/images/FootBall.jpg";
import typeImg3 from "../assets/images/Running.jpg";
import typeImg4 from "../assets/images/Basketball.jpg";
import typeImg5 from "../assets/images/Tenis.jpg";
import typeImg6 from "../assets/images/Skateboarding.jpg";
import typeImg7 from "../assets/images/Hiking.jpg";
import typeImg8 from "../assets/images/Casual.jpg";
import typeImg9 from "../assets/images/Sandals.jpg";
import typeImg10 from "../assets/images/Boots.jpg";
import { FiTruck, FiLock, FiSmile, FiMessageCircle } from "react-icons/fi";
import CardProducts from "../components/shared/CardProducts.jsx";

const typeImages = [
  typeImg1,
  typeImg2,
  typeImg3,
  typeImg4,
  typeImg5,
  typeImg6,
  typeImg7,
  typeImg8,
  typeImg9,
  typeImg10,
];

const serviceItems = [
  {
    icon: FiTruck,
    heading: "SHIPPING AND DELIVERY",
    title: "MAKE YOUR DELIVERY FAST AND EASY WITH US",
    text: "We provide standard and express reliable shipping services across the country. We deliver same day to NY & Tri-State area.",
  },
  {
    icon: FiLock,
    heading: "SECURE PAYMENTS",
    title: "",
    text: "We prioritize your security. Rest assured, our website offers a secure payment gateway, ensuring your transactions are protected by the latest encryption technology. Shop confidently knowing that your payment information is safe and secure with us.",
  },
  {
    icon: FiSmile,
    heading: "SATISFIED OR REFUNDED",
    title: "",
    text: "We stand by the quality of our products. If for any reason you're not completely satisfied with your purchase, we offer a hassle-free refund policy. Your satisfaction is our priority, and we're committed to ensuring you're delighted with every purchase.",
  },
  {
    icon: FiMessageCircle,
    heading: "TOP-NOTCH SUPPORT",
    title: "",
    text: "We take pride in delivering exceptional customer support. Our dedicated team is here to assist you every step of the way. From answering queries to resolving concerns, we strive to provide prompt, friendly, and knowledgeable assistance to ensure your satisfaction.",
  },
];


function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [type, setType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showHomeVideo, setShowHomeVideo] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const homeVideoRef = useRef(null);
  const homeBanners = [homeBanner1, homeBanner2, homeBanner3, homeBanner4, homeBanner5];



  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [categoriesResponse, typeResponse, productsResponse] = await Promise.all([
          axios.get(getApiUrl("/categories")),
          axios.get(getApiUrl("/products/types")),
          axios.get(getApiUrl("/products")),
        ]);

        setCategory(Array.isArray(categoriesResponse.data?.data) ? categoriesResponse.data.data : []);
        setType(Array.isArray(typeResponse.data?.data) ? typeResponse.data.data : []);
        setProducts(Array.isArray(productsResponse.data?.data) ? productsResponse.data.data : []);
      } catch (fetchError) {
        console.error("Không thể tải dữ liệu trang chủ:", fetchError);
        setError(
          "Không thể tải dữ liệu trang chủ (kiểm tra link https://be-theliemsshoes.onrender.com có hoạt động không)",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
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
        <p className="title">New Collection</p>
        <div className="collectionItems">
          {products.map((product) => {
            const imagePath = product.images?.[0]?.image_url || "";
            const imageUrl = imagePath
              ? (imagePath.startsWith("http") ? imagePath : getApiUrl(imagePath))
              : "https://via.placeholder.com/300x220?text=No+Image";

            return (
              <CardProducts
                key={product.id}
                id={product.id}
                image={imageUrl}
                name={product.product_name}
                category={product.category_name}
                price={product.price}
              />
            );
          })}
        </div>
      </div>
      <div>
        <p className="title">Sport In Life</p>
        <div
          ref={homeVideoRef}
          className={`HomeVideo ${showHomeVideo ? "HomeVideo--visible" : ""}`}>
          
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
      </div>
      <div className="homeCollection">
        <p className="title">Top Sells</p>
        <div className="featuredProductsWrap">
          <FeaturedProductSlider products={products} />
        </div>
      </div>
      <div className="homeCollection">
        <p className="title">Shop by Sport</p>
        <div className="collectionTypes">
          {type.map((item,index) => (
            <CardTypeShoes
              key={item.id ?? `${item.type_name}-${index}`}
              id={item.id}
              a={typeImages[index]}
              b={item.type_name}
            />
          ))}
        </div>
      </div>  
      <div className="homeCategory">
        <p className="title">Category</p>
        <div className="categoryItems">
          {category.map((item) => (
            <CardCategorys
              key={item.id}
              id={item.id}
              name={item.category_name}
            />
          ))}
        </div>
      </div>
      <div className="homeServices">
        <div className="serviceItems">
          {serviceItems.map((item, index) => {
            const IconComponent = item.icon;

            return (
              <article className="serviceCard" key={index}>
                <div className="serviceIconWrap">
                  <IconComponent className="serviceIcon" />
                </div>
                <h4 className="serviceHeading">{item.heading}</h4>
                {item.title ? <h3 className="serviceTitle">{item.title}</h3> : null}
                <p className="serviceText">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
