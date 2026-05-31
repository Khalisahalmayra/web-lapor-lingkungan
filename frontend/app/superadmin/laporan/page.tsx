"use client";

import { useEffect, useState } from "react";

import {
  Bell,
  Clock3,
  Eye,
  FileText,
  Filter,
  LogOut,
  MapPin,
  Moon,
  Search,
  ShieldAlert,
  User,
  X,
  Pencil,
  Settings,
} from "lucide-react";
import { getSession } from "next-auth/react";

import SidebarSuperAdmin from "../../components/sidebarsuperadmin/page";
import TopbarSuperAdmin from "../../components/topbarsuperadmin/page";

export default function LaporanSuperAdminPage() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [profileData, setProfileData] = useState({
    username: "superadmin",
    email: "superadmin@gmail.com",
    password: "12345678",
  });

  const [laporan, setLaporan] = useState<any[]>([]);

  // =========================
  // GET LAPORAN FROM BACKEND
  // =========================
  useEffect(() => {
  const fetchLaporan = async () => {
    try {
      const session = await getSession();

      const token = session?.accessToken;

      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const res = await fetch(
        "http://localhost:5000/api/laporan",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setLaporan(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setLaporan([]);
    }
  };

  fetchLaporan();
}, []);

  const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "diproses":
      return "bg-orange-100 text-orange-700";

    case "selesai":
      return "bg-green-100 text-green-700";

    case "ditolak":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

  return (
    <main className="flex min-h-screen bg-[#f4f5f7]">
      {/* SIDEBAR */}
      <SidebarSuperAdmin />

      {/* CONTENT */}
      <section className="flex-1 min-w-0">
        <TopbarSuperAdmin />

        {/* MODAL */}
        {openEditModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-3xl p-8 relative">
              <button
                onClick={() => setOpenEditModal(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-black"
              >
                <X />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="bg-green-100 p-3 rounded-xl">
                  <User className="text-[#0B6B2B]" />
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-[#0B6B2B]">
                    Edit Profile
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Update akun super admin
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Username
                  </label>

                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        username: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B] text-black"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Email
                  </label>

                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        email: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B] text-black"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Password
                  </label>

                  <input
                    type="password"
                    value={profileData.password}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        password: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B] text-black"
                  />
                </div>

                <button
                  onClick={() => setOpenEditModal(false)}
                  className="w-full bg-[#0B6B2B] hover:bg-[#095424] text-white py-4 rounded-2xl font-semibold transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div className="p-6 lg:p-8">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#052e24]">
                Monitoring Laporan
              </h1>

              <p className="text-gray-500 mt-3 text-base lg:text-lg">
                Super admin hanya dapat memantau aktivitas laporan lingkungan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="bg-white border border-gray-300 px-5 py-3 rounded-2xl font-medium flex items-center gap-2 hover:bg-gray-50 transition text-black">
                <Filter size={18} />
                Filter
              </button>

              <button className="bg-[#0B6B2B] text-white px-5 py-3 rounded-2xl font-medium hover:bg-[#095424] transition">
                Audit Report
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden mt-8 border border-gray-200">
            <div className="px-6 py-5 border-b flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#052e24]">
                  Daftar Laporan
                </h2>

                <p className="text-gray-500 mt-1">
                  Pemantauan status dan aktivitas laporan
                </p>
              </div>

              <div className="bg-[#eaf7ef] text-[#0B6B2B] px-4 py-2 rounded-xl font-semibold flex items-center gap-2 w-fit">
                <Eye size={18} />
                View Only
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-[#f8fafc] border-b">
                  <tr className="text-left text-black">
                    <th className="px-6 py-5 font-bold">ID LAPORAN</th>
                    <th className="px-6 py-5 font-bold">KATEGORI</th>
                    <th className="px-6 py-5 font-bold">LOKASI</th>
                    <th className="px-6 py-5 font-bold">PELAPOR</th>
                    <th className="px-6 py-5 font-bold">TANGGAL</th>
                    <th className="px-6 py-5 font-bold">STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {laporan.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-5 font-bold text-black">
                        #{item.id}
                      </td>

                      <td className="px-6 py-5 text-black">
                        <div className="flex items-center gap-2">
                          <FileText size={18} className="text-[#0B6B2B]" />
                          {item.category_name}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-black">
                        <div className="flex items-center gap-2">
                          <MapPin size={18} className="text-gray-500" />
                          {item.lokasi_kejadian}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-black font-medium">
                        {item.username}
                      </td>

                      <td className="px-6 py-5 text-black">
                        {item.tanggal_kejadian}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                            item.status
                          )}`}
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

          {/* ALERT */}
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 mt-8">
            <div className="flex items-start gap-5">
              <div className="bg-red-100 p-4 rounded-2xl">
                <ShieldAlert className="text-red-600" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-red-700">
                  Monitoring Aktif
                </h3>

                <p className="text-red-500 mt-2 leading-relaxed">
                  Super admin hanya memiliki akses untuk memantau laporan dan aktivitas sistem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}