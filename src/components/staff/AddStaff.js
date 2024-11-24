import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // useNavigate import

const AddStaff = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactNumber: '',
    staffRole: '',
  });
  const [roles] = useState(['Admin', 'Manager', 'Designer']); // Roles for the dropdown
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://admin-backend-rl94.onrender.com/api/staff/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add staff');
      }

      alert('Staff added successfully!');
      navigate('/staffs'); // Redirect to staff table
    } catch (err) {
      console.error('Error adding staff:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 shadow-lg rounded-lg text-center mb-6">
          Add New Staff
        </h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
              placeholder="Enter staff name"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
              placeholder="Enter email address"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Contact Number Field */}
          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
              placeholder="Enter contact number"
              required
            />
          </div>

          {/* Staff Role Dropdown */}
          <div>
            <label htmlFor="staffRole" className="block text-sm font-medium text-gray-700">
              Staff Role
            </label>
            <select
              id="staffRole"
              name="staffRole"
              value={formData.staffRole}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
              required
            >
              <option value="" disabled>
                Select a role
              </option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300"
            >
              {loading ? 'Adding...' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
