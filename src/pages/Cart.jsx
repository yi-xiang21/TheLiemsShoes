import "../assets/css/cart.css";
import ItemsCart from "../components/shared/ItemsCart.jsx";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/config";
import { useAuth } from "../context/useAuth";

function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFinalizingMomo, setIsFinalizingMomo] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    if (!toast.message) return;
    const timer = setTimeout(() => setToast({ message: "", type: "success" }), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

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

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const requestId = searchParams.get("requestId");
    const resultCode = searchParams.get("resultCode");

    if (!requestId || resultCode === null) {
      return;
    }

    const clearQuery = () => {
      navigate("/Cart", { replace: true });
    };

    if (resultCode !== "0") {
      setToast({ message: "Thanh toán thất bại. Giỏ hàng đã được giữ nguyên.", type: "error" });
      clearQuery();
      return;
    }

    if (!token) {
      setToast({ message: "Vui lòng đăng nhập lại để xác nhận đơn hàng.", type: "error" });
      clearQuery();
      return;
    }

    const finalizeMomoOrder = async () => {
      setIsFinalizingMomo(true);
      try {
        const momoPayload = Object.fromEntries(searchParams.entries());
        await axios.post(
          getApiUrl("/payment/momo/finalize"),
          { requestId, momoPayload },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setToast({ message: "Thanh toán thành công. Đơn hàng đã được tạo.", type: "success" });
        clearQuery();
        await fetchCart();
        setTimeout(() => navigate("/"), 700);
      } catch (err) {
        setToast({
          message: err?.response?.data?.message || "Xác nhận thanh toán thất bại. Giỏ hàng được giữ nguyên.",
          type: "error",
        });
        clearQuery();
      } finally {
        setIsFinalizingMomo(false);
      }
    };

    finalizeMomoOrder();
  }, [location.search, token, navigate]);

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
      {toast.message ? (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            background: toast.type === "success" ? "#1f8b4c" : "#c0392b",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          {toast.message}
        </div>
      ) : null}

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
            ) : isFinalizingMomo ? (
              <div style={{ padding: "12px 0" }}>Đang xác nhận thanh toán MoMo...</div>
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
            disabled={isFinalizingMomo}
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