"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    location: "",
  });

  if (status === "loading") return <LoadingSpinner />;

  async function handleSave() {
    // This would normally call an API to update user
    alert("Profile update is not connected to backend in this demo. Please check code.");
    setEditing(false);
  }

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div className="flex gap-4">
              <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium">
                Save
              </button>
              <button onClick={() => setEditing(false)} className="bg-gray-100 px-6 py-2 rounded-lg font-medium">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-3xl">
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{session?.user?.name}</h2>
                  <p className="text-gray-600">{session?.user?.role}</p>
                </div>
              </div>
              <button onClick={() => setEditing(true)} className="text-indigo-600 font-medium">
                Edit Profile
              </button>
            </div>

            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-2"><FiMail /> {session?.user?.email}</p>
              <p className="flex items-center gap-2"><FiPhone /> {form.phone || "Not set"}</p>
              <p className="flex items-center gap-2"><FiMapPin /> {form.location || "Not set"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
