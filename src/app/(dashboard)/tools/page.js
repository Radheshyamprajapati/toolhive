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

  useEffect(() => {
    fetch("/api/tools")
      .then((res) => res.json())
      .then((data) => {
        setTools(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Available Tools</h1>
          <p className="text-gray-600 mt-1">Rent equipment from verified pros</p>
        </div>
        <Link
          href="/tools/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <FiPlus /> Add Tool
        </Link>
      </div>

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
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
