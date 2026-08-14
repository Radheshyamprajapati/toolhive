"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiDollarSign, FiTrendingUp } from "react-icons/fi";

export default function OwnerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "TRADESMAN") router.push("/tools");
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === "TRADESMAN") {
      fetch("/api/owner/stats")
        .then(res => res.json())
        .then(data => setStats(data));
    }
  }, [session]);

  if (!stats || !session) return <div>Loading...</div>;

  const cards = [
    { label: "Today", value: stats.daily },
    { label: "This Week", value: stats.weekly },
    { label: "This Month", value: stats.monthly },
    { label: "All Time", value: stats.total },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <FiDollarSign />
              <span className="text-sm">{card.label}</span>
            </div>
            <p className="text-3xl font-bold">${card.value.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
