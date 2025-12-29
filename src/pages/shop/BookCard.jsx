import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function BookCard({ book, onDelete }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const price = Number(book?.price || 0);

  const addToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const exists = cart.find((i) => i._id === book._id);

      const next = exists
        ? cart.map((i) =>
            i._id === book._id ? { ...i, qty: (i.qty || 1) + 1 } : i
          )
        : [
            ...cart,
            {
              _id: book._id,
              title: book.title,
              author: book.author,
              price: price,
              imageUrl: book.imageUrl || "",
              qty: 1,
            },
          ];

      localStorage.setItem("cart", JSON.stringify(next));

      // ✅ simple feedback
      alert("✅ Added to cart");
      // optional: event notify Navbar badge etc
      window.dispatchEvent(new Event("cart_updated"));
    } catch (e) {
      alert("❌ Cart error");
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden border">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-amber-50 overflow-hidden">
        <img
          src={book.imageUrl || "/placeholder-book.jpg"}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            to={`/books/${book._id}`}
            className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold px-4 py-2 rounded-xl"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-base font-bold text-gray-900 line-clamp-1">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-1">{book.author}</p>

        <div className="flex items-center justify-between pt-2">
          <p className="text-amber-600 font-bold">${price.toFixed(2)} USD</p>

          {/* ✅ Member/Admin সবাই add to cart পাবে */}
          <button
            onClick={addToCart}
            className="text-sm font-semibold bg-gray-900 text-white px-3 py-2 rounded-xl hover:bg-gray-800"
          >
            Add to cart
          </button>
        </div>

        {/* ✅ Admin Only actions */}
        {isAdmin && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to={`/books/edit/${book._id}`}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Edit
            </Link>

            <button
              onClick={() => onDelete?.(book._id)}
              className="text-sm font-semibold text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
