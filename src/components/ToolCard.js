import Link from "next/link";
import { FiMapPin, FiStar } from "react-icons/fi";

export default function ToolCard({ tool, distance }) {
  return (
    <Link
      href={`/tools/${tool.id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition group"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-t-xl bg-gray-200">
        {tool.image ? (
          <img
            src={tool.image}
            alt={tool.name}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">🔧</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg truncate">{tool.name}</h3>
          <span className="text-sm text-gray-500">{tool.condition}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{tool.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <FiMapPin /> {tool.location}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <FiStar className="text-yellow-500" />
            {tool.rating || "New"}
          </div>
        </div>

        {/* NEW: Show distance if provided */}
        {distance !== undefined && distance !== null && (
          <p className="text-xs text-gray-500 mt-1">
            📍 {distance.toFixed(1)} km away
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <p className="text-indigo-600 font-bold text-lg">${tool.pricePerDay}/day</p>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            tool.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {tool.isAvailable ? "Available" : "Rented"}
          </span>
        </div>
      </div>
    </Link>
  );
}
