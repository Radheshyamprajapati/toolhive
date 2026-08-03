"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { FiTool, FiList, FiUser, FiHome, FiLogOut, FiMenu, FiX } from "react-icons/fi";

const links = [
  { href: "/tools", label: "Tools", icon: FiTool },
  { href: "/rentals", label: "Rentals", icon: FiList },
  { href: "/profile", label: "Profile", icon: FiUser },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <div className="flex items-center gap-2 px-6 h-16 border-b border-gray-200">
        <FiHome className="w-6 h-6 text-indigo-600" />
        <span className="font-semibold text-xl">ToolHive</span>
      </div>
      <div className="px-4 py-4 border-b border-gray-200">
        <p className="text-sm text-gray-500">Signed in as</p>
        <p className="font-medium truncate">{session?.user?.name}</p>
      </div>
      <nav className="p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              pathname.startsWith(href)
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 w-full"
        >
          <FiLogOut className="w-5 h-5" />
          Logout
        </button>
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 flex-col z-30">
        {navContent}
      </aside>

      {/* Mobile header & drawer */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4 h-16">
        <Link href="/tools" className="flex items-center gap-2">
          <FiHome className="w-6 h-6 text-indigo-600" />
          <span className="font-semibold text-xl">ToolHive</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </header>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div className="bg-black opacity-40 absolute inset-0" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
