"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ChevronRight,
  FileText,
  LayoutDashboard,
  Plus,
  Users,
} from "lucide-react";

export default function SidebarSuperAdmin() {
  const pathname = usePathname();

  const menus = [
    {
      name: "Dashboard",
      href: "/superadmin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "User",
      href: "/superadmin/user",
      icon: Users,
    },
    {
      name: "Laporan",
      href: "/superadmin/laporan",
      icon: FileText,
    },
  ];

  return (
    <aside className="w-[290px] min-h-screen bg-white border-r border-gray-200 px-6 py-8 flex flex-col justify-between">
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-4 mb-12">
          <img
            src="/image/logo bulet.png"
            alt="logo"
            className="w-14 h-14 object-cover"
          />

          <div>
            <h1 className="text-3xl font-bold text-[#0B6B2B] leading-tight">
              Super Admin
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Sistem Lapor Lingkungan
            </p>
          </div>
        </div>

        {/* MENU */}
        <div className="space-y-4">
          {menus.map((menu, index) => {
            const isActive = pathname === menu.href;

            return (
              <Link key={index} href={menu.href}>
                <button
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group
                  
                  ${
                    isActive
                      ? "bg-[#0B6B2B] text-white shadow-lg"
                      : "bg-[#F5F5F5] text-black hover:bg-green-100"
                  }
                `}
                >
                  <div className="flex items-center gap-4">
                    <menu.icon className="w-6 h-6" />

                    <span className="font-semibold text-lg">
                      {menu.name}
                    </span>
                  </div>

                  <ChevronRight
                    className={`w-5 h-5 transition-transform duration-300
                    ${
                      isActive
                        ? "translate-x-1"
                        : "group-hover:translate-x-1"
                    }
                  `}
                  />
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* BOTTOM BUTTON */}
      <button className="w-full bg-[#0B6B2B] hover:bg-[#095424] text-white rounded-2xl py-4 font-semibold transition flex items-center justify-center gap-3 shadow-lg">
        <Plus size={20} />
        Audit Report Baru
      </button>
    </aside>
  );
}