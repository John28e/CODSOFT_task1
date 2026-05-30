import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckoutRedirect = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Your Bag is Empty</h1>
        <p style={{ color: '#a8a29e', marginBottom: '2rem' }}>
          Looks like you haven't added any products to your cart yet.
        </p>
        <Link to="/shop" className="cart-shop-link">
          Explore Products &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 800 }}>Shopping Bag</h1>

      <div className="cart-layout">
        {/* Cart Items List */}
        <div className="cart-items-list">
          {cart.map((item) => (
            <div key={`${item.product._id}-${item.size}`} className="cart-item-card">
              {/* Product Thumbnail */}
              <img
                src={item.product.images && item.product.images[0] ? item.product.images[0] : 'https://placehold.co/100x120'}
                alt={item.product.name}
                className="cart-item-img"
              />

              {/* Product Info */}
              <div className="cart-item-info">
                <h3 className="cart-item-title">
                  <Link to={`/product/${item.product._id}`} style={{ color: '#fafaf9', textDecoration: 'none' }}>
                    {item.product.name}
                  </Link>
                </h3>
                <div className="cart-item-meta">Size: {item.size}</div>
                <div className="cart-item-price">₹{item.price}</div>
              </div>

              {/* Quantity Controls */}
              <div className="cart-quantity-selector">
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}
                >
                  -
                </button>
                <span className="qty-val">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              {/* Remove Action */}
              <button
                className="cart-item-remove-btn"
                onClick={() => removeFromCart(item.product._id, item.size)}
                title="Remove Item"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Panel */}
        <div className="cart-summary-box">
          <h3 className="summary-heading">Order Summary</h3>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{getCartTotal()}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span>
          </div>

          <div className="summary-row total">
            <span>Grand Total</span>
            <span>₹{getCartTotal()}</span>
          </div>

          <button className="checkout-proceed-btn" onClick={handleCheckoutRedirect}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
