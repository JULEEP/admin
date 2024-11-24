import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import { useHistory } from 'react-router-dom'; // For React Router v5
import Sidebar from './Sidebar';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const history = useHistory();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://admin-backend-rl94.onrender.com/api/orders/get-orders');
        const data = await response.json();
        setOrders(data.length ? data : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`https://admin-backend-rl94.onrender.com/api/order/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setOrders(orders.filter((order) => order._id !== id));
        } else {
          throw new Error('Failed to delete order');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('An error occurred while deleting the order. Please try again.');
      }
    }
  };

  const paginate = (data, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(orders.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <div>Loading...</div>;

  const visibleOrders = paginate(orders, currentPage, itemsPerPage);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 mx-1 rounded-full ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-blue-300'
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <h4 className="text-xl font-bold text-gray-800 mb-6">Orders</h4>
        <div className="w-full max-w-7xl overflow-x-auto bg-white rounded-lg shadow p-4">
          <table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-24">SR NO</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-48">Time</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-72">Shipping Address</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-40">Phone</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-32">Method</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-24">Amount</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-32">Status</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-48">Action</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 w-48">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="py-3 px-6 text-center text-sm text-gray-700"
                  >
                    No orders available
                  </td>
                </tr>
              ) : (
                visibleOrders.map((order, index) => (
                  <tr key={order._id} className="border-t border-gray-200">
                    <td className="py-3 px-6 text-sm text-gray-700">{index + 1}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{order.time}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{order.shippingAddress}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{order.phone}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{order.method}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{order.amount}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{order.status}</td>
                    <td className="py-3 px-6 text-sm text-center">
                      <button
                        onClick={() => history.push(`/edit-order/${order._id}`)}
                        className="ml-2 text-yellow-500 hover:text-yellow-700 mx-2"
                      >
                        <FaEdit className="inline-block" />
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="ml-2 text-red-500 hover:text-red-700 mx-2"
                      >
                        <FaTrashAlt className="inline-block" />
                      </button>
                    </td>
                    <td className="py-3 px-6 text-sm text-center">
                      <button
                        onClick={() => history.push(`/view-invoice/${order._id}`)}
                        className="text-blue-500 hover:text-blue-700 mx-2"
                      >
                        <FaEye className="inline-block" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-center items-center mt-4">
            <div className="flex">{renderPageNumbers()}</div>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-gray-600 disabled:text-gray-400 hover:text-gray-800"
              >
                &lt; Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-gray-600 disabled:text-gray-400 hover:text-gray-800"
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
