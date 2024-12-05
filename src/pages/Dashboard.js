import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FiShoppingCart, FiClock, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [ordersToday, setOrdersToday] = useState(0);
  const [ordersThisMonth, setOrdersThisMonth] = useState(0);
  const [paymentPendingOrders, setPaymentPendingOrders] = useState(0);
  const [paymentConfirmedOrders, setPaymentConfirmedOrders] = useState(0);
  const [printReadyOrders, setPrintReadyOrders] = useState(0);


  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Conversions This Year',
        data: [12, 19, 3, 5, 2, 3, 10],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Fetch data from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://admin-backend-rl94.onrender.com/api/orders/get-orders');
        const data = await response.json();
        setOrders(data.orders);
        setTotalOrders(data.totalOrders);
        setOrdersToday(data.totalOrdersToday);
        setOrdersThisMonth(data.totalOrdersThisMonth);
        setPaymentPendingOrders(data.paymentPendingOrdersCount);
        setPaymentConfirmedOrders(data.paymentConfirmedOrdersCount);
        setPrintReadyOrders(data.printReadyOrdersCount);

      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row mb-20">
      <Sidebar className="mt-4"/>
      <div className="flex-1 p-4 mt-16 bg-gray-100">
        <h4 className="text-lg md:text-2xl font-semibold">Dashboard Overview</h4>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-500 text-white p-4 rounded-md shadow-lg shadow-red-500 flex flex-col items-center">
            <FiShoppingCart className="text-3xl md:text-4xl mb-2" />
            <h2 className="text-sm md:text-md font-semibold">Today’s Orders</h2>
            <p className="text-lg md:text-2xl font-semibold">{ordersToday}</p> {/* Assuming ₹ 500 per order */}
          </div>
          <div className="bg-green-500 text-white p-4 rounded-md shadow flex flex-col items-center">
            <FiClock className="text-3xl md:text-4xl mb-2" />
            <h2 className="text-sm md:text-md font-semibold">This Month</h2>
            <p className="text-lg md:text-2xl font-semibold">{ordersThisMonth}</p> {/* Assuming ₹ 500 per order */}
          </div>
          <div className="bg-orange-500 text-white p-4 rounded-md shadow flex flex-col items-center">
            <FiTruck className="text-3xl md:text-4xl mb-2" />
            <h2 className="text-sm md:text-md font-semibold">Total Orders</h2>
            <p className="text-lg md:text-2xl font-semibold">{totalOrders}</p> {/* Assuming ₹ 500 per order */}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[ 
            { title: 'Total Orders', color: 'blue', count: totalOrders, icon: <FiShoppingCart /> },
            { title: 'Payment Pending', color: 'yellow', count: paymentPendingOrders, icon: <FiClock /> },
            { title: 'Payment Confirmed', color: 'orange', count: paymentConfirmedOrders, icon: <FiTruck /> },
            { title: 'Print Ready', color: 'green', count: printReadyOrders, icon: <FiCheckCircle /> },
          ].map(({ title, color, count, icon }, index) => (
            <div
              key={index}
              className="bg-white border border-gray-300 rounded-lg p-4 shadow flex items-center"
            >
              <div
                className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-${color}-200 rounded-full flex items-center justify-center`}
              >
                <div className={`text-${color}-500 text-lg md:text-xl`}>{icon}</div>
              </div>
              <div className="ml-3 md:ml-4">
                <h2 className="text-xs md:text-sm">{title}</h2>
                <p className="text-md md:text-lg font-semibold">{count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow">
            <h4 className="text-md md:text-xl font-semibold p-4">Conversions This Year</h4>
            <div className="flex justify-center items-center p-4">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-6 bg-white border rounded-lg shadow overflow-x-auto">
          <h5 className="text-md md:text-xl font-semibold p-4">Recent Orders</h5>
          <table className="table-auto w-full text-gray-800">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-xs md:text-sm border">Order ID</th>
                <th className="p-2 text-xs md:text-sm border">Date</th>
                <th className="p-2 text-xs md:text-sm border">Total</th>
                <th className="p-2 text-xs md:text-sm border">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id}>
                  <td className="p-2 text-xs md:text-sm border">{order._id}</td>
                  <td className="p-2 text-xs md:text-sm border">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 text-xs md:text-sm border">₹ {order.paymentIntent.amount}</td>
                  <td className="p-2 text-xs md:text-sm border">
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-semibold 
                      ${order.status === 'Delivered' ? 'bg-green-200 text-green-800' : ''}
                      ${order.status === 'Processing' ? 'bg-orange-200 text-orange-800' : ''}
                      ${order.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : ''}
                      ${order.status === 'Cancelled' ? 'bg-red-200 text-red-800' : ''}`}
                    >
                      {order.orderStatus}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
