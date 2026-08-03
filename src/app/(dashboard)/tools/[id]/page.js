"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEdit, FiTrash, FiMapPin, FiStar, FiArrowLeft } from "react-icons/fi";

export default function ToolDetailPage({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    pricePerDay: "",
    location: "",
    condition: "",
    image: "",
    isAvailable: true,
  });

  useEffect(() => {
    fetch(`/api/tools/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setTool(data);
        setForm({
          name: data.name,
          description: data.description,
          category: data.category,
          pricePerDay: data.pricePerDay,
          location: data.location,
          condition: data.condition,
          image: data.image || "",
          isAvailable: data.isAvailable,
        });
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!tool) return <div>Tool not found</div>;

  const isOwner = session?.user?.id === tool.ownerId || session?.user?.role === "ADMIN";

  async function handleUpdate(e) {
    e.preventDefault();
    const res = await fetch(`/api/tools/${tool.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, pricePerDay: parseFloat(form.pricePerDay) }),
    });
    if (res.ok) {
      setEditing(false);
      setTool((prev) => ({ ...prev, ...form, pricePerDay: parseFloat(form.pricePerDay) }));
    }
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this tool?")) {
      const res = await fetch(`/api/tools/${tool.id}`, { method: "DELETE" });
      if (res.ok) router.push("/tools");
    }
  }

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none";

  if (editing) {
    return (
      <div>
        <button onClick={() => setEditing(false)} className="text-indigo-600 hover:text-indigo-500 font-medium">
          ← Back to details
        </button>
        <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-sm p-6 mt-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Edit Tool</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClasses}
              required
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClasses}
              rows="3"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClasses}
                required
              />
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.pricePerDay}
                onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
                className={inputClasses}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputClasses}
                required
              />
              <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className={inputClasses}>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>New</option>
              </select>
            </div>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className={inputClasses}
              placeholder="Image URL"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                className="h-4 w-4"
              />
              <span>Available for rent</span>
            </label>
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Link href="/tools" className="text-indigo-600 hover:text-indigo-500 font-medium inline-flex items-center gap-2">
        <FiArrowLeft /> Back to Tools
      </Link>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden">
          {tool.image ? (
            <img src={tool.image} alt={tool.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🔧</div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{tool.name}</h1>
          <div className="mt-2 flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-1"><FiMapPin /> {tool.location}</span>
            <span className="flex items-center gap-1"><FiStar /> {tool.rating || "New"}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              tool.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {tool.isAvailable ? "Available" : "Rented"}
            </span>
          </div>
          <p className="mt-4 text-gray-700">{tool.description}</p>
          <div className="mt-6 flex items-center gap-6">
            <p className="text-4xl font-bold text-indigo-600">${tool.pricePerDay}<span className="text-lg text-gray-500">/day</span></p>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{tool.condition}</span>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Owner: <strong>{tool.owner?.name}</strong></p>
          </div>

          {isOwner && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setEditing(true)}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <FiEdit /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-700 transition flex items-center gap-2"
              >
                <FiTrash /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
