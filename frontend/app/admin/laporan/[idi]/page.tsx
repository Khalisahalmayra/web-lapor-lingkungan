"use client";

import Link from "next/link";
import { useState } from "react";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  User,
  XCircle,
  MessageSquareText,
} from "lucide-react";

export default function DetailLaporanPage() {
  const [status, setStatus] = useState("Pending");

  const [adminMessage, setAdminMessage] = useState("");

  const [showRejectInput, setShowRejectInput] = useState(false);

  const [showFinishInput, setShowFinishInput] = useState(false);

  const laporan = {
    id: "#ENV-2023-001",
    kategori: "Pencemaran Sungai",
    pelapor: "Budi Santoso",
    tanggal: "12 Mei 2026",
    lokasi: "Ciliwung, Jakarta",
    deskripsi:
      "Terjadi pencemaran sungai akibat limbah industri yang dibuang langsung ke aliran sungai. Air berubah warna dan menimbulkan bau menyengat.",
    gambar:
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1200&auto=format&fit=crop",
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
                  {laporan.id}
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
                    {laporan.kategori}
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
                    {laporan.pelapor}
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
                    {laporan.lokasi}
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
                    {laporan.tanggal}
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
                {laporan.deskripsi}
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
                    12 Mei 2026 - 08:12
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
                  setStatus("Diproses");
                  setShowRejectInput(false);
                  setShowFinishInput(false);
                }}
                className="w-full bg-[#0B6B2B] hover:bg-[#095424] text-white py-3 rounded-2xl font-semibold transition"
              >
                Proses Laporan
              </button>

              {/* SELESAI */}
              <button
                onClick={() => {
                  setShowFinishInput(true);
                  setShowRejectInput(false);
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold transition"
              >
                Selesaikan Laporan
              </button>

              {/* TOLAK */}
              <button
                onClick={() => {
                  setShowRejectInput(true);
                  setShowFinishInput(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-semibold transition"
              >
                Tolak Laporan
              </button>
            </div>

            {/* FORM SELESAI */}
            {showFinishInput && (
              <div className="mt-6">
                <textarea
                  placeholder="Tulis pesan penyelesaian laporan..."
                  onChange={(e) =>
                    setAdminMessage(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
                />

                <button
                  onClick={() => {
                    setStatus("Selesai");
                    setShowFinishInput(false);
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
                    setAdminMessage(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-red-500 min-h-[120px]"
                />

                <button
                  onClick={() => {
                    setStatus("Ditolak");
                    setShowRejectInput(false);
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
    </main>
  );
}