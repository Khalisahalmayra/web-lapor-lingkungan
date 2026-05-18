"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  User,
  XCircle,
  MessageSquareText,
  Trash2,
} from "lucide-react";

interface Laporan {
  id: number;
  judul_laporan: string;
  isi_laporan: string;
  gambar: string;
  tanggal_kejadian: string;
  lokasi_kejadian: string;
  status: string;
  alasan_penolakan: string | null;
  pesan_admin: string | null;
  category_name: string;
  username: string;
  created_at: string;
}

export default function DetailLaporanPage() {
  const params = useParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [status, setStatus] =
    useState("Pending");

  const [adminMessage, setAdminMessage] =
    useState("");

  const [showRejectInput, setShowRejectInput] =
    useState(false);

  const [showFinishInput, setShowFinishInput] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
  useState(false);

  const [laporan, setLaporan] =
    useState<Laporan | null>(null);

  const [loading, setLoading] =
    useState(true);

  // ==========================
  // GET DETAIL LAPORAN
  // ==========================
  useEffect(() => {
    if (!id) return;

    const fetchDetailLaporan = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/laporan/${id}`
        );

        const data = await response.json();

        const laporanData = Array.isArray(data)
          ? data[0]
          : data.data
          ? data.data
          : data;

        if (!laporanData) {
          setLoading(false);
          return;
        }

        setLaporan(laporanData);

        if (
          laporanData.status === "pending"
        ) {
          setStatus("Pending");
        }

        if (
          laporanData.status === "diproses"
        ) {
          setStatus("Diproses");
        }

        if (
          laporanData.status === "selesai"
        ) {
          setStatus("Selesai");
        }

        if (
          laporanData.status === "ditolak"
        ) {
          setStatus("Ditolak");
        }

        if (laporanData.pesan_admin) {
          setAdminMessage(
            laporanData.pesan_admin
          );
        }

        if (
          laporanData.alasan_penolakan
        ) {
          setAdminMessage(
            laporanData.alasan_penolakan
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailLaporan();
  }, [id]);

  // ==========================
  // UPDATE STATUS
  // ==========================
  const updateStatus = async (
    newStatus: string
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/laporan/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status:
              newStatus.toLowerCase(),

            pesan_admin:
              newStatus === "Selesai"
                ? adminMessage
                : null,

            alasan_penolakan:
              newStatus === "Ditolak"
                ? adminMessage
                : null,
          }),
        }
      );

      const result =
        await response.json();

      console.log(result);

      setStatus(newStatus);

      setLaporan((prev) =>
        prev
          ? {
              ...prev,
              status:
                newStatus.toLowerCase(),
            }
          : prev
      );
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // DELETE LAPORAN
  // ==========================
  const handleDelete = async () => {
  try {
    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/laporan/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result =
      await response.json();

    console.log(result);

    setShowDeleteModal(false);

    window.location.href =
      "/admin/dashboard";

  } catch (error) {
    console.log(error);
  }
};

  const getStatusStyle = () => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Diproses":
        return "bg-blue-100 text-blue-700";

      case "Selesai":
        return "bg-green-100 text-green-700";

      case "Ditolak":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold">
          Loading...
        </h1>
      </main>
    );
  }

  // ==========================
  // DATA TIDAK ADA
  // ==========================
  if (!laporan) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold text-red-500">
          Data laporan tidak ditemukan
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7] p-8">
      {/* BACK */}
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-[#0B6B2B] font-semibold hover:underline"
      >
        <ArrowLeft size={20} />
        Kembali ke Dashboard
      </Link>

      {/* CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">

          {/* IMAGE */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            <img
              src={laporan.gambar}
              alt="laporan"
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* DETAIL */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <p className="text-sm text-gray-400 font-medium">
                  ID LAPORAN
                </p>

                <h1 className="text-4xl font-bold text-[#0B6B2B] mt-2">
                  #{laporan.id}
                </h1>
              </div>

              <span
                className={`px-5 py-2 rounded-full font-semibold w-fit ${getStatusStyle()}`}
              >
                {status}
              </span>

            </div>

            {/* INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

              {/* KATEGORI */}
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle2 className="text-[#0B6B2B]" />
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Kategori
                  </p>

                  <h3 className="font-semibold text-gray-800 text-lg mt-1">
                    {laporan.category_name}
                  </h3>
                </div>
              </div>

              {/* PELAPOR */}
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <User className="text-blue-600" />
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Pelapor
                  </p>

                  <h3 className="font-semibold text-gray-800 text-lg mt-1">
                    {laporan.username}
                  </h3>
                </div>
              </div>

              {/* LOKASI */}
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <MapPin className="text-orange-600" />
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Lokasi
                  </p>

                  <h3 className="font-semibold text-gray-800 text-lg mt-1">
                    {laporan.lokasi_kejadian}
                  </h3>
                </div>
              </div>

              {/* TANGGAL */}
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <CalendarDays className="text-purple-600" />
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Tanggal
                  </p>

                  <h3 className="font-semibold text-gray-800 text-lg mt-1">
                    {laporan.tanggal_kejadian}
                  </h3>
                </div>
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="mt-10">

              <h2 className="text-2xl font-bold text-gray-800">
                Deskripsi Laporan
              </h2>

              <p className="text-gray-600 leading-relaxed mt-4 text-lg">
                {laporan.isi_laporan}
              </p>

            </div>

            {/* PESAN ADMIN */}
            {adminMessage && (
              <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">

                <div className="flex items-center gap-3">

                  <div className="bg-[#0B6B2B]/10 p-3 rounded-xl">
                    <MessageSquareText className="text-[#0B6B2B]" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Pesan Admin
                    </h2>

                    <p className="text-gray-500 text-sm">
                      Informasi tindak lanjut laporan
                    </p>
                  </div>

                </div>

                <p className="text-gray-700 leading-relaxed mt-5">
                  {adminMessage}
                </p>

              </div>
            )}

          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* STATUS */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h2 className="text-2xl font-bold text-[#0B6B2B]">
              Status Penanganan
            </h2>

            <div className="mt-6 space-y-5">

              {/* DITERIMA */}
              <div className="flex items-center gap-4">

                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2
                    className="text-green-600"
                    size={18}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    Laporan Diterima
                  </h3>

                  <p className="text-sm text-gray-400">
                    {new Date(
                      laporan.created_at
                    ).toLocaleString()}
                  </p>
                </div>

              </div>

              {/* STATUS */}
              <div className="flex items-center gap-4">

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    status === "Ditolak"
                      ? "bg-red-100"
                      : status === "Selesai"
                      ? "bg-green-100"
                      : "bg-yellow-100"
                  }`}
                >

                  {status === "Ditolak" ? (
                    <XCircle
                      className="text-red-600"
                      size={18}
                    />
                  ) : status === "Selesai" ? (
                    <CheckCircle2
                      className="text-green-600"
                      size={18}
                    />
                  ) : (
                    <Clock3
                      className="text-yellow-600"
                      size={18}
                    />
                  )}

                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {status}
                  </h3>

                  <p className="text-sm text-gray-400">
                    Status terbaru laporan
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* ACTION */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h2 className="text-2xl font-bold text-[#0B6B2B]">
              Aksi Admin
            </h2>

            <div className="space-y-4 mt-6">

              {/* PROSES */}
              <button
                onClick={() => {
                  updateStatus(
                    "Diproses"
                  );

                  setShowRejectInput(
                    false
                  );

                  setShowFinishInput(
                    false
                  );
                }}
                className="w-full bg-[#0B6B2B] hover:bg-[#095424] text-white py-3 rounded-2xl font-semibold transition"
              >
                Proses Laporan
              </button>

              {/* SELESAI */}
              <button
                onClick={() => {
                  setShowFinishInput(
                    true
                  );

                  setShowRejectInput(
                    false
                  );
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold transition"
              >
                Selesaikan Laporan
              </button>

              {/* TOLAK */}
              <button
                onClick={() => {
                  setShowRejectInput(
                    true
                  );

                  setShowFinishInput(
                    false
                  );
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-semibold transition"
              >
                Tolak Laporan
              </button>

              {/* DELETE */}
              <button
                onClick={() =>
                  setShowDeleteModal(true)
                }
                className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Hapus Laporan
              </button>
            </div>

            {/* FORM SELESAI */}
            {showFinishInput && (
              <div className="mt-6">

                <textarea
                  placeholder="Tulis pesan penyelesaian laporan..."
                  onChange={(e) =>
                    setAdminMessage(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
                />

                <button
                  onClick={() => {
                    updateStatus(
                      "Selesai"
                    );

                    setShowFinishInput(
                      false
                    );
                  }}
                  className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold transition"
                >
                  Simpan Status Selesai
                </button>

              </div>
            )}

            {/* FORM TOLAK */}
            {showRejectInput && (
              <div className="mt-6">

                <textarea
                  placeholder="Tulis alasan laporan ditolak..."
                  onChange={(e) =>
                    setAdminMessage(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-red-500 min-h-[120px]"
                />

                <button
                  onClick={() => {
                    updateStatus(
                      "Ditolak"
                    );

                    setShowRejectInput(
                      false
                    );
                  }}
                  className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-semibold transition"
                >
                  Simpan Penolakan
                </button>

              </div>
            )}

          </div>
        </div>
      </div>

            {/* DELETE MODAL */}
              {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

                  <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-xl animate-in fade-in zoom-in-95 duration-200">

                    <div className="flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                        <Trash2
                          className="text-red-600"
                          size={35}
                        />
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center mt-6 text-gray-800">
                      Hapus Laporan?
                    </h2>

                    <p className="text-center text-gray-500 mt-3 leading-relaxed">
                      Laporan yang dihapus tidak bisa
                      dikembalikan lagi.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-8">

                      {/* BATAL */}
                      <button
                        onClick={() =>
                          setShowDeleteModal(false)
                        }
                        className="py-3 rounded-2xl border border-gray-300 font-semibold hover:bg-gray-100 transition"
                      >
                        Batal
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={handleDelete}
                        className="py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                      >
                        Hapus
                      </button>

                    </div>

                  </div>

                </div>
              )}

    </main>
  );
}