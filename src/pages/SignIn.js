import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://admin-backend-rl94.onrender.com/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 2500,
        });

        // Store token in local storage
        localStorage.setItem('authToken', result.token);

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 2500);
      } else {
        setError(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-lg shadow-lg">
        {/* Left side: Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl text-blue-800 mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-bold rounded-lg bg-blue-500 hover:bg-blue-600 focus:outline-none transition-shadow ${loading ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg'}`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Right side: Image */}
        <div className="w-full md:w-1/2 flex justify-center items-center bg-cover bg-no-repeat bg-center p-4">
          <img 
            src="https://images.template.net/85071/free-mobile-application-illustration-8co7s.jpg" 
            alt="Mobile Illustration" 
            className="w-full md:w-3/4 lg:w-1/2 h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
