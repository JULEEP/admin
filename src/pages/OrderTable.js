import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import { useHistory } from 'react-router-dom'; // For React Router v5
import Sidebar from './Sidebar';

const OrderTable = () => {
  const [ordersData, setOrdersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state

        // Define query parameters (can be dynamic or hardcoded for now)
        const params = {
          orderId: '', // Example query param (optional)
          productId: '', // Example query param (optional)
          orderType: '', // Example query param (optional)
          recent: 'true' // Example query param (optional, for getting recent orders)
        };

        // API request to fetch orders
        const response = await axios.get('https://admin-backend-rl94.onrender.com/api/orders/get-orders', {
          params
        });

        // Update state with fetched orders
        setOrdersData(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Error fetching orders data');
      }
    };

    fetchOrders();
  }, []); // Empty dependency array means this will run once when the component is mounted

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Orders</h1>

      <div>
        <h2>Order Summary</h2>
        <p>Total Orders: {ordersData.totalOrders}</p>
        <p>Total Orders This Month: {ordersData.totalOrdersThisMonth}</p>
        <p>Total Orders Today: {ordersData.totalOrdersToday}</p>
        <p>Print Ready Orders: {ordersData.printReadyOrdersCount}</p>
        <p>Payment Confirmed Orders: {ordersData.paymentConfirmedOrdersCount}</p>
        <p>Payment Pending Orders: {ordersData.paymentPendingOrdersCount}</p>
      </div>

      <div>
        <h2>Order Details</h2>
        {ordersData.orders && ordersData.orders.length > 0 ? (
          <ul>
            {ordersData.orders.map(order => (
              <li key={order._id}>
                <p>Order ID: {order._id}</p>
                <p>Order Type: {order.orderType}</p>
                <p>Order Status: {order.orderStatus}</p>
                <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
                {/* Add more fields as needed */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  );
};

export default OrderTable;
