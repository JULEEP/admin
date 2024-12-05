import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // useNavigate import
import { NavLink } from 'react-router-dom'; // Import NavLink
import { toast } from 'react-toastify';
import { IoLogOutOutline } from 'react-icons/io5';
import { ImStack } from 'react-icons/im';
import { FiShoppingCart, FiUsers, FiFileText, FiSettings, FiMenu } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Logout function
  const handleLogOut = async () => {
    try {
      const response = await fetch('https://admin-backend-rl94.onrender.com/api/admin/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies if needed
      });

      if (response.ok) {
        toast.success('Logged out successfully!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });

        // Clear local storage (or session data)
        localStorage.removeItem('authToken');

        // Redirect to home page
        navigate('/');
      } else {
        const result = await response.json();
        toast.error(result.message || 'Failed to logout');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative">
      {/* Hamburger Icon for Small Screens */}
      <button
        className="lg:hidden fixed top-0 left-0 z-10 text-gray-800 p-2"
        onClick={toggleSidebar}
      >
        <FiMenu className="text-2xl" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-gray-800 shadow-lg transition-transform transform lg:translate-x-0 lg:static ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5">
          <a href="/dashboard">
            <h1 className="text-xl font-bold text-center">JaisawalOffset</h1>
          </a>
          <ul>
            <li className="mb-8 mt-12">
              <NavLink
                to="/dashboard"
                className="flex items-center text-gray-800 hover:text-green-500 font-semibold"
                activeClassName="text-green-500"
                onClick={() => setIsSidebarOpen(false)} // Close sidebar on click
              >
                <ImStack className="mr-4 hover:text-green-500" /> Dashboard
              </NavLink>
            </li>
            <li className="mb-8">
              <NavLink
                to="/get-products"
                className="flex items-center text-gray-800 hover:text-green-500 font-semibold"
                activeClassName="text-green-500"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FiShoppingCart className="mr-4 hover:text-green-500" /> Products
              </NavLink>
            </li>
            <li className="mb-8">
              <NavLink
                to="/customers"
                className="flex items-center text-gray-800 hover:text-green-500 font-semibold"
                activeClassName="text-green-500"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FiUsers className="mr-4 hover:text-green-500" /> Customers
              </NavLink>
            </li>
            <li className="mb-8">
              <NavLink
                to="/orders"
                className="flex items-center text-gray-800 hover:text-green-500 font-semibold"
                activeClassName="text-green-500"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FiFileText className="mr-4 hover:text-green-500" /> Orders
              </NavLink>
            </li>
            <li className="mb-8">
              <NavLink
                to="/staffs"
                className="flex items-center text-gray-800 hover:text-green-500 font-semibold"
                activeClassName="text-green-500"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FiUsers className="mr-4 hover:text-green-500" /> Our Staff
              </NavLink>
            </li>
            <li className="mb-8">
              <NavLink
                to="/categories"
                className="flex items-center text-gray-800 hover:text-green-500 font-semibold"
                activeClassName="text-green-500"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FiUsers className="mr-4 hover:text-green-500" /> Categories
              </NavLink>
            </li>
            <li className="mb-8">
              <NavLink
                to="/setting"
                className="flex items-center text-gray-800 hover:text-green-500 font-semibold"
                activeClassName="text-green-500"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FiSettings className="mr-4 hover:text-green-500" /> Setting
              </NavLink>
            </li>
          </ul>
          <span className="absolute bottom-4 left-2 mb-35 w-full px-4">
            <button
              onClick={handleLogOut}
              className="w-full bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center"
            >
              <IoLogOutOutline className="mr-3 text-lg" />
              <span className="text-sm font-semibold">Log out</span>
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
