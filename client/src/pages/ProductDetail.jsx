import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Product Details</h1>
      <p>Viewing details for product ID: <strong>{id}</strong></p>
    </div>
  );
};

export default ProductDetail;
