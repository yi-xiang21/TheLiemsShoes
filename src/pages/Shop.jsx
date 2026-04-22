import { useEffect, useState } from "react";
import CardProducts from "../components/shared/CardProducts.jsx";
import UserLoadingOverlay from "../components/shared/UserLoadingOverlay.jsx";
import axios from "axios";
import { getApiUrl } from "../config/config.js";
import { useSearchParams } from "react-router-dom";

function Shop() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const typeId = searchParams.get("typeId");
  const searchTermRaw = searchParams.get("search") || "";
  const searchTerm = searchTermRaw.trim().toLowerCase();

  // const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const PRODUCTS_PER_PAGE = 12;

  const filteredProducts = !searchTerm
    ? productsList
    : productsList.filter((product) => {
        const name = (product?.product_name || "").toLowerCase();
        const category = (product?.category_name || "").toLowerCase();
        return name.includes(searchTerm) || category.includes(searchTerm);
      });

  const handleNextPage = () => { 
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setCurrentPage(0);
      try {
        const endpoint = typeId
          ? getApiUrl(`/products/type/${typeId}`)
          : categoryId
            ? getApiUrl(`/categories/category/${categoryId}`)
            : getApiUrl("/products");
        const res = await axios.get(endpoint);

        setProductsList(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Unable to load product data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, typeId]);

  if (loading) {
    return <UserLoadingOverlay show={loading} text="Loading products..." />;
  }

  if (error) {
    return <div className="shop-container">{error}</div>;
  }

  // Calculate pagination
  const startIndex = currentPage * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const isFirstPage = currentPage <= 0;
  const isLastPage = totalPages <= 1 || currentPage >= totalPages - 1;

  return (
    <section style={{ padding: "8px 4px 24px" }}>
      <h1 style={{ margin: "0 0 16px", fontSize: "28px" }}>Shop</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => {
            const imagePath = product.images?.[0]?.image_url || "";
            const imageUrl = imagePath
              ? imagePath.startsWith("http")
                ? imagePath
                : getApiUrl(imagePath)
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
          })
        ) : (
          <div
            style={{ gridColumn: "1 / -1", textAlign: "center", color: "#999" }}
          >
            No products found
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "24px", alignItems: "center" }}>
        <button 
          onClick={handlePreviousPage} 
          disabled={isFirstPage}
          style={{
            padding: "8px 16px",
            cursor: isFirstPage ? "not-allowed" : "pointer",
            opacity: isFirstPage ? 0.5 : 1,
            backgroundColor: isFirstPage ? "#ccc" : "#333",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px"
          }}
        > 
          Previous 
        </button>
        <span style={{ fontSize: "14px", color: "#666" }}>
          Page {totalPages ? currentPage + 1 : 0} of {totalPages || 1} ({filteredProducts.length} products)
        </span>
        <button 
          onClick={handleNextPage} 
          disabled={isLastPage}
          style={{
            padding: "8px 16px",
            cursor: isLastPage ? "not-allowed" : "pointer",
            opacity: isLastPage ? 0.5 : 1,
            backgroundColor: isLastPage ? "#ccc" : "#333",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px"
          }}
        > 
          Next 
        </button>
      </div>
    </section>
  );
}

export default Shop;
