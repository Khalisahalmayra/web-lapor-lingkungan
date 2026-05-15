"use client";

import { useState } from "react";

import {
  Pencil,
  ShieldAlert,
  Trash2,
  User,
  UserPlus,
  X,
} from "lucide-react";

import SidebarSuperAdmin from "../../components/sidebarsuperadmin/page";
import TopbarSuperAdmin from "../../components/topbarsuperadmin/page";

export default function UserSuperAdminPage() {
  const [openEditModal, setOpenEditModal] =
    useState(false);

  const [openTambahModal, setOpenTambahModal] =
    useState(false);

  const [profileData, setProfileData] = useState({
    username: "superadmin",
    email: "superadmin@gmail.com",
    password: "12345678",
  });

  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    password: "",
    role: "Admin",
  });

  const admins = [
    {
      initials: "BP",
      nama: "Bambang Pamungkas",
      departemen: "Audit Emisi Udara",
      email: "b.pamungkas@ecoaudit.id",
      status: "Aktif",
      statusColor:
        "bg-green-100 text-green-700 border border-green-200",
    },
    {
      initials: "SW",
      nama: "Siti Wahyuni",
      departemen: "Konservasi Air",
      email: "s.wahyuni@ecoaudit.id",
      status: "Aktif",
      statusColor:
        "bg-green-100 text-green-700 border border-green-200",
    },
    {
      initials: "DR",
      nama: "Dedi Ramlan",
      departemen: "Limbah B3",
      email: "d.ramlan@ecoaudit.id",
      status: "Cuti",
      statusColor:
        "bg-red-100 text-red-600 border border-red-200",
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

        {/* PAGE CONTENT */}
        <div className="p-6">
          {/* MODAL EDIT */}
          {openEditModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md rounded-3xl p-6 relative">
                <button
                  onClick={() =>
                    setOpenEditModal(false)
                  }
                  className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-xl">
                    <User
                      className="text-[#0B6B2B]"
                      size={22}
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#0B6B2B]">
                      Edit Profile
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Update akun super admin
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
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
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
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
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
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
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
                    />
                  </div>

                  <button
                    onClick={() =>
                      setOpenEditModal(false)
                    }
                    className="w-full bg-[#0B6B2B] hover:bg-[#095424] text-white py-3 rounded-xl font-semibold transition"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL TAMBAH ADMIN */}
          {openTambahModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md rounded-3xl p-6 relative">
                {/* CLOSE */}
                <button
                  onClick={() =>
                    setOpenTambahModal(false)
                  }
                  className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                  <X size={20} />
                </button>

                {/* HEADER */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-xl">
                    <UserPlus
                      className="text-[#0B6B2B]"
                      size={22}
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#0B6B2B]">
                      Tambah Admin
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Tambahkan akun admin baru
                    </p>
                  </div>
                </div>

                {/* FORM */}
                <div className="space-y-4">
                  {/* USERNAME */}
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Nama Pengguna
                    </label>

                    <input
                      type="text"
                      placeholder="Masukkan username"
                      value={newAdmin.username}
                      onChange={(e) =>
                        setNewAdmin({
                          ...newAdmin,
                          username: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Email
                    </label>

                    <input
                      type="email"
                      placeholder="Masukkan email"
                      value={newAdmin.email}
                      onChange={(e) =>
                        setNewAdmin({
                          ...newAdmin,
                          email: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Password
                    </label>

                    <input
                      type="password"
                      placeholder="Masukkan password"
                      value={newAdmin.password}
                      onChange={(e) =>
                        setNewAdmin({
                          ...newAdmin,
                          password: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
                    />
                  </div>

                  {/* ROLE */}
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Role
                    </label>

                    <input
                      type="text"
                      value={newAdmin.role}
                      disabled
                      className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 mt-2 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() =>
                      setOpenTambahModal(false)
                    }
                    className="w-full bg-[#0B6B2B] hover:bg-[#095424] text-white py-3 rounded-xl font-semibold transition"
                  >
                    Simpan Admin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOP SUMMARY */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* LEFT */}
            <div className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden">
              <p className="text-gray-500 font-bold uppercase tracking-wide text-sm">
                Ringkasan Sistem
              </p>

              <h1 className="text-3xl font-bold text-[#052e24] mt-3">
                Status Pelaporan Lingkungan
              </h1>

              <div className="grid grid-cols-3 gap-5 mt-8">
                <div className="border-l-4 border-[#0B6B2B] pl-4">
                  <h2 className="text-4xl font-bold text-[#052e24]">
                    1,284
                  </h2>

                  <p className="text-gray-600 mt-2 text-sm">
                    Total Laporan
                  </p>
                </div>

                <div className="border-l-4 border-[#0B6B2B] pl-4">
                  <h2 className="text-4xl font-bold text-[#052e24]">
                    42
                  </h2>

                  <p className="text-gray-600 mt-2 text-sm">
                    Tertunda
                  </p>
                </div>

                <div className="border-l-4 border-[#0B6B2B] pl-4">
                  <h2 className="text-4xl font-bold text-[#052e24]">
                    98%
                  </h2>

                  <p className="text-gray-600 mt-2 text-sm">
                    Penyelesaian
                  </p>
                </div>
              </div>

              <div className="absolute right-6 top-6 opacity-10">
                <ShieldAlert size={110} />
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-5">
              <div className="bg-[#0f4c37] rounded-2xl p-5 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="uppercase text-xs opacity-80">
                      Peringatan Aktif
                    </p>

                    <h2 className="text-3xl font-bold mt-3">
                      12 Pelanggaran
                    </h2>
                  </div>

                  <ShieldAlert size={32} />
                </div>
              </div>

              <div className="bg-[#9be7bf] rounded-2xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="uppercase text-xs text-[#0B6B2B]">
                      Admin Aktif
                    </p>

                    <h2 className="text-3xl font-bold text-[#0B6B2B] mt-3">
                      24 Akun
                    </h2>
                  </div>

                  <ShieldAlert
                    size={32}
                    className="text-[#0B6B2B]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 px-6 py-5 border-b border-gray-200">
              <div>
                <h2 className="text-3xl font-bold text-[#052e24]">
                  Manajemen Akun Admin
                </h2>

                <p className="text-gray-600 mt-2">
                  Kelola hak akses dan departemen admin.
                </p>
              </div>

              <button
                onClick={() =>
                  setOpenTambahModal(true)
                }
                className="bg-[#0B6B2B] hover:bg-[#095424] text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition w-fit text-sm"
              >
                <UserPlus size={20} />
                Tambah Admin
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#eef1fb]">
                  <tr className="text-left text-gray-500 uppercase text-xs">
                    <th className="px-6 py-4">
                      Nama Admin
                    </th>

                    <th className="px-6 py-4">
                      Departemen
                    </th>

                    <th className="px-6 py-4">Email</th>

                    <th className="px-6 py-4">Status</th>

                    <th className="px-6 py-4 text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {admins.map((admin, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#dfe6f7] flex items-center justify-center font-bold text-[#052e24]">
                            {admin.initials}
                          </div>

                          <h3 className="font-bold text-[#1e293b] text-lg">
                            {admin.nama}
                          </h3>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-700">
                        {admin.departemen}
                      </td>

                      <td className="px-6 py-5 text-gray-500 text-sm">
                        {admin.email}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-semibold ${admin.statusColor}`}
                        >
                          {admin.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() =>
                              setOpenEditModal(true)
                            }
                            className="text-gray-500 hover:text-[#0B6B2B] transition"
                          >
                            <Pencil size={20} />
                          </button>

                          <button className="text-gray-500 hover:text-red-500 transition">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#eef1fb] px-6 py-5">
              <p className="text-gray-600 text-sm">
                Menampilkan 3 dari 24 admin
              </p>

              <div className="flex items-center gap-3">
                <button className="border border-gray-300 bg-white px-5 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm">
                  Sebelumnya
                </button>

                <button className="border border-gray-300 bg-white px-5 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm">
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}