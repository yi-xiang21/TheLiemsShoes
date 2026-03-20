import { Outlet } from "react-router-dom";
import "../assets/css/about.css";

function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero__content">
          <h1 className="about-hero__title">TheLiemsShoes</h1>
          <p className="about-hero__subtitle">Chất lượng giày cao cấp, phong cách sống</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="about-container">
          <div className="about-story__content">
            <h2 className="about-section-title">Câu chuyện của chúng tôi</h2>
            <p className="about-text">
              TheLiemsShoes được thành lập với sứ mệnh mang đến những đôi giày chất lượng cao nhất tới khách hàng Việt Nam. 
              Chúng tôi tin tưởng rằng một đôi giày tốt không chỉ là phần quan trọng của trang phục, mà còn là cách để bạn 
              thể hiện cá tính và phong cách riêng.
            </p>
            <p className="about-text">
              Với hơn một thập kỷ kinh nghiệm trong ngành, chúng tôi chỉ lựa chọn những sản phẩm từ các thương hiệu uy tín 
              thế giới như Nike, Adidas, OFF-WHITE, và nhiều hãng khác để đảm bảo chất lượng tốt nhất cho bạn.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="about-container">
          <h2 className="about-section-title">Giá trị của chúng tôi</h2>
          <div className="about-values__grid">
            <div className="about-value-card">
              <div className="about-value-card__icon">✓</div>
              <h3 className="about-value-card__title">Chất lượng hàng đầu</h3>
              <p className="about-value-card__description">
                Tất cả sản phẩm đều được kiểm tra kỹ lưỡng để đảm bảo chất lượng tuyệt vời.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-card__icon">◆</div>
              <h3 className="about-value-card__title">Phong cách đa dạng</h3>
              <p className="about-value-card__description">
                Từ giày thể thao đến giày casual, chúng tôi có mọi phong cách bạn cần.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-card__icon">★</div>
              <h3 className="about-value-card__title">Giá cả hợp lý</h3>
              <p className="about-value-card__description">
                Chúng tôi cam k承 cung cấp giá tốt nhất mà không ảnh hưởng tới chất lượng.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-card__icon">⚡</div>
              <h3 className="about-value-card__title">Dịch vụ tận tâm</h3>
              <p className="about-value-card__description">
                Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giúp đỡ 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="about-brands">
        <div className="about-container">
          <h2 className="about-section-title">Thương hiệu đối tác</h2>
          <p className="about-brands__subtitle">
            Chúng tôi tự hào hợp tác với các thương hiệu giày hàng đầu thế giới
          </p>
          <div className="about-brands__grid">
            <div className="about-brand-item">Nike</div>
            <div className="about-brand-item">Adidas</div>
            <div className="about-brand-item">OFF-WHITE</div>
            <div className="about-brand-item">Puma</div>
            <div className="about-brand-item">New Balance</div>
            <div className="about-brand-item">Converse</div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="about-contact">
        <div className="about-container">
          <h2 className="about-section-title">Liên hệ với chúng tôi</h2>
          <div className="about-contact__content">
            <div className="about-contact__info">
              <h3>Thông tin liên hệ</h3>
              <p><strong>Địa chỉ:</strong> 123 Đường Lê Lợi, TP. Hồ Chí Minh</p>
              <p><strong>Email:</strong> info@theliemsshoes.com</p>
              <p><strong>Điện thoại:</strong> +84 (0) 123 456 789</p>
              <p><strong>Giờ mở cửa:</strong> 9:00 - 21:00 (Thứ 2 - Chủ Nhật)</p>
            </div>
            <div className="about-contact__message">
              <p>
                Cảm ơn bạn đã lựa chọn TheLiemsShoes. Chúng tôi cam kết cung cấp sản phẩm và dịch vụ tốt nhất. 
                Nếu bạn có bất kỳ câu hỏi nào, vui lòng không ngần ngại liên hệ với chúng tôi!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;