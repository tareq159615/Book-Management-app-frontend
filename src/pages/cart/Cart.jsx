import React, { useEffect, useMemo, useState } from "react";
import { api, useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [busy, setBusy] = useState(false);
  const [cart, setCart] = useState([]);

  // ✅ load from localStorage
  const loadCart = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(Array.isArray(saved) ? saved : []);
    } catch {
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();

    // ✅ Listen update from BookCard
    const handler = () => loadCart();
    window.addEventListener("cart_updated", handler);
    return () => window.removeEventListener("cart_updated", handler);
  }, []);

  const updateCart = (next) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
    window.dispatchEvent(new Event("cart_updated"));
  };

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1),
        0
      ),
    [cart]
  );

  const changeQty = (id, qty) => {
    const next = cart.map((i) =>
      i._id === id ? { ...i, qty: Math.max(1, qty) } : i
    );
    updateCart(next);
  };

  const removeItem = (id) => {
    updateCart(cart.filter((i) => i._id !== id));
  };

  const clearCart = () => updateCart([]);

  const checkout = async () => {
    if (!cart.length) return;

    // ✅ login required only for checkout
    if (!user) {
      alert("Checkout করতে Login লাগবে");
      navigate("/login");
      return;
    }

    setBusy(true);
    try {
      const items = cart.map((i) => ({ bookId: i._id, qty: i.qty }));
      await api.post("/orders", { items });
      clearCart();
      alert("✅ Order placed!");
      navigate("/books");
    } catch (e) {
      alert(e?.response?.data?.message || "Checkout failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cart localStorage-এ save থাকে। Checkout করতে Login লাগবে।
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={clearCart}
            disabled={!cart.length}
            className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 font-semibold"
          >
            Clear
          </button>
          <button
            onClick={checkout}
            disabled={busy || !cart.length}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 font-semibold"
          >
            {busy ? "Processing..." : `Checkout ($${total.toFixed(2)})`}
          </button>
        </div>
      </div>

      {/* Empty */}
      {cart.length === 0 ? (
        <div className="mt-8 bg-white rounded-2xl shadow p-10 text-center text-gray-600">
          Cart is empty.{" "}
          <Link to="/books" className="text-amber-600 font-semibold">
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow p-4 flex gap-4 items-center border"
            >
              <img
                src={item.imageUrl || "/placeholder-book.jpg"}
                alt={item.title}
                className="w-20 h-20 rounded-xl object-cover bg-gray-100"
              />

              <div className="flex-1">
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-gray-500">{item.author}</div>
                <div className="text-amber-600 font-semibold mt-1">
                  ${Number(item.price || 0).toFixed(2)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded-lg bg-gray-100"
                  onClick={() => changeQty(item._id, (item.qty || 1) - 1)}
                >
                  -
                </button>
                <div className="w-10 text-center font-semibold">
                  {item.qty || 1}
                </div>
                <button
                  className="px-3 py-1 rounded-lg bg-gray-100"
                  onClick={() => changeQty(item._id, (item.qty || 1) + 1)}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item._id)}
                className="text-red-500 font-semibold hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
