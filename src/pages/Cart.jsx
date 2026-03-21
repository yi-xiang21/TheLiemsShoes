import "../assets/css/cart.css";
import ItemsCart from "../components/shared/ItemsCart.jsx";
import { useState } from "react";

function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Nike Air Force 1 Low",
      price: "2.350.000 ₫",
      quantity: 1,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=240&q=80"
    },
    {
      id: 2,
      name: "Adidas Campus 00s",
      price: "2.150.000 ₫",
      quantity: 2,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=240&q=80"
    },
    {
      id: 2,
      name: "Adidas Campus 00s",
      price: "2.150.000 ₫",
      quantity: 2,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=240&q=80"
    },
    {
      id: 2,
      name: "Adidas Campus 00s",
      price: "2.150.000 ₫",
      quantity: 2,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=240&q=80"
    },
    {
      id: 2,
      name: "Adidas Campus 00s",
      price: "2.150.000 ₫",
      quantity: 2,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=240&q=80"
    }
  ]);

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
              <strong>6.650.000 ₫</strong>
            </div>

            <button type="button" className="checkout-btn">
              Thanh toán
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Cart;