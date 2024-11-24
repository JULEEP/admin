import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const EditProfile = ({ adminId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    profilePicture: '',
  });

  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.put(
        `https://admin-backend-rl94.onrender.com/api/admin/profile/${adminId}`,
        { ...formData, profilePicture: imageUrl },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        }
      );

      if (response.status === 200) {
        toast.success('Profile updated successfully!', {
          position: toast.POSITION.TOP_RIGHT,
        });
        setFormData({ name: '', email: '', phone: '', role: '', profilePicture: '' });
        setImageUrl('');
        setErrors({});
      } else {
        toast.error(response.data.message || 'Failed to update profile.', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'An error occurred while updating the profile.',
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="grid grid-cols-6 gap-6">
            <label className="col-span-6 sm:col-span-4 text-gray-700">
              Profile Picture
            </label>
            <div className="col-span-6 sm:col-span-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Uploaded Preview"
                  className="mt-4 w-32 h-32 object-cover rounded-full border"
                />
              )}
            </div>
          </div>

          {/* Name and Email in one row */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Enter your name"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter your email"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          {/* Phone and Role in one row */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700">Contact Number</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="text"
                placeholder="Enter your contact number"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </select>
              {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="h-12 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
