import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import Sidebar component
import './GetOrders.css'; // Import the CSS file

const GetOrders = () => {
  const [ordersData, setOrdersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query

  // List of possible order statuses
  const orderStatuses = [
    "Draft",
    "Payment Pending",
    "Payment Confirmed",
    "Order Confirmed",
    "Print Ready",
    "Shipped"
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Define query parameters (searchQuery is sent for all fields)
        const params = {
          search: searchQuery,  // Send the single search query
          recent: 'true', // You can keep this fixed for now
        };

        const response = await axios.get(
          'https://admin-backend-rl94.onrender.com/api/orders/get-orders',
          { params }
        );

        console.log('API Response:', response.data); // Log the entire response for debugging
        setOrdersData(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Error fetching orders data');
      }
    };

    fetchOrders();
  }, [searchQuery]); // Fetch orders whenever the search query changes

  // Handle change in the search input field
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query
  };

  // Handle the change in order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Make the API call to update order status
      const response = await axios.put(
        `https://admin-backend-rl94.onrender.com/api/orders/updateOrderStatus/${orderId}`,
        { newStatus }
      );

      if (response.status === 200) {
        // Successfully updated order status
        // Refresh the orders data to reflect the new status
        setOrdersData(prevData => ({
          ...prevData,
          orders: prevData.orders.map(order => 
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          ),
        }));
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    }
  };

  // Function to download the invoice PDF
  const handleInvoiceDownload = async (orderId) => {
    try {
      const response = await axios.get(
        `https://admin-backend-rl94.onrender.com/api/orders/download-invoice/${orderId}`,
        { responseType: 'blob' } // To handle the PDF file as blob
      );

      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(response.data);
      link.download = `invoice-${orderId}.pdf`; // Specify the file name
      link.click();
    } catch (err) {
      console.error('Error downloading invoice:', err);
      setError('Failed to download invoice');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="layout">
      <Sidebar /> {/* Sidebar on the left */}
      <div className="main-content">
        {/* Single Search Field */}
        <div className="search-field">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by Order ID, Product ID, or Order Type"
          />
        </div>

        {ordersData && ordersData.orders && ordersData.orders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>OrderID</th>
                <th>PrductID</th>
                <th>Quantity</th>
                <th>OrderStatus</th>
                <th>OrderType</th>
                <th>CreatedAt</th>
                <th>PaidAt</th>
                <th>DeliveryCharge</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.orders.map((order) =>
                order.products.map((product, index) => (
                  <tr key={`${order._id}-${product._id}`}>
                    {/* Show Order ID for every row */}
                    <td>{order._id}</td>
                    {/* Show Product ID for each product */}
                    <td>{product.product}</td>
                    {/* Show Quantity for each product */}
                    <td>{product.quantity}</td>

                    {/* Show Order Status dropdown for each row */}
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        {orderStatuses.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Show Order Type for every row */}
                    <td>{order.orderType}</td>

                    {/* Show Created At for every row */}
                    <td>{new Date(order.createdAt).toLocaleString()}</td>

                    {/* Show Paid At for every row */}
                    <td>{order.paidAt ? new Date(order.paidAt).toLocaleString() : 'N/A'}</td>

                    {/* Show Delivery Charge for every row */}
                    <td>{order.deliveryCharge ? order.deliveryCharge : 0}</td>

                    {/* Action column with Invoice button */}
                    <td>
                      <button 
                        onClick={() => handleInvoiceDownload(order._id)} 
                        className="invoice-button">
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  );
};

export default GetOrders;
