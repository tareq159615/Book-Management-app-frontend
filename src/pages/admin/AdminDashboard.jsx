import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../context/AuthContext";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [sRes, oRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/orders"),
      ]);
      setStats(sRes.data);
      setOrders(oRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const latestOrders = useMemo(() => orders.slice(0, 8), [orders]);

  const toggleDelivered = async (id, delivered) => {
    await api.patch(`/admin/orders/${id}/delivered`, { delivered: !delivered });
    await load();
  };

  if (loading) return <div className="p-10 text-center">Loading admin dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Sales, Orders, Members overview</p>
        </div>
        <button
          onClick={load}
          className="px-4 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800"
        >
          Refresh
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        <StatCard title="Total Sale" value={`$${Number(stats?.totalSales || 0).toFixed(2)}`} />
        <StatCard title="Total Orders" value={stats?.totalOrders ?? 0} />
        <StatCard title="Books Sold" value={stats?.totalBooksSold ?? 0} />
        <StatCard title="Total Members" value={stats?.totalMembers ?? 0} />
        <StatCard title="Active Memberships" value={stats?.activeMemberships ?? 0} />
        <StatCard
          title="Delivered / Pending"
          value={`${stats?.deliveredCount ?? 0} / ${stats?.pendingCount ?? 0}`}
        />
      </div>

      {/* Latest Orders */}
      <div className="mt-10 bg-white rounded-2xl shadow border p-6">
        <h2 className="text-xl font-bold">Latest Orders</h2>
        <p className="text-sm text-gray-500 mt-1">
          এখানে Delivered চেক/আনচেক করতে পারবে
        </p>

        {latestOrders.length === 0 ? (
          <div className="mt-6 text-gray-600">No orders yet.</div>
        ) : (
          <div className="mt-6 space-y-4">
            {latestOrders.map((o) => {
              const total = (o.items || []).reduce(
                (sum, it) => sum + Number(it.price || 0) * Number(it.qty || 1),
                0
              );

              return (
                <div
                  key={o._id}
                  className="border rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <div className="font-semibold">{o.userName || "Member"}</div>
                    <div className="text-xs text-gray-500">{o.userEmail}</div>
                    <div className="text-sm mt-2">
                      Items: <span className="font-semibold">{(o.items || []).length}</span> •
                      Total: <span className="font-semibold text-amber-600">${total.toFixed(2)}</span>
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        o.delivered ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.delivered ? "Delivered" : "Pending"}
                    </span>

                    <button
                      onClick={() => toggleDelivered(o._id, o.delivered)}
                      className="px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800"
                    >
                      {o.delivered ? "Mark Pending" : "Mark Delivered"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow border p-6">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}
