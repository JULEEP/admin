import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaUserCheck, FaUserTimes, FaEye } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom'; // useNavigate import
import Sidebar from './Sidebar';

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(''); // Add state for search term
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Fetch users on component mount or when search term changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Add search query to API request
        const response = await fetch(`https://admin-backend-rl94.onrender.com/api/users?search=${search}`);
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [search]); // Re-run when the search term changes

  // Handle user deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`https://admin-backend-rl94.onrender.com/api/user/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUsers(users.filter(user => user._id !== id));
        } else {
          throw new Error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user. Please try again.');
      }
    }
  };

  // Toggle user visibility
  const toggleVisibility = async (id) => {
    const updatedUsers = users.map(user => {
      if (user._id === id) {
        return {
          ...user,
          active: !user.active,
        };
      }
      return user;
    });

    setUsers(updatedUsers);

    try {
      const response = await fetch(`https://admin-backend-rl94.onrender.com/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          active: !updatedUsers.find(user => user._id === id).active,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update visibility');
      }
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };

  // Paginate data
  const paginate = (data, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Handle page changes
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(users.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  // Loading state
  if (loading) return <div>Loading...</div>;

  // Get visible users for the current page
  const visibleUsers = paginate(users, currentPage, itemsPerPage);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Render page numbers for pagination
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
    <div className="flex min-h-screen mt-30">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 ml-30 flex justify-center">
        <div className="w-full max-w-7xl">
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Name, Email, Phone or Status"
              className="p-2 border border-gray-300 rounded-md w-full md:w-1/2"
            />
          </div>

          <table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-24">User ID</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-48">Name</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-72">Email</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-40">Phone</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-32">Role</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-24">Active</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-48">Details</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-48">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user._id} className="border-t border-gray-200">
                  <td className="py-3 px-6 text-sm text-gray-700">{user._id}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">{user.fullName}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">{user.email}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">{user.phone}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">{user.role}</td>
                  <td className="py-3 px-6 text-sm">
                    <button onClick={() => toggleVisibility(user._id)} className="text-blue-500">
                      {user.active ? <FaUserCheck className="inline-block" /> : <FaUserTimes className="inline-block" />}
                    </button>
                  </td>
                  {/* New "Details" column with FaEye icon */}
                  <td className="py-3 px-6 text-sm text-center">
                    <button
                      onClick={() => navigate(`/user-details/${user._id}`)}
                      className="text-green-500 hover:text-green-700 mx-2"
                    >
                      <FaEye className="inline-block" />
                    </button>
                  </td>
                  <td className="py-3 px-6 text-sm text-center">
                    <button
                      onClick={() => navigate(`/edit-user/${user._id}`)}
                      className="ml-2 text-yellow-500 hover:text-yellow-700 mx-2"
                    >
                      <FaEdit className="inline-block" />
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="ml-2 text-red-500 hover:text-red-700 mx-2">
                      <FaTrashAlt className="inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-white bg-blue-500 hover:bg-blue-700 rounded-full w-10 h-10 flex items-center justify-center disabled:bg-blue-300"
            >
              &lt;
            </button>

            <div className="flex mx-2">
              {renderPageNumbers()}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-white bg-blue-500 hover:bg-blue-700 rounded-full w-10 h-10 flex items-center justify-center disabled:bg-blue-300"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
