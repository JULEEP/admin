import React, { useState } from 'react';
import axios from 'axios';
import { FaEdit, FaSave, FaSpinner } from 'react-icons/fa'; // Import React Icons
import { useParams } from 'react-router-dom';

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    sku: '',
    title: '',
    slug: '',
    description: '',
    parent: '',
    children: '',
    type: '',
    unit: '',
    quantity: '',
    originalPrice: '',
    price: '',
    discount: '',
    image: '',
    tag: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.put(
        `http://localhost:4000/api/products/update-product/${id}`,
        product
      );
      setLoading(false);
      setMessage(response.data.message);
    } catch (err) {
      setLoading(false);
      setError('Error updating product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Update Product</h2>

        {message && (
          <div className="text-green-600 text-center mb-4">{message}</div>
        )}
        {error && (
          <div className="text-red-600 text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Grid Layout for 3 Fields per Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'SKU', name: 'sku' },
              { label: 'Title', name: 'title' },
              { label: 'Slug', name: 'slug' },
              { label: 'Description', name: 'description' },
              { label: 'Parent', name: 'parent' },
              { label: 'Children', name: 'children' },
              { label: 'Type', name: 'type' },
              { label: 'Unit', name: 'unit' },
              { label: 'Quantity', name: 'quantity' },
              { label: 'Original Price', name: 'originalPrice' },
              { label: 'Price', name: 'price' },
              { label: 'Discount', name: 'discount' },
              { label: 'Image URL', name: 'image' },
              { label: 'Tag', name: 'tag' },
            ].map(({ label, name }) => (
              <div key={name} className="relative">
                <label htmlFor={name} className="text-gray-600 font-semibold">{label}</label>
                <input
                  type="text"
                  id={name}
                  name={name}
                  value={product[name]}
                  onChange={handleChange}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                  placeholder={`Enter ${label}`}
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaSave className="mr-2" />
              )}
              Save Changes
            </button>
            <button
              type="button"
              className="flex items-center justify-center bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-yellow-600 transition duration-300 ease-in-out"
              onClick={() => setProduct({
                sku: '',
                title: '',
                slug: '',
                description: '',
                parent: '',
                children: '',
                type: '',
                unit: '',
                quantity: '',
                originalPrice: '',
                price: '',
                discount: '',
                image: '',
                tag: ''
              })}
            >
              <FaEdit className="mr-2" />
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
