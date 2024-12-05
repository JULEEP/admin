import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserDetails = () => {
  const { id } = useParams(); // Extract user ID from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details when the component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`https://admin-backend-rl94.onrender.com/api/users/${id}`);
        setUser(response.data);
      } catch (err) {
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  // Show loading spinner or error message
  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  // Render the user details in a modal
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full transition-transform transform scale-100">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">User Details</h2>
        <div className="space-y-4">
          {/* User Details */}
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Full Name:</span>
            <span className="text-gray-600">{user.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Phone Number:</span>
            <span className="text-gray-600">{user.phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Status:</span>
            <span className={`text-white px-3 py-1 rounded-full text-sm ${user.Status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}>
              {user.Status}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
