"use client";

import { useState, useEffect } from "react";
import {
  Pencil,
  ShieldAlert,
  Trash2,
  User,
  UserPlus,
  X,
  AlertCircle,
} from "lucide-react";
import { getSession } from "next-auth/react";

import SidebarSuperAdmin from "../../components/sidebarsuperadmin/page";
import TopbarSuperAdmin from "../../components/topbarsuperadmin/page";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function UserSuperAdminPage() {
  interface Admin {
    id: number;
    nama: string;
    email: string;
    departemen: string;
    status: string;
    statusColor: string;
    initials: string;
  }

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openTambahModal, setOpenTambahModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  // laporan stats
  const [laporanStats, setLaporanStats] = useState({
    total: 0,
    pending: 0,
    diproses: 0,
    selesai: 0,
  });

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
  });

  // notification & form errors
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "" }>({ message: "", type: "" });
  const [newAdminErrors, setNewAdminErrors] = useState<{ username?: string; email?: string; password?: string }>({});
  const [editAdminErrors, setEditAdminErrors] = useState<{ username?: string; email?: string }>({});

  // delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  // Fetch semua users
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
  try {
    setLoading(true);

    const session = await getSession();
    const token = session?.accessToken;

    if (!token) {
      throw new Error("Token tidak ditemukan");
    }

    // Fetch admins dan laporan stats in parallel
    const [adminResponse, laporanResponse] = await Promise.all([
      fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch(`${API_URL}/api/laporan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    if (!adminResponse.ok) throw new Error("Gagal fetch users");

    const adminData = await adminResponse.json();
    const formattedAdmins = adminData.map((user: any) => ({
      id: user.id,
      nama: user.username,
      email: user.email,
      departemen: user.role,
      status: "Aktif",
      statusColor: "bg-green-100 text-green-700",
      initials: user.username.charAt(0).toUpperCase(),
    }));

    setAdmins(formattedAdmins);

    // Process laporan stats
    if (laporanResponse.ok) {
      const laporanData = await laporanResponse.json();
      const total = laporanData.length;
      const pending = laporanData.filter((item: any) => item.status === "pending").length;
      const diproses = laporanData.filter((item: any) => item.status === "diproses" || item.status === "sedang diproses").length;
      const selesai = laporanData.filter((item: any) => item.status === "selesai").length;

      setLaporanStats({
        total,
        pending,
        diproses,
        selesai,
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    setNotification({ message: "Gagal memuat data", type: "error" });
  } finally {
    setLoading(false);
  }
};

  // Create admin baru
  const handleTambahAdmin = async () => {
    setNewAdminErrors({});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors: { username?: string; email?: string; password?: string } = {};

    // validations
    if (!newAdmin.username.trim()) {
      errors.username = "Nama pengguna harus diisi";
    }
    if (!newAdmin.email.trim()) {
      errors.email = "Email harus diisi";
    } else if (!emailRegex.test(newAdmin.email.trim())) {
      errors.email = "Format email tidak valid";
    }
    if (!newAdmin.password.trim()) {
      errors.password = "Kata sandi harus diisi";
    }

    const existsUsername = admins.some(
      (a) => a.nama.toLowerCase() === newAdmin.username.trim().toLowerCase()
    );
    if (existsUsername) {
      errors.username = "Nama pengguna sudah ada";
    }

    const existsEmail = admins.some(
      (a) => (a.email || "").toLowerCase() === newAdmin.email.trim().toLowerCase()
    );
    if (existsEmail) {
      errors.email = "Email sudah terdaftar";
    }

    if (Object.keys(errors).length > 0) {
      setNewAdminErrors(errors);
      return;
    }

    try {
      const session = await getSession();
      const token = session?.accessToken;

    if (!token) {
      throw new Error("Token tidak ditemukan");
}
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAdmin),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat admin");
      }

      setNotification({ message: "Admin berhasil ditambahkan", type: "success" });
      setOpenTambahModal(false);
      setNewAdmin({ username: "", email: "", password: "", role: "admin" });
      fetchAdmins();
    } catch (error) {
      console.error("Error creating admin:", error);
      setNotification({ message: (error as Error).message || "Gagal menambah admin", type: "error" });
    }
  };

  // Update admin
  const handleEditAdmin = async () => {
    if (!selectedAdmin) return;

    setEditAdminErrors({});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors: { username?: string; email?: string } = {};

    if (!profileData.username.trim()) {
      errors.username = "Nama pengguna harus diisi";
    }
    if (!profileData.email.trim()) {
      errors.email = "Email harus diisi";
    } else if (!emailRegex.test(profileData.email.trim())) {
      errors.email = "Format email tidak valid";
    }

    const existsUsername = admins.some(
      (a) => a.id !== selectedAdmin.id && a.nama.toLowerCase() === profileData.username.trim().toLowerCase()
    );
    if (existsUsername) {
      errors.username = "Nama pengguna sudah ada";
    }

    const existsEmail = admins.some(
      (a) => a.id !== selectedAdmin.id && (a.email || "").toLowerCase() === profileData.email.trim().toLowerCase()
    );
    if (existsEmail) {
      errors.email = "Email sudah terdaftar";
    }

    if (Object.keys(errors).length > 0) {
      setEditAdminErrors(errors);
      return;
    }

    try {
      const session = await getSession();
      const token = session?.accessToken;

    if (!token) {
      throw new Error("Token tidak ditemukan");
}
      const response = await fetch(`${API_URL}/api/users/${selectedAdmin.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: profileData.username,
          email: profileData.email,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message || "Gagal update admin");
      }

      setNotification({ message: "Admin berhasil diupdate", type: "success" });
      setOpenEditModal(false);
      fetchAdmins();
    } catch (error) {
      console.error("Error updating admin:", error);
      setNotification({ message: (error as Error).message || "Gagal mengupdate admin", type: "error" });
    }
  };

  // open delete modal (instead of confirm)
  const handleDeleteAdmin = (id: number) => {
    setSelectedDeleteId(id);
    setShowDeleteModal(true);
  };

  const performDeleteAdmin = async () => {
    if (!selectedDeleteId) return;
    try {
      setShowDeleteModal(false);
      const session = await getSession();
      const token = session?.accessToken;

    if (!token) {
      throw new Error("Token tidak ditemukan");
}
      const response = await fetch(`${API_URL}/api/users/${selectedDeleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message || "Gagal delete admin");
      }

      setNotification({ message: "Admin berhasil dihapus", type: "success" });
      fetchAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
      setNotification({ message: (error as Error).message || "Gagal menghapus admin", type: "error" });
    } finally {
      setSelectedDeleteId(null);
    }
  };

  const openEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setProfileData({
      username: admin.nama,
      email: admin.email,
      password: "",
    });
    setEditAdminErrors({});
    setOpenEditModal(true);
  };

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

          {/* TOP SUMMARY */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
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
                    {laporanStats.total}
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm">
                    Total Laporan
                  </p>
                </div>

                <div className="border-l-4 border-[#0B6B2B] pl-4">
                  <h2 className="text-4xl font-bold text-[#052e24]">
                    {laporanStats.pending}
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm">
                    Tertunda
                  </p>
                </div>

                <div className="border-l-4 border-[#0B6B2B] pl-4">
                  <h2 className="text-4xl font-bold text-[#052e24]">
                    {laporanStats.total > 0 ? ((laporanStats.selesai / laporanStats.total) * 100).toFixed(0) : 0}%
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

            <div className="space-y-5">
              <div className="bg-[#0f4c37] rounded-2xl p-5 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="uppercase text-xs opacity-80">
                      Peringatan Aktif
                    </p>
                    <h2 className="text-3xl font-bold mt-3">
                      {laporanStats.pending} Tertunda
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
                      {admins.length} Akun
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

          {/* Notification - MOVED BELOW SUMMARY */}
          {notification.message && (
            <div className={`mt-6 mb-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 ${notification.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              <AlertCircle size={18} />
              {notification.message}
            </div>
          )}

          {/* MODAL EDIT */}
          {openEditModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md rounded-3xl p-6 relative">
                <button
                  onClick={() => setOpenEditModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-xl">
                    <User className="text-[#0B6B2B]" size={22} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#0B6B2B]">
                      Edit Admin
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Update akun admin
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-black">
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
                      className="w-full border border-gray-300 text-black rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
                    />
                    {editAdminErrors.username && (
                      <p className="text-red-600 text-sm mt-1">{editAdminErrors.username}</p>
                    )}
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
                      className="w-full border border-gray-300 text-black rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
                    />
                    {editAdminErrors.email && (
                      <p className="text-red-600 text-sm mt-1">{editAdminErrors.email}</p>
                    )}
                  </div>

                  <button
                    onClick={handleEditAdmin}
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
                <button
                  onClick={() => setOpenTambahModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-xl">
                    <UserPlus className="text-[#0B6B2B]" size={22} />
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

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-black">
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
                      className="w-full border border-gray-300 text-black rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
                    />
                    {newAdminErrors.username && (
                      <p className="text-red-600 text-sm mt-1">{newAdminErrors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-black">
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
                      className="w-full border border-gray-300 text-black rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
                    />
                    {newAdminErrors.email && (
                      <p className="text-red-600 text-sm mt-1">{newAdminErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-black">
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
                      className="w-full border border-gray-300 text-black rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
                    />
                    {newAdminErrors.password && (
                      <p className="text-red-600 text-sm mt-1">{newAdminErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-black">
                      Role
                    </label>

                    <input
                      type="text"
                      value={newAdmin.role}
                      disabled
                      className="w-full bg-gray-100 border border-gray-300 text-black rounded-xl px-4 py-3 mt-2 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <button
                    onClick={handleTambahAdmin}
                    className="w-full bg-[#0B6B2B] hover:bg-[#095424] text-white py-3 rounded-xl font-semibold transition"
                  >
                    Simpan Admin
                  </button>
                </div>
              </div>
            </div>
          )}

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
                onClick={() => {
                  setNewAdmin({ username: "", email: "", password: "", role: "admin" });
                  setNewAdminErrors({});
                  setOpenTambahModal(true);
                }}
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
                    <th className="px-6 py-4">Nama Admin</th>
                    <th className="px-6 py-4">Departemen</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-5 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : admins.length > 0 ? (
                    admins.map((admin) => (
                      <tr
                        key={admin.id}
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
                          <span className={`px-4 py-2 rounded-full text-xs font-semibold ${admin.statusColor}`}>
                            {admin.status}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-4">
                            <button
                              onClick={() => openEdit(admin)}
                              className="text-gray-500 hover:text-[#0B6B2B] transition"
                            >
                              <Pencil size={20} />
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteAdmin(admin.id)
                              }
                              className="text-gray-500 hover:text-red-500 transition"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-5 text-center">
                        Tidak ada data admin
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#eef1fb] px-6 py-5">
              <p className="text-gray-600 text-sm">
                Menampilkan {admins.length} dari {admins.length} admin
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

          {/* DELETE CONFIRMATION MODAL */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="text-red-600" size={22} />
                  </div>
                  <h2 className="text-xl font-bold text-black">
                    Hapus Admin?
                  </h2>
                </div>

                <p className="text-gray-600 mb-6">
                  Apakah Anda yakin ingin menghapus admin ini? Tindakan ini tidak dapat dibatalkan.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedDeleteId(null);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-black font-semibold hover:bg-gray-100 transition"
                  >
                    Batal
                  </button>

                  <button
                    onClick={performDeleteAdmin}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}