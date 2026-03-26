import "../assets/css/cart.css";
import ItemsCart from "../components/shared/ItemsCart.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/config";
import { useAuth } from "../context/useAuth";

function Cart() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatCurrencyVND = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
  };

  const mapApiItemToUiItem = (apiItem) => {
    const imagePath = apiItem?.image_url || "";
    const imageUrl = imagePath
      ? imagePath.startsWith("http")
        ? imagePath
        : getApiUrl(imagePath)
      : "";

    const priceNumber = Number(apiItem?.price) || 0;

    return {
      id: apiItem?.cart_item_id,
      productId: apiItem?.product_id,
      product_size_id: apiItem?.product_size_id,
      size_id: apiItem?.size_id,
      size: apiItem?.size_name,
      name: apiItem?.product_name,
      priceNumber,
      price: formatCurrencyVND(priceNumber),
      quantity: Number(apiItem?.quantity) || 1,
      image: imageUrl,
    };
  };

  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.get(getApiUrl("/cart"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = Array.isArray(res.data?.cartItems) ? res.data.cartItems : [];
      setCartItems(items.map(mapApiItemToUiItem));
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err?.response?.data?.message || "Không thể tải giỏ hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + (Number(item.priceNumber) || 0) * (Number(item.quantity) || 0);
  }, 0);

  const handleIncreaseQuantity = async (itemId) => {
    const current = cartItems.find((item) => item.id === itemId);
    if (!current) return;

    const nextQty = (Number(current.quantity) || 0) + 1;
    try {
      await axios.put(
        getApiUrl(`/cart/${itemId}`),
        { quantity: nextQty },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? { ...item, quantity: nextQty } : item))
      );
    } catch (err) {
      console.error("Error updating cart item:", err);
      alert(err?.response?.data?.message || "Không thể cập nhật số lượng.");
      fetchCart();
    }
  };

  const handleDecreaseQuantity = async (itemId) => {
    const current = cartItems.find((item) => item.id === itemId);
    if (!current) return;

    const nextQty = Math.max(1, (Number(current.quantity) || 0) - 1);
    try {
      await axios.put(
        getApiUrl(`/cart/${itemId}`),
        { quantity: nextQty },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? { ...item, quantity: nextQty } : item))
      );
    } catch (err) {
      console.error("Error updating cart item:", err);
      alert(err?.response?.data?.message || "Không thể cập nhật số lượng.");
      fetchCart();
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(getApiUrl(`/cart/${itemId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Error removing cart item:", err);
      alert(err?.response?.data?.message || "Không thể xóa sản phẩm.");
      fetchCart();
    }
  };

  return (
    <section className="cart-page">
      <div className="cart-container">
        <div className="cart-left">
          <h1>Giỏ hàng</h1>
          <div className="cart-list">
            {!token ? (
              <div style={{ padding: "12px 0" }}>
                Vui lòng đăng nhập để xem giỏ hàng. {" "}
                <button type="button" onClick={() => navigate("/Login")}>Đăng nhập</button>
              </div>
            ) : loading ? (
              <div style={{ padding: "12px 0" }}>Đang tải...</div>
            ) : error ? (
              <div style={{ padding: "12px 0" }}>{error}</div>
            ) : (console.log(cartItems),
              cartItems.map((item) => (
                <ItemsCart
                  key={item.id}
                  item={item}
                  onIncrease={() => handleIncreaseQuantity(item.id)}
                  onDecrease={() => handleDecreaseQuantity(item.id)}
                  onRemove={() => handleRemoveItem(item.id)}
                />
              ))
            )}
          </div>
        </div>

        <aside className="cart-right">
          <div className="cart-summary-card">
            <label htmlFor="coupon" className="cart-label">
              Mã coupon
            </label>
            <div className="coupon-row">
              <input id="coupon" type="text" placeholder="Nhập mã giảm giá" />
              <button type="button">Áp mã</button>
            </div>

            <div className="total-row">
              <span>Total</span>
              <strong>{formatCurrencyVND(totalPrice)}</strong>
            </div>

            <button type="button" className="checkout-btn" 
            onClick={() => navigate("/Checkout", { state: { cartItems } })}
            >
              Thanh toán
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Cart;