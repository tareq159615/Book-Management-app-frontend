import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home.jsx";
import Shop from "./pages/shop/Shop.jsx";
import BookDetails from "./pages/singlebooks/BookDetails.jsx";

import AddBook from "./pages/addBook/AddBook.jsx";
import EditBook from "./pages/editBook/EditBook.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

import Cart from "./pages/cart/Cart.jsx";
import Ebooks from "./pages/ebooks/Ebooks.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminMembership from "./pages/admin/AdminMembership.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { BookProvider } from "./context/BookContext.jsx";

// Optional: My Orders page থাকলে এখানে import করবে
// import MyOrders from "./pages/orders/MyOrders.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <BookProvider>
        <Routes>
          <Route element={<App />}>
            {/* ✅ Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Shop />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/ebooks" element={<Ebooks />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            {/* ✅ Protected (Login required) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              {/* <Route path="/orders" element={<MyOrders />} /> */}
            </Route>

            {/* ✅ Admin only */}
            <Route element={<AdminRoute />}>
              <Route path="/books/add" element={<AddBook />} />
              <Route path="/books/edit/:id" element={<EditBook />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Membership শুধু Admin দেখবে */}
              <Route path="/membership" element={<AdminMembership />} />
            </Route>
          </Route>
        </Routes>
      </BookProvider>
    </AuthProvider>
  </BrowserRouter>
);
