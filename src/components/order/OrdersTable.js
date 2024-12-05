import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
import Sidebar from '../../pages/Sidebar';

// Define a mapping for order statuses and their respective colors
const statusColors = {
  Draft: 'bg-gray-200 text-gray-800',
  'Payment Pending': 'bg-yellow-100 text-yellow-800',
  'Payment Confirmed': 'bg-blue-100 text-blue-800',
  'Order Confirmed': 'bg-green-100 text-green-800',
  'Print Ready': 'bg-indigo-100 text-indigo-800',
  Shipped: 'bg-blue-200 text-blue-800',
  Delivered: 'bg-green-200 text-green-800',
  Processing: 'bg-orange-100 text-orange-800',
  'Refund request': 'bg-red-100 text-red-800',
  Confirmed: 'bg-green-100 text-green-800',
  'Return Requested': 'bg-purple-100 text-purple-800',
  Cancelled: 'bg-red-200 text-red-800',
  CancelledRequest: 'bg-red-300 text-red-800',
  'Refund Success': 'bg-teal-100 text-teal-800',
  Placed: 'bg-yellow-200 text-yellow-800',
  'Not Processed': 'bg-gray-100 text-gray-800',
  Pending: 'bg-yellow-200 text-yellow-800',
  Scheduled: 'bg-blue-100 text-blue-800',
  'Unshipped': 'bg-gray-200 text-gray-800',
  'Transferred to delivery partner': 'bg-blue-300 text-blue-800',
  Received: 'bg-green-100 text-green-800',
  'Cancel request': 'bg-red-300 text-red-800',
  'Out for Delivery': 'bg-blue-300 text-blue-800',
  Shipping: 'bg-blue-100 text-blue-800',
  'Processing Refund': 'bg-pink-100 text-pink-800',
};

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://admin-backend-rl94.onrender.com/api/orders/get-orders/');
        const data = await response.json();
        console.log(data);  // Check the structure of the returned data
        if (data.length === 0) {
          setOrders([]); // If no orders, set empty array
        } else {
          setOrders(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Handle order deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`https://admin-backend-rl94.onrender.com/api/order/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setOrders(orders.filter(order => order._id !== id)); // Remove deleted order from state
        } else {
          throw new Error('Failed to delete order');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('An error occurred while deleting the order. Please try again.');
      }
    }
  };

  // Handle order status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://admin-backend-rl94.onrender.com/api/orders/updateOrderStatus/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(order => order._id === updatedOrder.orderId ? updatedOrder : order));
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('An error occurred while updating the order status. Please try again.');
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
    if (newPage >= 1 && newPage <= Math.ceil(orders.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  // Loading state
  if (loading) return <div>Loading...</div>;

  // Get visible orders for the current page
  const visibleOrders = paginate(orders, currentPage, itemsPerPage);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

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
        <div className="w-full max-w-7xl overflow-x-auto"> {/* Added overflow-x-auto for responsiveness */}
          <table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-24">SR NO</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-48">Order ID</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-40">Order Type</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-32">Currency</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-48">Product</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-32">Quantity</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-32">Status</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-32">Scheduled</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-32">Cancelled</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-48">Created At</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-48">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-3 px-6 text-center text-sm text-gray-700">No orders available</td>
                </tr>
              ) : (
                visibleOrders.map((order, index) => (
                  <tr key={order._id} className="border-t border-gray-200">
                    <td className="py-3 px-6 text-sm text-gray-700">{index + 1}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{order._id}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{order.orderType}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{order.currency}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">
                      {order.products.length > 0 ? order.products[0].product : 'No Product'}
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-700">{order.products.length > 0 ? order.products[0].quantity : 0}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">
                    <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`border p-1 rounded ${statusColors[order.orderStatus]}`}
                  >
                    {Object.keys(statusColors).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-700">{order.isScheduled ? 'Yes' : 'No'}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{order.isCancelled ? 'Yes' : 'No'}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-6 text-sm text-center">
                      <button
                        onClick={() => navigate(`/edit-order/${order._id}`)}
                        className="ml-2 text-yellow-500 hover:text-yellow-700 mx-2"
                      >
                        <FaEdit className="inline-block" />
                      </button>
                      <button onClick={() => handleDelete(order._id)} className="ml-2 text-red-500 hover:text-red-700 mx-2">
                        <FaTrashAlt className="inline-block" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
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

            {/* Page Numbers */}
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

export default OrdersTable;
