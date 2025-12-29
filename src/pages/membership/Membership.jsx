import React, { useState } from "react";
import { api } from "../../context/AuthContext";
import { useAuth } from "../../context/AuthContext";

const plans = [
  { key: "basic", title: "Basic", price: "$4.99", period: "30 days", perks: ["Member badge", "5% discount", "Early ebook drops"] },
  { key: "pro", title: "Pro", price: "$9.99", period: "90 days", perks: ["10% discount", "Priority support", "Exclusive community"] },
  { key: "elite", title: "Elite", price: "$29.99", period: "1 year", perks: ["20% discount", "VIP events", "Free monthly ebook"] },
];

export default function Membership() {
  const { user, setUser } = useAuth();
  const [busy, setBusy] = useState(false);

  const subscribe = async (plan) => {
    if (!user) return alert("Login required");
    setBusy(true);
    try {
      const { data } = await api.post("/membership/subscribe", { plan });
      setUser((u) => ({
        ...u,
        membership: { plan, status: "active", expiresAt: data.expiresAt },
      }));
      alert("✅ Membership activated!");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-3xl p-10 shadow-xl">
        <h1 className="text-4xl font-bold">Membership</h1>
        <p className="text-gray-300 mt-3 max-w-2xl">
          Member হলে discount, ebooks early access, community perks—সব একসাথে।
        </p>

        {user && (
          <div className="mt-6 inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl">
            <span className="text-sm text-gray-200">Your plan:</span>
            <span className="font-semibold">{user?.membership?.plan || "free"}</span>
            <span className="text-sm text-gray-200">({user?.membership?.status || "inactive"})</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {plans.map(p => (
          <div key={p.key} className="bg-white rounded-2xl shadow p-6 border hover:border-amber-300 transition">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{p.title}</h3>
              <div className="text-amber-600 font-bold">{p.price}</div>
            </div>
            <div className="text-sm text-gray-500 mt-1">{p.period}</div>

            <ul className="mt-4 space-y-2 text-gray-700 text-sm">
              {p.perks.map(x => <li key={x}>✅ {x}</li>)}
            </ul>

            <button
              disabled={busy}
              onClick={() => subscribe(p.key)}
              className="w-full mt-6 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-xl py-3 font-semibold"
            >
              {busy ? "Processing..." : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
