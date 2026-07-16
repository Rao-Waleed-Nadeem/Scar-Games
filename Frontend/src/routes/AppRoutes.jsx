import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import OrderSummary from "../pages/OrderSummary";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Signup from "../pages/Signup";
import AdminDashboard from "../pages/Admin";
import InsertGame from "../pages/InsertGame";
import UpdateGame from "../pages/UpdateGame";
import DeleteGame from "../pages/DeleteGame";
import Payment from "../pages/Payment";
import UserOrderHistory from "../pages/UserOrderHistory";
import AllOrdersToAdmin from "../pages/AllOrdersToAdmin";
import VerifyOTP from "../pages/VerifyOTP";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />

    <Route path="/payment/:order_id" element={<Payment />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/user-order-history" element={<UserOrderHistory />} />
    <Route path="/admin/orders" element={<AllOrdersToAdmin />} />
    <Route path="/order-summary" element={<OrderSummary />} />
    <Route path="/login" element={<Login />} />
    <Route path="/logout" element={<Logout />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/verify-email" element={<VerifyOTP />} />
    <Route path="/add-game" element={<InsertGame />} />
    <Route path="/update-game" element={<UpdateGame />} />
    <Route path="/delete-game" element={<DeleteGame />} />
    <Route path="/admin-dashboard" element={<AdminDashboard />} />
  </Routes>
);

export default AppRoutes;
