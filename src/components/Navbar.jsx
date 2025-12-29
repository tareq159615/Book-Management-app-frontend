import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  const links = [
    { to: "/", label: "Home", show: true },
    { to: "/books", label: "Shop", show: true }, // ✅ সবাই দেখবে
    { to: "/ebooks", label: "Ebooks", show: true }, // ✅ সবাই দেখবে
    { to: "/membership", label: "Membership", show: isAdmin }, // ✅ শুধু admin
    { to: "/admin", label: "Admin", show: isAdmin }, // ✅ শুধু admin
    { to: "/books/add", label: "Add Book", show: isAdmin }, // ✅ শুধু admin
  ].filter((x) => x.show);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-amber-500" : "text-gray-700 hover:text-amber-500"
    }`;

  return (
    <nav className="bg-white fixed w-full top-0 z-50 py-4 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="text-xl font-bold uppercase tracking-wider">
            Book<span className="text-amber-500">Club.</span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass}>
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
              title="Cart"
            >
              <FaShoppingCart className="h-5 w-5" />
            </Link>

            {!user ? (
              <Link
                to="/login"
                className="text-sm font-semibold bg-amber-500 px-4 py-2 rounded-xl hover:bg-amber-400"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={logout}
                className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800"
              >
                Logout
              </button>
            )}

            <button
              className="md:hidden text-gray-700 hover:text-amber-500 transition-colors"
              onClick={() => setIsMenuOpen((p) => !p)}
              aria-label="menu"
            >
              {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <div className="flex flex-col space-y-3">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={linkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}

              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-semibold bg-amber-500 px-4 py-2 rounded-xl hover:bg-amber-400 w-fit"
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 w-fit"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
