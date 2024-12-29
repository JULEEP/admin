import React, { useState, useEffect } from 'react';
import { FiEye, FiEdit, FiTrash2, FiEyeOff, FiPlus } from 'react-icons/fi';
import Tooltip from '../tooltip/Tooltip';
import Sidebar from '../../pages/Sidebar';
import { useNavigate } from 'react-router-dom'; // useNavigate import

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // States for filters
  const [statusFilter, setStatusFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [publishedFilter, setPublishedFilter] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://admin-backend-rl94.onrender.com/api/products/getall/');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters based on current filter states
  const applyFilters = (products) => {
    return products.filter((product) => {
      // Filter by status
      if (statusFilter && product.status !== statusFilter) {
        return false;
      }
      // Filter by price range
      if (
        (minPrice && product.originalPrice < minPrice) ||
        (maxPrice && product.originalPrice > maxPrice)
      ) {
        return false;
      }
      // Filter by published status
      if (publishedFilter !== null && product.published !== publishedFilter) {
        return false;
      }
      return true;
    });
  };

  // Toggle visibility for products
  const toggleVisibility = async (id) => {
    const updatedProducts = products.map((product) => {
      if (product._id === id) {
        return { ...product, published: !product.published };
      }
      return product;
    });
    setProducts(updatedProducts);

    try {
      const response = await fetch(`https://admin-backend-rl94.onrender.com/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !updatedProducts.find((product) => product._id === id).published }),
      });

      if (!response.ok) throw new Error('Failed to update visibility');
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`https://admin-backend-rl94.onrender.com/api/products/delete-product/${id}`, { method: 'DELETE' });

        if (response.ok) {
          setProducts(products.filter(product => product._id !== id));
        } else {
          throw new Error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('An error occurred while deleting the product. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selling':
        return 'bg-green-100 text-green-800';
      case 'Sold Out':
        return 'bg-red-100 text-red-800';
      case 'Coming Soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pre Order':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const paginate = (data, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(products.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  const viewProductDetails = async (id) => {
    try {
      const response = await fetch(`https://admin-backend-rl94.onrender.com/api/products/${id}`);
      const product = await response.json();
      navigate({ pathname: `/product-details/${id}`, state: { product } });
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  // Apply filters to the products
  const filteredProducts = applyFilters(products);
  const visibleProducts = paginate(filteredProducts, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const firstItemIndex = (currentPage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 mx-1 rounded-full ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-300'}`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar style={{ marginRight: '60px'}} />
      <div className="flex-1 p-6 bg-gray-50 mt-2">
        {/* Add Product Button */}
        <div className="flex justify-end sm:justify-start mb-4">
          <button
            onClick={() => navigate('/add-product')}
            className="flex items-center bg-green-500 text-white px-4 py-2 mr-4 ml-6 rounded-md hover:bg-blue-600"
          >
            <FiPlus className="mr-2" />
            Add Product
          </button>
        </div>

        {/* Filter Controls */}
        <div className="mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mr-4 p-2 border rounded-md"
          >
            <option value="">Select Status</option>
            <option value="Selling">Selling</option>
            <option value="Sold Out">Sold Out</option>
            <option value="Coming Soon">Coming Soon</option>
            <option value="Pre Order">Pre Order</option>
          </select>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price"
            className="mr-4 p-2 border rounded-md"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price"
            className="mr-4 p-2 border rounded-md"
          />
          <select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value={null}>Select Published</option>
            <option value="true">Published</option>
            <option value="false">Not Published</option>
          </select>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Product ID</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Discount</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Published</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Details</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => (
                <tr key={product._id} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-sm text-gray-700">{product._id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{product.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">₹ {product.originalPrice}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{product.quantity}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {product.discount !== 0 ? `${product.discount.toFixed(0)}% Off` : 'No Discount'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <button onClick={() => toggleVisibility(product._id)} className="text-blue-500">
                      {product.published ? <FiEye className="inline-block" /> : <FiEyeOff className="inline-block" />}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <button onClick={() => viewProductDetails(product._id)} className="text-blue-500">
                      <FiEye />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <button onClick={() => handleDelete(product._id)} className="text-red-500">
                      <FiTrash2 />
                    </button>
                    <button className="ml-3 text-yellow-500">
                      <FiEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-700">
            Showing {firstItemIndex} to {lastItemIndex} of {filteredProducts.length} products
          </p>
          <div className="flex">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 mx-1 rounded-full bg-gray-200 hover:bg-gray-300"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 mx-1 rounded-full bg-gray-200 hover:bg-gray-300"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
