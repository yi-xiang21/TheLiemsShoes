import {  useParams, useNavigate } from "react-router-dom";
import "../assets/css/detail.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../config/config";
import CardProducts from "../components/shared/CardProducts";
import CardSize from "../components/shared/CardSize";
import { useAuth } from "../context/useAuth";


function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImg, setCurrentImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const handleCurrentImg = (index) => {
    setCurrentImg(index);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, productsRes] = await Promise.all([
          axios.get(getApiUrl(`/products/${id}`)),
          axios.get(getApiUrl("/products")),
        ]);

        const currentProduct = productRes.data?.data;
        const products = Array.isArray(productsRes.data?.data) ? productsRes.data.data : [];

        setProduct(currentProduct);

        const filteredProducts = products.filter((item) => item.id !== currentProduct?.id);
        setRelatedProducts(filteredProducts.slice(0, 8));
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Unable to load product details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);
  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        {error || "Product not found"}
      </div>
    );
  }

  const galleryImages =
    product.images?.map((img) =>
      img.image_url.startsWith("http")
        ? img.image_url
        : getApiUrl(img.image_url),
    ) || [];

  const formattedPrice = new Intl.NumberFormat("vi-VN").format(
    product.price ?? 0,
  );

  const handleAddToCart = async () => {
    if (!token) {
      alert("Please sign in to add items to your cart.");
      navigate("/Login");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    try {
      await axios.post(
        getApiUrl("/cart"),
        {
          productId: product.id,
          productSizeId: selectedSize.product_size_id,
          sizeId: selectedSize.size_id,
          size: selectedSize.size_name,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Item added to cart successfully.");
    } catch (err) {
      console.error("Error add to cart:", err);
      alert(err?.response?.data?.message || "Unable to add item to cart.");
    }
  };

  return (
    <section className="detailPage">
      <div className="detailShell">
        <div className="detailGalleryWrap">
          <div className="detailThumbList" aria-label="Product images">
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                className={`detailThumb ${currentImg === index ? "isActive" : ""}`}
                type="button"
                onClick={() => handleCurrentImg(index)}
              >
                <img src={image} alt={`Product preview ${index + 1}`} />
              </button>
            ))}
          </div>

          <div className="detailHeroImage">
            <img
              src={galleryImages[currentImg] || galleryImages[0]}
              alt={product.product_name}
            />
          </div>
        </div>

        <div className="detailInfoWrap">
          <header className="detailHeader">
            <h1>{product.product_name}</h1>
            <p>{product.category_name}</p>
            <strong>{formattedPrice}đ</strong>
          </header>

          <div className="detailSizeBlock">
            <div className="detailSizeHead">
              <h2>Select Size</h2>
            </div>

            <div className="detailSizeGrid">
              {product.sizes?.map((size) => (
                <CardSize
                  id={size.size_id}
                  key={size.product_size_id}
                  size={size.size_name}
                  isSelected={selectedSize?.product_size_id === size.product_size_id}
                  onClick={() => setSelectedSize(size)}
                />
              ))}
            </div>
          </div>

          <div className="detailActionStack">
            <button className="detailPrimaryBtn" type="button" onClick={handleAddToCart}>
              Add to Bag
            </button>
          </div>

          <div className="detailDescription">
            <h2>Description</h2>
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      <div className="detailRelatedSection">
        <h2 className="detailRelatedTitle">Related List</h2>
        <div className="detailRelatedList">
          {relatedProducts.map((relatedProduct) => {
            const imagePath = relatedProduct.images?.[0]?.image_url || "";
            const imageUrl = imagePath
              ? (imagePath.startsWith("http") ? imagePath : getApiUrl(imagePath))
              : "https://via.placeholder.com/300x220?text=No+Image";

            return (
              <CardProducts
                key={relatedProduct.id}
                id={relatedProduct.id}
                image={imageUrl}
                name={relatedProduct.product_name}
                category={relatedProduct.category_name}
                price={relatedProduct.price}
              />
            );
          })}
        </div>
      </div>

    </section>
  );
}

export default Detail;
