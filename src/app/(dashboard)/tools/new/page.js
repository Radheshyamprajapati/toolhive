"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewToolPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    pricePerDay: "",
    location: "",
    condition: "Good",
    image: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        pricePerDay: parseFloat(form.pricePerDay),
      }),
    });

    if (res.ok) {
      router.push("/tools");
      router.refresh();
    } else {
      alert("Failed to create tool");
      setSaving(false);
    }
  }

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Add a New Tool</h1>
        <Link href="/tools" className="text-indigo-600 hover:text-indigo-500 font-medium">
          ← Back to Tools
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-3xl">
        <div className="space-y-4">
          <div>
            <label className={labelClasses}>Tool Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClasses}
              rows="3"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClasses}
                placeholder="e.g. Power Tools"
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Price per Day ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.pricePerDay}
                onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
                className={inputClasses}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputClasses}
                placeholder="City, State"
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Condition</label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className={inputClasses}
              >
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>New</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClasses}>Image URL (optional)</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className={inputClasses}
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Create Tool"}
            </button>
            <Link
              href="/tools"
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
