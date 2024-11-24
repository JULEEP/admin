import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const UpdateCategoryPage = () => {
  const { id } = useParams(); // Extract category ID from route params
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    parent: '',
    type: '',
    icon: '',
    children: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch category data on component mount
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/category/${id}`);
        if (!response.ok) throw new Error('Failed to fetch category data');
        const data = await response.json();
        setFormData({
          parent: data.parent || '',
          type: data.type || '',
          icon: data.icon || '',
          children: data.children || [],
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to fetch category data.');
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/category/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update category');

      const result = await response.json();
      alert(result.message || 'Category updated successfully!');
      navigate('/categories'); // Navigate back to the category list
    } catch (err) {
      console.error('Error updating category:', err);
      alert('An error occurred while updating the category.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Update Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="parent" className="block text-sm font-medium text-gray-700">
              Parent Category
            </label>
            <input
              type="text"
              id="parent"
              name="parent"
              value={formData.parent}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
              Icon URL
            </label>
            <input
              type="text"
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="children" className="block text-sm font-medium text-gray-700">
              Children (Comma-separated)
            </label>
            <input
              type="text"
              id="children"
              name="children"
              value={formData.children.join(',')}
              onChange={(e) =>
                setFormData({ ...formData, children: e.target.value.split(',').map((child) => child.trim()) })
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/categories')}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategoryPage;
