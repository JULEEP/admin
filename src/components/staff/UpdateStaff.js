import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateStaff = () => {
  const { id } = useParams(); // Get staff ID from the URL
  const navigate = useNavigate();
  const [staffData, setStaffData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    staffRole: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`https://admin-backend-rl94.onrender.com/api/staff/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Staff member not found');
          }
          throw new Error('Failed to fetch staff data');
        }
        const data = await response.json();
        setStaffData({
          name: data.name,
          email: data.email,
          contactNumber: data.contactNumber,
          status: data.status || 'Active',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching staff:', error.message);
        alert(error.message);
      }
    };
  
    fetchStaff();
  }, [id]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffData({ ...staffData, [name]: value });
  };

  // Submit updated staff details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://admin-backend-rl94.onrender.com/api/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffData),
      });

      if (response.ok) {
        alert('Staff updated successfully');
        navigate('/staff');
      } else {
        throw new Error('Failed to update staff');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating staff');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Update Staff</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={staffData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={staffData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={staffData.contactNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Staff Role</label>
          <select
            name="staffRole"
            value={staffData.staffRole}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Update Staff
        </button>
      </form>
    </div>
  );
};

export default UpdateStaff;
