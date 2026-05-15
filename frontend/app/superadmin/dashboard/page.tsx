"use client";

import Link from "next/link";

import {
  Eye,
  ShieldAlert,
  Users,
} from "lucide-react";

import SidebarSuperAdmin from "../../components/sidebarsuperadmin/page";
import TopbarSuperAdmin from "../../components/topbarsuperadmin/page";

export default function DashboardSuperAdminPage() {
  const laporan = [
    {
      id: "ENV-2026-001",
      kategori: "Pencemaran Sungai",
      lokasi: "Jakarta Timur",
      status: "Diproses",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      id: "ENV-2026-002",
      kategori: "Sampah Liar",
      lokasi: "Bandung",
      status: "Selesai",
      color: "bg-green-100 text-green-700",
    },
    {
      id: "ENV-2026-003",
      kategori: "Drainase Buruk",
      lokasi: "Bekasi",
      status: "Pending",
      color: "bg-red-100 text-red-700",
    },
  ];

  const adminAktif = [
    {
      nama: "Admin Rahmat",
      status: "Online",
      image: "https://i.pravatar.cc/100?img=11",
    },
    {
      nama: "Admin Sinta",
      status: "Monitoring Laporan",
      image: "https://i.pravatar.cc/100?img=12",
    },
    {
      nama: "Admin Fajar",
      status: "Review Aduan",
      image: "https://i.pravatar.cc/100?img=13",
    },
  ];

  return (
    <main className="flex min-h-screen bg-[#f4f5f7]">
      {/* SIDEBAR */}
      <div className="w-72 flex-shrink-0">
        <SidebarSuperAdmin />
      </div>

      {/* CONTENT */}
      <section className="flex-1 overflow-hidden">
        {/* TOPBAR */}
        <TopbarSuperAdmin />

        {/* CONTENT */}
        <div className="p-8">
          {/* TITLE */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-[#052e24]">
                Ringkasan Sistem
              </h1>

              <p className="text-gray-500 mt-3 text-lg">
                Monitoring keseluruhan sistem laporan lingkungan
                secara real-time.
              </p>
            </div>

            <div className="bg-[#e8edf7] px-5 py-3 rounded-xl text-gray-700 font-medium shadow-sm">
              Terakhir diperbarui: 14:30 WIB
            </div>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-2xl p-6 border border-[#0B6B2B] shadow-sm">
              <p className="text-gray-500 font-semibold">
                TOTAL LAPORAN
              </p>

              <div className="flex items-end gap-3 mt-5">
                <h2 className="text-5xl font-bold text-[#052e24]">
                  1,284
                </h2>

                <span className="text-green-600 font-semibold mb-2">
                  ↑ 12%
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#0B6B2B] shadow-sm">
              <p className="text-gray-500 font-semibold">
                LAPORAN PENDING
              </p>

              <div className="flex items-end gap-3 mt-5">
                <h2 className="text-5xl font-bold text-[#052e24]">
                  42
                </h2>

                <span className="text-red-500 font-semibold mb-2">
                  △ 5 Baru
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#0B6B2B] shadow-sm">
              <p className="text-gray-500 font-semibold">
                RESOLUSI SISTEM (%)
              </p>

              <div className="flex items-center justify-between mt-5">
                <h2 className="text-5xl font-bold text-[#052e24]">
                  98.2%
                </h2>

                <div className="w-10 h-3 rounded-full bg-green-600"></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-red-500 shadow-sm">
              <p className="text-gray-500 font-semibold">
                PERINGATAN AKTIF
              </p>

              <div className="flex items-center gap-4 mt-5">
                <h2 className="text-5xl font-bold text-red-600">
                  3
                </h2>

                <p className="text-gray-600 italic">
                  Membutuhkan
                  <br />
                  Tindakan
                </p>
              </div>
            </div>
          </div>

          {/* TABLE + INTEGRITAS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">
            {/* TABLE */}
            <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-[#052e24]">
                    Pantauan Laporan
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Super admin hanya dapat memantau status
                    laporan
                  </p>
                </div>

                <Eye className="text-[#0B6B2B]" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f8fafc]">
                    <tr className="text-left text-black">
                      <th className="px-6 py-5">
                        ID LAPORAN
                      </th>

                      <th className="px-6 py-5">
                        KATEGORI
                      </th>

                      <th className="px-6 py-5">
                        LOKASI
                      </th>

                      <th className="px-6 py-5">
                        STATUS
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {laporan.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-5 font-bold text-[#052e24]">
                          {item.id}
                        </td>

                        <td className="px-6 py-5 text-black">
                          {item.kategori}
                        </td>

                        <td className="px-6 py-5 text-black">
                          {item.lokasi}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${item.color}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* INTEGRITAS */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-[#052e24]">
                    Integritas Sistem
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Monitoring performa sistem
                  </p>
                </div>

                <ShieldAlert className="text-[#0B6B2B]" />
              </div>

              <div className="space-y-6 mt-8">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-black">
                      Server API
                    </span>

                    <span className="text-green-600 font-semibold">
                      Stabil
                    </span>
                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full mt-3">
                    <div className="w-[96%] h-3 bg-[#0B6B2B] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-black">
                      Database
                    </span>

                    <span className="text-green-600 font-semibold">
                      Aman
                    </span>
                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full mt-3">
                    <div className="w-[92%] h-3 bg-[#0B6B2B] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-black">
                      Keamanan Sistem
                    </span>

                    <span className="text-yellow-600 font-semibold">
                      Monitoring
                    </span>
                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full mt-3">
                    <div className="w-[84%] h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ADMIN */}
          <div className="bg-white rounded-3xl p-6 shadow-sm mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-[#052e24]">
                  Admin Aktif
                </h2>

                <p className="text-gray-500 mt-1">
                  Daftar admin yang sedang aktif saat ini
                </p>
              </div>

              <Link
                href="/superadmin/user"
                className="bg-[#0B6B2B] hover:bg-[#095424] text-white px-6 py-3 rounded-2xl font-semibold transition flex items-center gap-2 w-fit"
              >
                <Users size={20} />
                Kelola Admin
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {adminAktif.map((admin, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={admin.image}
                      alt="admin"
                      className="w-14 h-14 rounded-full object-cover"
                    />

                    <div>
                      <h3 className="font-bold text-black">
                        {admin.nama}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {admin.status}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>

                    <span className="font-medium text-black">
                      Online
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}