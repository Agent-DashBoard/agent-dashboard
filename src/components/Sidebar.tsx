// # NOTE PENANDA: Sidebar, sekarang pakai komponen Link dari Next.js
// Ini memungkinkan perpindahan halaman tanpa refresh (Client-Side Navigation).

"use client"; // <-- Tambahkan ini di baris paling atas

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MemoryStick,
  Puzzle,
  List,
  Users,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname(); // Hook untuk mendapatkan path URL saat ini

  // # NOTE PENANDA: Data navigasi kita buat dalam bentuk array of objects
  // Biar lebih rapi dan gampang di-manage.
  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/memory", label: "Memory", icon: MemoryStick },
    { href: "/skills", label: "Skills", icon: Puzzle },
    { href: "/activity", label: "Activity", icon: List },
    { href: "/agents", label: "Agents", icon: Users },
  ];

  return (
    <aside className="w-64 bg-zinc-900 p-6 flex flex-col">
      <div className="text-2xl font-bold mb-10">
        HERMES JARVIS OS
      </div>

      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 p-2 rounded-md ${
                isActive
                  ? "bg-zinc-800 text-white font-semibold"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}