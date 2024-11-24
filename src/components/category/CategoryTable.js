import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Sidebar from '../../pages/Sidebar';
import { useNavigate } from 'react-router-dom';

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories from API...');
        const response = await fetch('https://admin-backend-rl94.onrender.com/api/category/');
        console.log('API Response:', response);

        if (!response.ok) {
          throw new Error(`Failed to fetch categories. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched Data:', data);

        setCategories(data || []); // Directly set the fetched data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Delete a category
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`https://admin-backend-rl94.onrender.com/api/category/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete category');
        setCategories(categories.filter((category) => category._id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('An error occurred while deleting the category.');
      }
    }
  };

  // Pagination logic
  const paginate = (data, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(categories.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <div>Loading...</div>;

  const visibleCategories = paginate(categories, currentPage, itemsPerPage);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Calculate first and last item index
  const firstItemIndex = (currentPage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * itemsPerPage, categories.length);

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
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 ml-30">
        {/* Add Category Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/add-category')}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            <FiPlus className="mr-2" />
            Add Category
          </button>
        </div>

        <table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Parent</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Slug</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Icon</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleCategories.map((category) => (
              <tr key={category._id} className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm text-gray-700">{category.parent || 'N/A'}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{category.slug || 'N/A'}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{category.type || 'N/A'}</td>
                <td className="py-3 px-6 text-sm text-gray-700">
                  {category.icon ? (
                    <img src={category.icon} alt={category.slug} className="w-6 h-6" />
                  ) : (
                    'No Icon'
                  )}
                </td>
                <td className="py-3 px-6 text-sm text-gray-700">{category.status || 'N/A'}</td>
                <td className="py-3 px-6 text-sm text-center">
                  <button
                    onClick={() => navigate(`/update-category/${category._id}`)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <FiEdit className="inline-block" />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 className="inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-700">
            Showing {firstItemIndex} to {lastItemIndex} of {categories.length} categories
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

export default CategoryTable;
