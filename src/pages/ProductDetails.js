import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`https://admin-backend-rl94.onrender.com/api/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-medium text-gray-600">Loading product details...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-medium text-red-600">{error}</div>
      </div>
    );
  if (!product)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-medium text-gray-600">Product not found!</div>
      </div>
    );

  return (
    <div className="p-8 h-screen bg-gray-100 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-6">{product.title}</h1>

        {/* Right-Aligned Details */}
        <div className="flex justify-end">
          <div className="text-lg font-semibold text-gray-700 space-y-2">
            <p>
              <span className="font-bold">Price:</span> ₹{product.price}
            </p>
            <p>
              <span className="font-bold">Quantity:</span> {product.quantity}
            </p>
            <p>
              <span className="font-bold">Status:</span> {product.status}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Description</h2>
        <p className="text-gray-700">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
