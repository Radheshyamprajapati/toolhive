"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ToolCard from "@/components/ToolCard";

export default function OwnerProfilePage({ params }) {
  const [owner, setOwner] = useState(null);
  const [tools, setTools] = useState([]);

  useEffect(() => {
    fetch(`/api/owner/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setOwner(data.owner);
        setTools(data.tools);
      });
  }, [params.id]);

  if (!owner) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-3xl">
            {owner.name?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{owner.name}</h1>
            <p className="text-gray-600">{owner.location}</p>
            <p className="text-sm text-gray-500">Member since {new Date(owner.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Tools by {owner.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
      </div>
    </div>
  );
}
