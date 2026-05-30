import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';

const Shop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  
  // Extract initial category from URL
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Sync category state when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category') || 'All';
    setActiveCategory(cat);
  }, [location.search]);

  const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Accessories'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = activeCategory === 'All'
          ? '/products'
          : `/products?category=${activeCategory}`;
        const response = await api.get(endpoint);
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent navigating to details page
    // Use the first size in product.sizes or 'M' as default size
    const selectedSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
    addToCart(product, 1, selectedSize);
    alert(`${product.name} (Size: ${selectedSize}) added to cart!`);
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1 className="shop-title">Discover Our Collection</h1>
        <p className="shop-subtitle">Premium quality pieces curated for your style</p>
      </div>

      {/* Category filter buttons */}
      <div className="filters-container">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Fetch States */}
      {loading && <div className="shop-loading">Updating collection...</div>}
      
      {error && <div className="shop-error">{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div className="shop-empty">No products found in this category.</div>
      )}

      {/* Products list grid */}
      {!loading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product._id}
              className="product-card"
              onClick={() => handleCardClick(product._id)}
            >
              <div className="product-image-container">
                <img
                  src={product.images && product.images[0] ? product.images[0] : 'https://placehold.co/400x500'}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price-row">
                  <span className="product-price">₹{product.price}</span>
                  <button
                    className="add-to-cart-btn"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
