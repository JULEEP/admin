import React, { useState, useEffect } from 'react';
import { FiEye, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Sidebar from '../../pages/Sidebar';
import { useNavigate, Link } from 'react-router-dom'; // useNavigate import

const StaffTable = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Fetch staff data from the backend
  useEffect(() => {
    let isMounted = true; // To track component mount state

    const fetchStaff = async () => {
      try {
        const response = await fetch('https://admin-backend-rl94.onrender.com/api/staff/get');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (isMounted) {
          setStaff(Array.isArray(data.staffMembers) ? data.staffMembers : []);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching staff data:', error);
          setLoading(false);
        }
      }
    };

    fetchStaff();

    // Cleanup on component unmount
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
      alert('Invalid staff ID');
      return;
    }
  
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const response = await fetch(`https://admin-backend-rl94.onrender.com/api/staff/${id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          // Remove deleted staff member from local state
          setStaff(staff.filter((member) => member._id !== id));
          alert('Staff member deleted successfully');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete staff member');
        }
      } catch (error) {
        console.error('Error deleting staff member:', error);
        alert('An error occurred while deleting the staff member. Please try again.');
      }
    }
  };

  // Paginate staff data
  const paginate = (data, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(staff.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  // Display loading spinner if data is being fetched
  if (loading) return <div>Loading...</div>;

  // Data to display in the current page
  const visibleStaff = paginate(staff, currentPage, itemsPerPage);
  const totalPages = Math.ceil(staff.length / itemsPerPage);

  // Generate pagination buttons
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

  // Calculate first and last item index
  const firstItemIndex = (currentPage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * itemsPerPage, staff.length);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 ml-30">
        {/* Add Staff Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/add-staff')}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <FiPlus className="mr-2" />
            Add Staff
          </button>
        </div>

        <table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Contact</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Joining Date</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Order</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleStaff.map((member) => (
              <tr key={member._id} className="border-t border-gray-200">
                <td className="py-3 px-6 text-sm text-gray-700">{member._id}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{member.name}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{member.email}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{member.contactNumber}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{new Date(member.joiningDate).toLocaleDateString()}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{member.status || 'Active'}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{member.order || 'N/A'}</td>
                <td className="py-3 px-6 text-sm text-center">
                  <button
                    onClick={() => navigate(`/update-staff/${member._id}`)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <FiEdit className="inline-block" />
                  </button>
                  <button onClick={() => handleDelete(member._id)} className="ml-2 text-red-500 hover:text-red-700">
                    <FiTrash2 className="inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-700">
            Showing {firstItemIndex} to {lastItemIndex} of {staff.length} staff members
          </p>
          <div className="flex">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 mx-1 rounded-full bg-gray-200 hover:bg-gray-300"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 mx-1 rounded-full bg-gray-200 hover:bg-gray-300"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffTable;
