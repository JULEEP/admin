import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccessibleNavigationAnnouncer from './components/AccessibleNavigationAnnouncer';

// Importing pages
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import EditProfile from './pages/EditProfile';
import Page404 from './pages/404';
import ProductsPage from './pages/ProductPage';
import CustomerPage from './pages/CustomerPage';
import StaffPage from './pages/StaffPage';
import OrderPage from './pages/OrderPage';
import ProductDetails from './pages/ProductDetails';
import UpdateProduct from './pages/UpdateProduct';
import UpdateStaff from './components/staff/UpdateStaff';
import CategoryPage from './pages/CategoryPage';
import CreateProduct from './components/product/CreateProduct';
import UpdateCategoryPage from './components/category/UpdateCategoryPage';
import AddCategoryPage from './components/category/AddCategoryPage';
import AddStaff from './components/staff/AddStaff';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import UserDetails from './pages/UserDetails';
import GetOrders from './pages/GetOrders';

const App = () => {
  return (
    <>
      <ToastContainer />
      <Router>
        <AccessibleNavigationAnnouncer />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/get-products" element={<ProductsPage />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/update-product/:id" element={<UpdateProduct />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/staffs" element={<StaffPage />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/add-product" element={<CreateProduct />} />
          <Route path="/add-staff" element={<AddStaff />} />
          <Route path="/update-staff/:id" element={<UpdateStaff />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/update-category/:id" element={<UpdateCategoryPage />} />
          <Route path="/add-category" element={<AddCategoryPage />} />
          <Route path="/setting" element={<EditProfile />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/" element={<SignUp />} />
          <Route path="/admin-login" element={<SignIn />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/user-details/:id" element={<UserDetails />} /> {/* Add route for user details */}
          <Route path="/orderTable" element={<GetOrders />} />

          {/* Catch-all for undefined routes */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
