"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ChevronRight,
  FileText,
  LayoutDashboard,
} from "lucide-react";

export default function SidebarAdmin() {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] min-h-screen bg-white border-r border-gray-200 p-6">
      {/* LOGO */}
      <div className="mb-10">
        {/* LOGO IMAGE */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B6B2B] overflow-hidden flex items-center justify-center">
            <Image
              src="/image/logo bulet.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#0B6B2B]">
              Admin Panel
            </h1>

            <p className="text-gray-500 text-sm">
              Kelola laporan lingkungan
            </p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <div className="space-y-4">
        {/* DASHBOARD */}
        <Link href="/admin/dashboard">
          <button
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group
              
              ${
                pathname === "/admin/dashboard"
                  ? "bg-[#0B6B2B] text-white shadow-lg"
                  : "bg-[#F5F5F5] text-black hover:bg-green-100"
              }
            `}
          >
            <div className="flex items-center gap-4">
              <LayoutDashboard className="w-6 h-6" />

              <span className="font-semibold text-lg">
                Dashboard
              </span>
            </div>

            <ChevronRight
              className={`w-5 h-5 transition-transform duration-300
              ${
                pathname === "/admin/dashboard"
                  ? "translate-x-1"
                  : "group-hover:translate-x-1"
              }
              `}
            />
          </button>
        </Link>

        {/* LAPORAN */}
        <Link href="/admin/laporan">
          <button
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group
              
              ${
                pathname === "/admin/laporan"
                  ? "bg-[#0B6B2B] text-white shadow-lg"
                  : "bg-[#F5F5F5] text-black hover:bg-green-100"
              }
            `}
          >
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6" />

              <span className="font-semibold text-lg">
                Laporan
              </span>
            </div>

            <ChevronRight
              className={`w-5 h-5 transition-transform duration-300
              ${
                pathname === "/admin/laporan"
                  ? "translate-x-1"
                  : "group-hover:translate-x-1"
              }
              `}
            />
          </button>
        </Link>
      </div>
    </aside>
  );
}