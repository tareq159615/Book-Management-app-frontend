import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../context/AuthContext";

export default function AdminMembership() {
  const [users, setUsers] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: u }, { data: s }] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/settings"),
      ]);
      setUsers(u?.users || []);
      setYoutubeUrl(s?.youtubeUrl || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const membershipUsers = useMemo(() => {
    return (users || []).filter((x) => x?.membership?.status === "active");
  }, [users]);

  const saveYoutube = async () => {
    await api.put("/admin/settings/youtube", { youtubeUrl });
    alert("✅ YouTube URL saved!");
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow p-8 border">
        <h1 className="text-3xl font-bold">Membership (Admin Only)</h1>
        <p className="text-sm text-gray-500 mt-1">
          Active memberships: <span className="font-semibold">{membershipUsers.length}</span>
        </p>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {/* YouTube Option */}
          <div className="border rounded-2xl p-6">
            <h2 className="text-xl font-bold">YouTube Option</h2>
            <p className="text-sm text-gray-500 mt-1">
              Admin এখানে YouTube link সেট করবে
            </p>

            <input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full border rounded-xl px-4 py-3 mt-4"
            />

            <button
              onClick={saveYoutube}
              className="mt-4 bg-amber-500 hover:bg-amber-400 px-5 py-3 rounded-xl font-semibold"
            >
              Save
            </button>
          </div>

          {/* Members List */}
          <div className="border rounded-2xl p-6">
            <h2 className="text-xl font-bold">Active Members</h2>
            <div className="mt-4 space-y-3 max-h-[340px] overflow-auto pr-1">
              {membershipUsers.length === 0 ? (
                <div className="text-gray-600">No active members.</div>
              ) : (
                membershipUsers.map((m) => (
                  <div key={m._id} className="flex items-center justify-between border rounded-xl p-3">
                    <div>
                      <div className="font-semibold text-sm">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.email}</div>
                    </div>
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      active
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
