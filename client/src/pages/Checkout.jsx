import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { name, street, city, state, pincode, phone } = formData;

    if (!street || !city || !state || !pincode || !phone) {
      setError('Please fill in all shipping fields');
      setLoading(false);
      return;
    }

    try {
      // Map cart items to backend Order items schema:
      // product (ref), quantity, size, price
      const orderItems = cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
      }));

      const orderPayload = {
        items: orderItems,
        shippingAddress: {
          street,
          city,
          state,
          pincode,
          phone,
        },
        totalPrice: getCartTotal(),
      };

      const response = await api.post('/orders', orderPayload);
      setSuccessOrder(response.data);
      clearCart(); // Clear local shopping bag
    } catch (err) {
      console.error('Checkout error:', err);
      setError(
        err.response?.data?.message || 'Failed to place order. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // If cart is empty and order hasn't been placed successfully, send user back to shop/cart
  if (cart.length === 0 && !successOrder) {
    return (
      <div className="checkout-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Your Bag is Empty</h2>
        <p style={{ color: '#a8a29e', margin: '1.5rem 0' }}>
          You need items in your cart to checkout.
        </p>
        <Link to="/shop" className="cart-shop-link">
          Go Shopping
        </Link>
      </div>
    );
  }

  // Display Success Confirmation View
  if (successOrder) {
    return (
      <div className="checkout-container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="success-screen">
          <div className="success-icon">&check;</div>
          <h1 className="success-title">Order Confirmed!</h1>
          <p className="success-text">
            Thank you for shopping with us. Your order has been placed successfully and is currently being processed.
          </p>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ color: '#a8a29e', fontSize: '0.9rem' }}>Order Reference:</span>
            <div className="success-order-id" style={{ marginTop: '0.5rem' }}>{successOrder._id}</div>
          </div>
          <Link to="/shop" className="cart-shop-link" style={{ marginTop: 0 }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 800 }}>Secure Checkout</h1>

      {error && (
        <div className="shop-error" style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <div className="checkout-layout">
        {/* Left: Shipping Form */}
        <div className="checkout-form-panel">
          <h3 className="summary-heading" style={{ border: 'none', marginBottom: '1.5rem' }}>
            Shipping Address
          </h3>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-group-full">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                required
                disabled
              />
            </div>

            <div className="form-group-full">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
                disabled
              />
            </div>

            <div className="form-group-full">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                name="street"
                placeholder="123 Luxury Avenue, Apt 4B"
                value={formData.street}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group-half">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                placeholder="Mumbai"
                value={formData.city}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group-half">
              <label className="form-label">State</label>
              <input
                type="text"
                name="state"
                placeholder="Maharashtra"
                value={formData.state}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group-half">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                name="pincode"
                placeholder="400001"
                value={formData.pincode}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group-half">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="order-place-btn" disabled={loading}>
              {loading ? 'Processing Order...' : `Place Order (₹${getCartTotal()})`}
            </button>
          </form>
        </div>

        {/* Right: Order Summary Panel */}
        <div className="cart-summary-box">
          <h3 className="summary-heading">Order Summary</h3>
          <div className="summary-items-list">
            {cart.map((item) => (
              <div key={`${item.product._id}-${item.size}`} className="summary-item-row">
                <div>
                  <span className="summary-item-name">{item.product.name}</span>
                  <span style={{ fontSize: '0.8rem', color: '#a8a29e', marginLeft: '0.5rem' }}>
                    ({item.size} &times; {item.quantity})
                  </span>
                </div>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="summary-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <span>Subtotal</span>
            <span>₹{getCartTotal()}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span>
          </div>

          <div className="summary-row total" style={{ marginBottom: 0 }}>
            <span>Order Total</span>
            <span>₹{getCartTotal()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
