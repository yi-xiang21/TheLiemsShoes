import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/css/checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = location.state?.cartItems || [];

  const total = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/\D/g, ""));
    return sum + price * item.quantity;
  }, 0);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const [errors, setErrors] = useState({});



  // ✅ FIX VALIDATE
  const validate = () => {
    let newErrors = {};

    // Name
    if (!form.name.trim()) {
      newErrors.name = "Please enter your full name";
    }

    // Phone
    if (!form.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
    } else if (!/^0\d{9}$/.test(form.phone)) {
      newErrors.phone = "Phone must be 10 digits and start with 0";
    }

    // Address
    if (!form.address.trim()) {
      newErrors.address = "Please enter your address";
    }

    // Email
    if (!form.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Incorrect email format (abc + @gmail.com)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    alert("Order placed successfully 🎉");
    console.log({ form, cartItems });
  };

  return (
    <div className="checkout-wrapper">
      {/* LEFT */}
      <div className="checkout-left">
        <h2>Recipient Information</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <label>Full Name</label>
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <label>Phone Number</label>
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <label>Address</label>
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <label>Email</label>
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div >
            <p>Payment Method</p>
            <label>
              <input type="radio" name="payment" value="cod" />
              COD
            </label>
            <br />
            <label>
              <input type="radio" name="payment" value="momo" />
              MoMo
            </label>
          </div>

          <div className="button-group">
            <button type="button" onClick={() => navigate("/cart")}>
              Back to Cart
            </button>

            <button type="submit">Place Order</button>
          </div>
        </form>
      </div>

      {/* RIGHT */}
      <div className="checkout-right">
        <h3>Order Summary</h3>

        {cartItems.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="order-item">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>{item.price}</span>
            </div>
          ))
        )}

        <hr />

        <div className="order-total">
          <span>Total</span>
          <strong>{total.toLocaleString()} ₫</strong>
        </div>
      </div>
    </div>
  );
}

export default Checkout;