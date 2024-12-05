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
    <div className="p-8 bg-gray-100 flex flex-col justify-between min-h-screen">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row mb-10 items-start space-x-6">
        {/* Product Image on the left side */}
        <div className="w-full md:w-1/3">
          <img
            src={product.images[0]}
            alt={product.name}
            className="object-cover w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div className="product-details w-full md:w-2/3 mt-6 md:mt-0">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">{product.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Row of Details */}
            <div className="space-y-4">
              <p className="text-lg">
                <span className="font-bold text-gray-700">Category:</span> {product.category}
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-700">Slug:</span> {product.slug}
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-700">MOQ (Minimum Order Quantity):</span> {product.moq}
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-700">Size:</span> {product.size}
              </p>
            </div>

            {/* Second Row of Details */}
            <div className="space-y-4">
              <p className="text-lg">
                <span className="font-bold text-gray-700">Subcategory:</span> {product.children}
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-700">Unit:</span> {product.unit}
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-700">Color:</span> {product.color}
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-700">Discount:</span> {product.discount}% Off
              </p>
            </div>

            {/* Third Row of Details */}
            <div className="space-y-4">
              <p className="text-xl font-semibold text-green-500">
                <span className="font-bold text-gray-700">Price:</span> ₹{product.originalPrice}
              </p>
              <p className="text-xl font-semibold text-red-500">
                <span className="font-bold text-gray-700">Discounted Price:</span> ₹{product.discountedPrice}
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-700">Quantity Available:</span> {product.quantity}
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-700">Status:</span>
                <span className={`px-3 py-1 rounded-full text-white ${product.status === 'Show' ? 'bg-green-500' : 'bg-gray-400'}`}>
                  {product.status}
                </span>
              </p>
            </div>

            {/* Fourth Row of Details */}
            <div className="space-y-4">
              <p className="text-lg">
                <span className="font-bold text-gray-700">Type:</span> {product.type}
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-700">Created At:</span> {new Date(product.createdAt).toLocaleDateString()}
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-700">Last Updated:</span> {new Date(product.updatedAt).toLocaleDateString()}
              </p>
              {product.flashSale && (
                <p className="text-sm text-red-600 font-semibold mt-4">Flash Sale: Active</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
