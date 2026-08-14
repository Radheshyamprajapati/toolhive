"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiCalendar, FiTool } from "react-icons/fi";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function RentalsPage() {
  const { data: session } = useSession();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  async function loadRentals() {
    const res = await fetch("/api/rentals");
    if (res.ok) {
      const data = await res.json();
      setRentals(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadRentals();
  }, []);

  async function updateStatus(id, status) {
    const res = await fetch(`/api/rentals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setRentals((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    }
  }

  async function deleteRental(id) {
    if (!confirm("Delete this rental?")) return;
    await fetch(`/api/rentals/${id}`, { method: "DELETE" });
    setRentals((prev) => prev.filter((r) => r.id !== id));
  }

  async function handlePayment(rentalId) {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rentalId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  if (loading) return <LoadingSpinner />;

  const filtered = rentals.filter((r) =>
    filter === "all" ? true : r.status.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Rentals</h1>
      <p className="text-gray-600 mb-6">Manage your tool bookings</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "PENDING", "APPROVED", "COMPLETED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === s ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            } transition`}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FiCalendar className="w-12 h-12 text-gray-400" />}
          title="No rentals found"
          description="You haven't rented or listed any tools yet."
          action={
            <Link href="/tools" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium">
              Browse Tools
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tool</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Renter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((rental) => {
                const isRenter = rental.renterId === session?.user?.id;
                const isOwner = rental.tool.owner?.id === session?.user?.id;

                return (
                  <tr key={rental.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center text-xl">
                          <FiTool />
                        </div>
                        <span className="font-medium">{rental.tool.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{rental.renter.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(rental.startDate).toLocaleDateString()} – {new Date(rental.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">${rental.totalCost}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rental.status === "APPROVED" ? "bg-green-100 text-green-700" :
                        rental.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                        rental.status === "COMPLETED" ? "bg-blue-100 text-blue-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {rental.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {/* Owner actions */}
                        {isOwner && rental.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => updateStatus(rental.id, "APPROVED")}
                              className="text-green-600 font-medium hover:text-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(rental.id, "REJECTED")}
                              className="text-red-600 font-medium hover:text-red-700"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {isOwner && rental.status === "APPROVED" && (
                          <button
                            onClick={() => updateStatus(rental.id, "COMPLETED")}
                            className="text-blue-600 font-medium hover:text-blue-700"
                          >
                            Complete
                          </button>
                        )}
                        {isOwner && (
                          <button
                            onClick={() => deleteRental(rental.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            Delete
                          </button>
                        )}

                        {/* Renter payment action */}
                        {isRenter && rental.status === "PENDING" && (
                          <button
                            onClick={() => handlePayment(rental.id)}
                            className="text-indigo-600 font-medium hover:text-indigo-700"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
