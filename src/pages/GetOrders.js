import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import Sidebar component
import { jsPDF } from "jspdf"; // Import jsPDF
import './GetOrders.css'; // Import the CSS file

const GetOrders = () => {
  const [ordersData, setOrdersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination

  const itemsPerPage = 5; // Number of orders to show per page

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
          page: currentPage, // Page parameter for pagination
          limit: itemsPerPage // Limit the number of orders per page
        };

        const response = await axios.get(
          'https://admin-backend-rl94.onrender.com/api/orders/get-order', // Updated API endpoint
          { params }
        );

        console.log('API Response:', response.data); // Log the entire response for debugging
        setOrdersData(response.data);
        setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage)); // Calculate total pages
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Error fetching orders data');
      }
    };

    fetchOrders();
  }, [searchQuery, currentPage]); // Fetch orders whenever the search query or currentPage changes

  // Handle change in the search input field
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query
    setCurrentPage(1); // Reset to the first page on search change
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
            order.orderId === orderId ? { ...order, orderStatus: newStatus } : order
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

  const handleTemplateDownload = async (templateImageUrl) => {
    try {
      // Check if URL is valid
      if (!templateImageUrl) {
        throw new Error("Invalid image URL");
      }
  
      // Fetch the image as a blob
      const response = await axios.get(templateImageUrl, { responseType: 'blob' });
  
      // Check if the response is valid and contains image data
      if (response.status !== 200) {
        throw new Error("Failed to fetch image");
      }
  
      const imgBlob = response.data;
  
      // Convert the blob to a base64 string using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
  
        // Create a PDF document using jsPDF
        const doc = new jsPDF();
  
        // Add the image to the PDF (the FileReader result is base64)
        doc.addImage(base64Image, 'PNG', 10, 10, 180, 180); // Adjust position and size as needed
  
        // Save the PDF as a file
        doc.save('template.pdf');
      };
  
      // Read the image blob as a data URL (base64)
      reader.readAsDataURL(imgBlob);
    } catch (err) {
      console.error('Error downloading template image:', err);
      setError(`Failed to download template image: ${err.message}`);
    }
  };

  // Pagination controls
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // Update the current page
  };

  // Get only the current page of orders from the ordersData
  const getOrdersForCurrentPage = () => {
    if (ordersData && ordersData.orders) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return ordersData.orders.slice(startIndex, endIndex);
    }
    return [];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const ordersForCurrentPage = getOrdersForCurrentPage();

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
            placeholder="Search by Order ID, Product Title, or Order Type"
          />
        </div>

        {ordersForCurrentPage.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>OrderID</th>
                  <th>ProductTitle</th>
                  <th>Images</th>
                  <th>Quantity</th>
                  <th>OrderStatus</th>
                  <th>PaidAt</th>
                  <th>DeliveryCharge</th>
                  <th>Template Image</th> {/* For template image column */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ordersForCurrentPage.map((order) =>
                  order.order.map((product, index) => (
                    <tr key={`${order.orderId}-${product.product._id}`}>
                      <td>{order.orderId}</td>
                      {/* Show Product Title */}
                      <td>{product.product.title}</td>

                      {/* Show Product Images */}
                      <td>
                        {product.product.images?.map((image, idx) => (
                          <img key={idx} src={image} alt={`Product ${idx}`} style={{ width: '50px', margin: '0 5px' }} />
                        ))}
                      </td>

                      <td>{product.quantity}</td>

                      {/* Show Order Status dropdown for each row */}
                      <td>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        >
                          {orderStatuses.map(status => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{order.paidAt ? new Date(order.paidAt).toLocaleString() : 'N/A'}</td>
                      <td>{order.deliveryCharge ? order.deliveryCharge : 0}</td>

                      {/* Show Template Image */}
                      <td>
                        {product.product.templateImageUrl && (
                          <button onClick={() => handleTemplateDownload(product.product.templateImageUrl)} className="template-download-button">
                            Download Template as PDF
                          </button>
                        )}
                      </td>

                      {/* Action column with Invoice button */}
                      <td>
                        <button 
                          onClick={() => handleInvoiceDownload(order.orderId)} 
                          className="invoice-button">
                          Download Invoice
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}>
                Previous
              </button>
              <span>Page {currentPage}</span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  );
};

export default GetOrders;
