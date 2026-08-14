"use client";

import { useEffect, useState } from "react";
import ToolCard from "@/components/ToolCard";
import SkeletonCard from "@/components/SkeletonCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

export default function ToolsPage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState(null); // { lat, lng }
  const [sortByDistance, setSortByDistance] = useState(false);

  // Get user's location once
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLoc({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => console.log("Location access denied")
      );
    }
  }, []);

  useEffect(() => {
    fetch("/api/tools")
      .then((res) => res.json())
      .then((data) => {
        // If we have user location and sort is enabled, sort by distance
        if (userLoc && sortByDistance) {
          data.sort((a, b) => {
            const distA = haversine(userLoc.lat, userLoc.lng, a.latitude, a.longitude);
            const distB = haversine(userLoc.lat, userLoc.lng, b.latitude, b.longitude);
            return distA - distB;
          });
        }
        setTools(data);
        setLoading(false);
      });
  }, [userLoc, sortByDistance]);

  // Haversine formula to calculate distance in km
  function haversine(lat1, lon1, lat2, lon2) {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 999999; // huge if missing
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function distanceToTool(tool) {
    if (!userLoc || tool.latitude == null || tool.longitude == null) return undefined;
    return haversine(userLoc.lat, userLoc.lng, tool.latitude, tool.longitude);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Available Tools</h1>
          <p className="text-gray-600 mt-1">Rent equipment from verified pros</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Button to sort by distance */}
          {userLoc && (
            <button
              onClick={() => setSortByDistance(!sortByDistance)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                sortByDistance
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {sortByDistance ? "Sorted by distance ✓" : "Sort by distance"}
            </button>
          )}
          <Link
            href="/tools/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <FiPlus /> Add Tool
          </Link>
        </div>
      </div>

      {/* Optional: show a small message if user's location is active */}
      {userLoc && (
        <p className="text-sm text-gray-500 mb-4">
          Showing tools near your location.
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : tools.length === 0 ? (
        <EmptyState
          icon={<span className="text-4xl">🔧</span>}
          title="No tools listed yet"
          description="Be the first to share your equipment with the community."
          action={
            <Link href="/tools/new" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium">
              List Your First Tool
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} distance={distanceToTool(tool)} />
          ))}
        </div>
      )}
    </div>
  );
}
