import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const featuredCategories = [
    {
      name: 'Tops',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: 'Bottoms',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: 'Dresses',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=80',
    },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/shop?category=${categoryName}`);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Premium Hero Banner */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Elevate Your Style</h1>
            <p className="hero-subtitle">Discover the new luxury essentials for the modern wardrobe.</p>
            <button className="hero-btn" onClick={() => navigate('/shop')}>
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {featuredCategories.map((category) => (
            <div
              key={category.name}
              className="category-card"
              onClick={() => handleCategoryClick(category.name)}
            >
              <img
                src={category.image}
                alt={category.name}
                className="category-card-img"
              />
              <div className="category-card-overlay">
                <span className="category-card-title">{category.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
