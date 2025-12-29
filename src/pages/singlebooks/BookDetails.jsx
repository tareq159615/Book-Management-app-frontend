import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useBooks } from "../../context/BookContext";

export default function BookDetails() {
  const { id } = useParams();
  const { getBookById, loading, error } = useBooks();

  const [book, setBook] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await getBookById(id);
      if (mounted) setBook(data);
    })();
    return () => {
      mounted = false;
    };
  }, [id, getBookById]);

  const price = useMemo(() => Number(book?.price || 0), [book]);

  const addToCart = () => {
    if (!book?._id) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.find((i) => i._id === book._id);

    const next = exists
      ? cart.map((i) => (i._id === book._id ? { ...i, qty: (i.qty || 1) + 1 } : i))
      : [...cart, { _id: book._id, title: book.title, author: book.author, price, imageUrl: book.imageUrl || "", qty: 1 }];

    localStorage.setItem("cart", JSON.stringify(next));
    alert("✅ Added to cart");
  };

  if (loading && !book) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {!book ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-600">
          Book not found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow p-6 md:p-10 border">
          <div className="bg-amber-50 rounded-2xl overflow-hidden">
            <img
              src={book.imageUrl || "/placeholder-book.jpg"}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
              {book.genre && (
                <span className="text-xs font-semibold bg-gray-100 px-3 py-1 rounded-full">
                  {book.genre}
                </span>
              )}
            </div>

            <p className="text-gray-500 mt-2">By {book.author}</p>

            <div className="mt-6 text-2xl font-bold text-amber-600">
              ${price.toFixed(2)}
            </div>

            {book.description && (
              <p className="text-gray-700 mt-6 leading-relaxed">{book.description}</p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={addToCart}
                className="bg-gray-900 text-white px-5 py-3 rounded-xl font-semibold hover:bg-gray-800"
              >
                Add to cart
              </button>
              <Link
                to="/books"
                className="bg-amber-500 text-gray-900 px-5 py-3 rounded-xl font-semibold hover:bg-amber-400 text-center"
              >
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
