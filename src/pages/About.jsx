import "../assets/css/about.css";

function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero__content">
          <h1 className="about-hero__title">TheLiemsShoes</h1>
          <p className="about-hero__subtitle">Premium footwear, elevated lifestyle</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="about-container">
          <div className="about-story__content">
            <h2 className="about-section-title">Our Story</h2>
            <p className="about-text">
              TheLiemsShoes was founded with a mission to bring the highest-quality footwear to customers across Vietnam.
              We believe that a great pair of shoes is not only an essential part of your outfit, but also a way to express
              your personality and unique style.
            </p>
            <p className="about-text">
              With more than a decade of industry experience, we carefully select products from globally trusted brands
              like Nike, Adidas, OFF-WHITE, and many others to ensure the best quality for you.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="about-container">
          <h2 className="about-section-title">Our Values</h2>
          <div className="about-values__grid">
            <div className="about-value-card">
              <div className="about-value-card__icon">✓</div>
              <h3 className="about-value-card__title">Top-Tier Quality</h3>
              <p className="about-value-card__description">
                Every product is carefully inspected to ensure outstanding quality.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-card__icon">◆</div>
              <h3 className="about-value-card__title">Diverse Styles</h3>
              <p className="about-value-card__description">
                From sports sneakers to casual footwear, we offer every style you need.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-card__icon">★</div>
              <h3 className="about-value-card__title">Fair Pricing</h3>
              <p className="about-value-card__description">
                We are committed to offering the best prices without compromising quality.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-card__icon">⚡</div>
              <h3 className="about-value-card__title">Dedicated Service</h3>
              <p className="about-value-card__description">
                Our support team is always ready to help you 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="about-brands">
        <div className="about-container">
          <h2 className="about-section-title">Partner Brands</h2>
          <p className="about-brands__subtitle">
            We are proud to collaborate with the world&apos;s leading footwear brands
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
          <h2 className="about-section-title">Contact Us</h2>
          <div className="about-contact__content">
            <div className="about-contact__info">
              <h3>Contact Information</h3>
              <p><strong>Address:</strong> 123 Le Loi Street, Ho Chi Minh City</p>
              <p><strong>Email:</strong> info@theliemsshoes.com</p>
              <p><strong>Phone:</strong> +84 (0) 123 456 789</p>
              <p><strong>Business Hours:</strong> 9:00 - 21:00 (Monday - Sunday)</p>
            </div>
            <div className="about-contact__message">
              <p>
                Thank you for choosing TheLiemsShoes. We are committed to providing the best products and service.
                If you have any questions, please do not hesitate to contact us.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;