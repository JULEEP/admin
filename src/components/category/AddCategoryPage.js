import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate

const AddCategoryPage = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [formData, setFormData] = useState({
    parent: '',
    slug: '',
    type: '',
    icon: '',
    children: [
      { name: '', slug: '', icon: '' },
    ],
    status: 'Show',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChildChange = (index, field, value) => {
    const updatedChildren = [...formData.children];
    updatedChildren[index][field] = value;
    setFormData({ ...formData, children: updatedChildren });
  };

  const addChild = () => {
    setFormData({
      ...formData,
      children: [...formData.children, { name: '', slug: '', icon: '' }],
    });
  };

  const removeChild = (index) => {
    const updatedChildren = formData.children.filter((_, i) => i !== index);
    setFormData({ ...formData, children: updatedChildren });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://admin-backend-rl94.onrender.com/api/category/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add category');

      const result = await response.json();
      alert(result.message || 'Category added successfully!');
      
      // Use navigate instead of history.push
      navigate('/categories');
    } catch (err) {
      console.error('Error adding category:', err);
      setError('An error occurred while adding the category.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Add New Category</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
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
                required
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
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
                required
              />
            </div>

            <div>
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

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Show">Show</option>
                <option value="Hide">Hide</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Children</h3>
            {formData.children.map((child, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-4 p-4 border rounded-md">
                <input
                  type="text"
                  placeholder="Name"
                  value={child.name}
                  onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Slug"
                  value={child.slug}
                  onChange={(e) => handleChildChange(index, 'slug', e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Icon URL"
                  value={child.icon}
                  onChange={(e) => handleChildChange(index, 'icon', e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {formData.children.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChild(index)}
                    className="col-span-3 text-red-600 text-sm underline mt-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addChild}
              className="text-blue-600 text-sm underline"
            >
              + Add Another Child
            </button>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/categories')} // Use navigate instead of history.push
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryPage;
