import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect non-admin users to Home
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Tops',
    sizes: [],
    imageUrl: '',
    stock: '',
  });

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching admin inventory:', err);
      setError('Failed to fetch inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchProducts();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newSizes = checked
        ? [...prev.sizes, value]
        : prev.sizes.filter((s) => s !== value);
      return { ...prev, sizes: newSizes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { name, description, price, category, sizes, imageUrl, stock } = formData;

    if (!name || !description || !price || !imageUrl || !stock) {
      alert('Please fill in all required product fields');
      return;
    }

    if (sizes.length === 0) {
      alert('Please select at least one size option');
      return;
    }

    try {
      const productPayload = {
        name,
        description,
        price: Number(price),
        category,
        sizes,
        images: [imageUrl],
        stock: Number(stock),
      };

      await api.post('/products', productPayload);
      alert('Product created successfully!');
      
      // Clear form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Tops',
        sizes: [],
        imageUrl: '',
        stock: '',
      });

      // Refresh table list
      fetchProducts();
    } catch (err) {
      console.error('Failed to create product:', err);
      alert(err.response?.data?.message || 'Error creating product. Please try again.');
    }
  };

  const handleDelete = async (productId, productName) => {
    const confirmDelete = window.confirm(`Are you sure you want to remove "${productName}"?`);
    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${productId}`);
      alert('Product successfully deleted.');
      fetchProducts(); // Refresh list
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Error deleting product. Please try again.');
    }
  };

  // Prevent flashing content during navigate redirect
  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="admin-container">
      <h1 style={{ marginBottom: '2.5rem', fontSize: '2rem', fontWeight: 800 }}>Admin Dashboard</h1>

      <div className="admin-grid">
        {/* Left: Add Product Form */}
        <div className="admin-form-panel">
          <h3 className="summary-heading" style={{ border: 'none', marginBottom: '1.5rem' }}>
            Add New Product
          </h3>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-group-full">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group-full">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-input"
                rows="3"
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            <div className="form-group-half">
              <label className="form-label">Price (₹) *</label>
              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group-half">
              <label className="form-label">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group-full">
              <label className="form-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Dresses">Dresses</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="form-group-full">
              <label className="form-label">Sizes *</label>
              <div className="checkbox-grid">
                {availableSizes.map((size) => (
                  <label key={size} className="checkbox-item">
                    <input
                      type="checkbox"
                      value={size}
                      checked={formData.sizes.includes(size)}
                      onChange={handleSizeChange}
                    />
                    <span className="checkbox-text">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group-full">
              <label className="form-label">Image URL *</label>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="order-place-btn" style={{ gridColumn: 'span 2' }}>
              Publish Product
            </button>
          </form>
        </div>

        {/* Right: Products Inventory List */}
        <div className="admin-list-panel">
          <h3 className="summary-heading" style={{ border: 'none', marginBottom: '1.5rem' }}>
            Products Inventory ({products.length})
          </h3>

          {loading ? (
            <div className="shop-loading" style={{ padding: '2rem 0' }}>Refreshing inventory...</div>
          ) : error ? (
            <div className="shop-error" style={{ padding: '2rem 0' }}>{error}</div>
          ) : products.length === 0 ? (
            <div className="shop-empty" style={{ padding: '2rem 0' }}>No products in catalog.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td style={{ fontWeight: 600 }}>{product.name}</td>
                    <td>{product.category}</td>
                    <td>₹{product.price}</td>
                    <td>
                      <span style={{ color: product.stock === 0 ? '#ef4444' : '#fafaf9', fontWeight: 600 }}>
                        {product.stock}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="admin-delete-btn"
                        onClick={() => handleDelete(product._id, product.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
