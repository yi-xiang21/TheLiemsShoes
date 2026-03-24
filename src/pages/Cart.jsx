import "../assets/css/cart.css";
import ItemsCart from "../components/shared/ItemsCart.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const formatCurrencyVND = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
  };

  const parsePriceToNumber = (price) => {
    if (typeof price === "number") return price;
    const numberString = String(price).replace(/[^\d]/g, "");
    return Number(numberString) || 0;
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + parsePriceToNumber(item.price) * item.quantity;
  }, 0);

  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1)
            }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  return (
    <section className="cart-page">
      <div className="cart-container">
        <div className="cart-left">
          <h1>Giỏ hàng</h1>
          <div className="cart-list">
            {cartItems.map((item) => (
              <ItemsCart
                key={item.id}
                item={item}
                onIncrease={() => handleIncreaseQuantity(item.id)}
                onDecrease={() => handleDecreaseQuantity(item.id)}
                onRemove={() => handleRemoveItem(item.id)}
              />
            ))}
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