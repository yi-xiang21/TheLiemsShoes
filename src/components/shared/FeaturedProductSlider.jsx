import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getApiUrl } from "../../config/config.js";
import "../../assets/css/featured-product-slider.css";

function FeaturedProductSlider({ products }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(() => {
    if (!Array.isArray(products)) {
      return [];
    }

    return products.map((product) => {
      const imagePath = product.images?.[0]?.image_url || "";
      const imageUrl = imagePath
        ? (imagePath.startsWith("http") ? imagePath : getApiUrl(imagePath))
        : "https://via.placeholder.com/900x700?text=No+Image";

      return {
        id: product.id,
        name: product.product_name || "Unnamed product",
        price: Number(product.price) || 0,
        imageUrl,
      };
    });
  }, [products]);

  const totalSlides = slides.length;
  const safeIndex = totalSlides > 0 ? activeIndex % totalSlides : 0;
  const activeSlide = slides[safeIndex];

  useEffect(() => {
    if (totalSlides <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => {
      window.clearInterval(timer);
    };
  }, [totalSlides]);

  if (totalSlides === 0) {
    return (
      <div className="featuredProductSlider featuredProductSlider--empty">
        <p>Không có sản phẩm để hiển thị.</p>
      </div>
    );
  }

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section
      className="featuredProductSlider"
      aria-label="Top selling products"
      style={{ backgroundImage: `url(${activeSlide.imageUrl})` }}
    >
      <div className="featuredProductSlider__overlay" aria-hidden="true" />

      <button className="featuredControl featuredControl--prev" onClick={goPrev} aria-label="Previous product">
        <FiChevronLeft />
      </button>

      <div className="featuredProductSlider__infoViewport">
        <div className="featuredProductSlider__infoTrack">
          {slides.map((slide, index) => {
            const translateY = (index - safeIndex) * 100;
            const formattedPrice = new Intl.NumberFormat("vi-VN").format(slide.price ?? 0);

            return (
              <article
                className="featuredProductSlider__infoSlide"
                key={`${slide.id}-info-${index}`}
                style={{ transform: `translateY(${translateY}%)` }}
              >
                <h3 className="featuredProductSlider__name" >{slide.name}</h3>
                <p className="featuredProductSlider__price">{formattedPrice}đ</p>
                <a className="featuredProductSlider__button" href={`/product/${slide.id}`}>
                  View product
                </a>
              </article>
            );
          })}
        </div>

        <div className="featuredProductSlider__dots" role="tablist" aria-label="Select product">
          {slides.map((slide, index) => (
            <button
              key={`${slide.id}-dot-${index}`}
              className={`featuredProductSlider__dot ${index === safeIndex ? "is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <button className="featuredControl featuredControl--next" onClick={goNext} aria-label="Next product">
        <FiChevronRight />
      </button>
    </section>
  );
}

export default FeaturedProductSlider;
