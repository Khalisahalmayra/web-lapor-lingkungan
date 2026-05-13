"use client";

import Link from "next/link";
import { useState } from "react";

import {
  LayoutDashboard,
  FileText,
  ChevronRight,
} from "lucide-react";

export default function SidebarAdmin() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <aside className="w-[280px] min-h-screen bg-white border-r border-gray-200 p-6">
      
      {/* LOGO */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#0B6B2B]">
          Admin Panel
        </h1>

        <p className="text-gray-500 mt-1 text-sm">
          Kelola laporan lingkungan
        </p>
      </div>

      {/* MENU */}
      <div className="space-y-4">
        
        {/* DASHBOARD */}
        <Link href="/admin/dashboard">
          <button
            onClick={() => setActiveMenu("dashboard")}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group
              
              ${
                activeMenu === "dashboard"
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
                activeMenu === "dashboard"
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
            onClick={() => setActiveMenu("laporan")}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group
              
              ${
                activeMenu === "laporan"
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
                activeMenu === "laporan"
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