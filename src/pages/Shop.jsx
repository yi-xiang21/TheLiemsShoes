
import { useEffect, useState } from "react";
import CardProducts from "../components/shared/CardProducts.jsx";
import axios from "axios";
import { getApiUrl } from "../config/config.js";
import { useSearchParams } from "react-router-dom";



function Shop() {
    const [serachParams] = useSearchParams();
    const categoryId = serachParams.get("categoryId");
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const endpoint = categoryId
                    ? getApiUrl(`/categories/category/${categoryId}`)
                    : getApiUrl("/products");
                const res = await axios.get(endpoint);

                setProducts(res.data.data);
                console.log(res.data.data);
                
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);

    if (loading) {
        return <div className="shop-container">Đang tải sản phẩm...</div>;
    }

    if (error) {
        return <div className="shop-container">{error}</div>;
    }

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
        </section>
    );
}

export default Shop;