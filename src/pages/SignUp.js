import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
  
    // Basic validation
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.role) newErrors.role = 'Role is required';
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
  
    // API call to register admin
    try {
      const response = await fetch('https://admin-backend-rl94.onrender.com/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Use toast to show success message
        toast.success('Admin registered successfully!', {
          position: "top-right", // Use string instead of toast.POSITION.TOP_RIGHT
          autoClose: 2500,
        });
  
        setTimeout(() => {
          navigate('/dashboard'); // Redirect to dashboard
        }, 2500);
  
        // Reset form fields
        setFormData({ name: '', email: '', password: '', role: '' });
      } else {
        setErrors({ general: result.message || 'This email is already registered!' });
      }
    } catch (error) {
      console.error('Registration Error:', error); // Log the error to debug
      setErrors({ general: 'Failed to register admin. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="flex flex-col-reverse md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-2xl">
        {/* Left side: Form */}
        <div className="w-full md:w-1/2 p-8">
        <h5 className="text-3xl text-blue-800 mb-6 text-center">
        Admin Registration
      </h5>      
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-5">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="mb-5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Role Dropdown */}
            <div className="mb-5">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select a role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Manager">Manager</option>
                <option value="Designer">Designer</option>
                <option value="Staff">Staff</option>
              </select>
              {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role}</p>}
            </div>

            {/* General Error */}
            {errors.general && (
              <p className="text-sm text-red-500 mb-5 text-center">{errors.general}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-bold rounded-lg bg-blue-500 hover:bg-blue-600 focus:outline-none transition-shadow ${
                loading ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? 'Registering...' : 'Register Admin'}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/admin-login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>

        {/* Right side: Image */}
        <div className="w-full md:w-1/2 bg-cover bg-no-repeat bg-center h-64 md:h-auto" 
             style={{ backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/003/689/224/original/online-registration-or-sign-up-login-for-account-on-smartphone-app-user-interface-with-secure-password-mobile-application-for-ui-web-banner-access-cartoon-people-illustration-vector.jpg')` }}></div>
      </div>
    </div>
  );
};

export default SignUp;
