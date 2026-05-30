import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        // Pre-select first size if available
        if (response.data.sizes && response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. It may not exist or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      alert('Please select a size first!');
      return;
    }

    addToCart(product, 1, selectedSize);
    alert(`${product.name} (Size: ${selectedSize}) added to cart!`);
  };

  const handleBack = () => {
    navigate('/shop');
  };

  if (loading) {
    return (
      <div className="detail-container">
        <div className="shop-loading">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-container">
        <button className="back-btn" onClick={handleBack}>
          &larr; Back to Shop
        </button>
        <div className="shop-error">{error}</div>
      </div>
    );
  }

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="detail-container">
      {/* Back button */}
      <button className="back-btn" onClick={handleBack}>
        &larr; Back to Shop
      </button>

      <div className="product-detail-layout">
        {/* Large Product Image */}
        <div className="detail-image-container">
          <img
            src={product.images && product.images[0] ? product.images[0] : 'https://placehold.co/500x600'}
            alt={product.name}
            className="detail-image"
          />
        </div>

        {/* Product Details Section */}
        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-name">{product.name}</h1>
          
          <div className="detail-price">
            <span>₹{product.price}</span>
          </div>

          <p className="detail-desc">{product.description}</p>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="size-selector-container">
              <div className="size-selector-label">Select Size</div>
              <div className="size-buttons">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status Badge */}
          <div className={`stock-badge ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
            {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
          </div>

          {/* Add to Cart CTA */}
          <div className="action-row">
            <button
              className="detail-add-btn"
              onClick={handleAddToCart}
              disabled={isOutOfStock || !selectedSize}
            >
              {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
