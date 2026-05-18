"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Eye,
  ShieldAlert,
  Users,
} from "lucide-react";

import SidebarSuperAdmin from "../../components/sidebarsuperadmin/page";
import TopbarSuperAdmin from "../../components/topbarsuperadmin/page";

interface Laporan {
  id: number;
  kategori_id: number;
  category_name: string;
  lokasi_kejadian: string;
  status: string;
}

interface User {
  id: number;
  username: string;
  role: string;
  profile: string;
}

export default function DashboardSuperAdminPage() {
  // =====================================
  // STATE
  // =====================================
  const [laporan, setLaporan] = useState<
    Laporan[]
  >([]);

  const [adminAktif, setAdminAktif] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================
  // FETCH DASHBOARD DATA
  // =====================================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token =
          localStorage.getItem("token");

        // ================================
        // FETCH LAPORAN
        // ================================
        const laporanResponse =
          await fetch(
            "http://localhost:5000/api/laporan",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const laporanData =
          await laporanResponse.json();

        if (laporanResponse.ok) {
          setLaporan(laporanData);
        }

        // ================================
        // FETCH USERS
        // ================================
        const userResponse =
          await fetch(
            "http://localhost:5000/api/users",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const userData =
          await userResponse.json();

        if (userResponse.ok) {
          const admins =
            userData.filter(
              (user: User) =>
                user.role === "admin"
            );

          setAdminAktif(admins);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // =====================================
  // TOTAL DATA
  // =====================================
  const totalLaporan =
    laporan.length;

  const laporanPending =
    laporan.filter(
      (item) =>
        item.status === "pending"
    ).length;

  const laporanDiproses =
    laporan.filter(
      (item) =>
        item.status === "diproses"
    ).length;

  const laporanSelesai =
    laporan.filter(
      (item) =>
        item.status === "selesai"
    ).length;

  const resolusi =
    totalLaporan > 0
      ? (
          (laporanSelesai /
            totalLaporan) *
          100
        ).toFixed(1)
      : "0";

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
                Monitoring keseluruhan
                sistem laporan lingkungan
                secara real-time.
              </p>
            </div>

            <div className="bg-[#e8edf7] px-5 py-3 rounded-xl text-gray-700 font-medium shadow-sm">
              {loading
                ? "Loading..."
                : "Data realtime"}
            </div>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
            {/* TOTAL */}
            <div className="bg-white rounded-2xl p-6 border border-[#0B6B2B] shadow-sm">
              <p className="text-gray-500 font-semibold">
                TOTAL LAPORAN
              </p>

              <div className="flex items-end gap-3 mt-5">
                <h2 className="text-5xl font-bold text-[#052e24]">
                  {totalLaporan}
                </h2>

                <span className="text-green-600 font-semibold mb-2">
                  realtime
                </span>
              </div>
            </div>

            {/* PENDING */}
            <div className="bg-white rounded-2xl p-6 border border-[#0B6B2B] shadow-sm">
              <p className="text-gray-500 font-semibold">
                LAPORAN PENDING
              </p>

              <div className="flex items-end gap-3 mt-5">
                <h2 className="text-5xl font-bold text-[#052e24]">
                  {laporanPending}
                </h2>

                <span className="text-red-500 font-semibold mb-2">
                  perlu review
                </span>
              </div>
            </div>

            {/* RESOLUSI */}
            <div className="bg-white rounded-2xl p-6 border border-[#0B6B2B] shadow-sm">
              <p className="text-gray-500 font-semibold">
                RESOLUSI SISTEM (%)
              </p>

              <div className="flex items-center justify-between mt-5">
                <h2 className="text-5xl font-bold text-[#052e24]">
                  {resolusi}%
                </h2>

                <div className="w-10 h-3 rounded-full bg-green-600"></div>
              </div>
            </div>

            {/* DIPROSES */}
            <div className="bg-white rounded-2xl p-6 border border-red-500 shadow-sm">
              <p className="text-gray-500 font-semibold">
                LAPORAN DIPROSES
              </p>

              <div className="flex items-center gap-4 mt-5">
                <h2 className="text-5xl font-bold text-red-600">
                  {laporanDiproses}
                </h2>

                <p className="text-gray-600 italic">
                  Sedang
                  <br />
                  Ditangani
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
                    Super admin hanya dapat
                    memantau status laporan
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
                    {laporan
                      .slice(0, 6)
                      .map((item) => (
                        <tr
                          key={item.id}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-5 font-bold text-[#052e24]">
                            #{item.id}
                          </td>

                          <td className="px-6 py-5 text-black">
                            {
                              item.category_name
                            }
                          </td>

                          <td className="px-6 py-5 text-black">
                            {
                              item.lokasi_kejadian
                            }
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold
                              ${
                                item.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"

                                  : item.status === "diproses"
                                  ? "bg-orange-100 text-orange-700"

                                  : item.status === "selesai"
                                  ? "bg-green-100 text-green-700"

                                  : item.status === "ditolak"
                                  ? "bg-red-100 text-red-700"

                                  : "bg-gray-100 text-gray-700"
                              }`}
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
                    Monitoring performa
                    sistem
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
                  Daftar admin yang sedang
                  aktif saat ini
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
              {adminAktif.map(
                (admin, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4">
                      {admin.profile ? (
                        <img
                          src={
                            admin.profile
                          }
                          alt="admin"
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#0B6B2B] flex items-center justify-center">
                          <Users className="text-white" />
                        </div>
                      )}

                      <div>
                        <h3 className="font-bold text-black">
                          {
                            admin.username
                          }
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Administrator
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
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}