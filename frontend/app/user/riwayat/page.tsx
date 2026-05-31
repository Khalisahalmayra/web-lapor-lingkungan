"use client";

import { useEffect, useState } from "react";

import Navbar from "../../components/navbar/page";

import {
  Calendar,
  MapPin,
  Image as ImageIcon,
  Loader2,
  Inbox,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";

// =========================
// TYPES
// =========================
interface Laporan {
  id: number;
  judul_laporan: string;
  isi_laporan: string;
  gambar: string | null;
  tanggal_kejadian: string;
  lokasi_kejadian: string;
  status: string;
  alasan_penolakan: string | null;
  pesan_admin: string | null;
  category_name: string;
}

type StatusType =
  | "pending"
  | "diproses"
  | "selesai"
  | "ditolak";


// =========================
// TABS
// =========================
const TABS = [
  "Semua",
  "Pending",
  "Diproses",
  "Selesai",
  "Ditolak",
];

// =========================
// NORMALIZE STATUS
// =========================
const normalizeStatus = (
  status: string
): StatusType => {
  const s = status.toLowerCase();

  if (s === "pending") {
    return "pending";
  }

  if (
    s === "diproses" ||
    s === "sedang diproses"
  ) {
    return "diproses";
  }

  if (s === "selesai") {
    return "selesai";
  }

  return "ditolak";
};

// =========================
// FORMAT DATE
// =========================
const formatDate = (date: string) => {
  return new Date(date)
    .toLocaleDateString("id-ID")
    .replace(/\//g, " / ");
};

// =========================
// PAGE
// =========================
export default function RiwayatPage() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [activeTab, setActiveTab] =
    useState("Semua");

  const [laporan, setLaporan] =
    useState<Laporan[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH RIWAYAT
  // =========================
  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        if (!token) {
          console.log("No token / belum login");
          setLoading(false);
          return;
        }

        const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/laporan/riwayat`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Gagal mengambil data riwayat");
      }

      const data = await res.json();
      setLaporan(data);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
  }, [token]);

  // =========================
  // FILTER
  // =========================
  const filteredData =
    activeTab === "Semua"
      ? laporan
      : laporan.filter(
          (item) =>
            normalizeStatus(item.status) ===
            normalizeStatus(activeTab)
        );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5f5f5] pb-10">

        {/* ========================= */}
        {/* TOP TAB */}
        {/* ========================= */}
        <section className="w-full flex justify-center px-5 pt-8">

          <div className="w-full max-w-6xl bg-[#557d1c] rounded-full p-2 flex items-center justify-center gap-2 overflow-x-auto">

            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab)
                }
                className={`px-8 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white text-black shadow"
                    : "text-white"
                }`}
              >
                {tab}
              </button>
            ))}

          </div>
        </section>

        {/* ========================= */}
        {/* CONTENT */}
        {/* ========================= */}
        <section className="w-full flex justify-center px-5 mt-8">

          <div className="w-full max-w-6xl">

            {/* LOADING */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">

                <Loader2 className="w-10 h-10 animate-spin text-[#2d5a1b]" />

                <p className="mt-3 text-sm font-semibold">
                  Memuat laporan...
                </p>

              </div>
            )}

            {/* EMPTY */}
            {!loading &&
              filteredData.length === 0 && (
                <div className="flex flex-col items-center py-20 text-[#557d1c]">

                  <Inbox className="w-14 h-14" />

                  <p className="mt-3 font-semibold">
                    Tidak ada laporan
                  </p>

                </div>
              )}

            {/* CARD */}
            {!loading &&
              filteredData.map((item) => {
                const status =
                  normalizeStatus(
                    item.status
                  );

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl p-6 mb-8 border-[4px] bg-[#006414] border-[#1ea7ff]"
                  >

                    {/* STATUS */}
                    <div className="mb-5">

                      <div
                        className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white font-bold text-xl
                        
                        ${
                          status === "pending"
                            ? "text-yellow-500"
                            : ""
                        }

                        ${
                          status === "diproses"
                            ? "text-orange-500"
                            : ""
                        }

                        ${
                          status === "selesai"
                            ? "text-green-600"
                            : ""
                        }

                        ${
                          status === "ditolak"
                            ? "text-red-600"
                            : ""
                        }
                      `}
                      >

                        <div
                          className={`w-5 h-5 rounded-full
                          
                          ${
                            status === "pending"
                              ? "bg-yellow-400"
                              : ""
                          }

                          ${
                            status === "diproses"
                              ? "bg-orange-400"
                              : ""
                          }

                          ${
                            status === "selesai"
                              ? "bg-green-500"
                              : ""
                          }

                          ${
                            status === "ditolak"
                              ? "bg-red-500"
                              : ""
                          }
                        `}
                        />

                        {item.status}

                      </div>
                    </div>

                    {/* JUDUL */}
                    <div className="mb-5">

                      <h2 className="text-white font-bold mb-2">
                        Judul Laporan
                      </h2>

                      <div className="border border-white rounded-xl p-4 text-white">
                        {item.judul_laporan}
                      </div>

                    </div>

                    {/* FOTO + ISI */}
                    <div className="grid md:grid-cols-2 gap-5 mb-5">

                      {/* FOTO */}
                      <div className="border border-white rounded-xl overflow-hidden min-h-[280px] flex items-center justify-center bg-white/10">

                        {item.gambar ? (
                          <img
                            src={`http://localhost:5000/uploads/${item.gambar}`}
                            alt="laporan"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-white flex flex-col items-center">

                            <ImageIcon className="w-12 h-12" />

                            <p className="mt-2 text-sm">
                              Tidak ada gambar
                            </p>

                          </div>
                        )}

                      </div>

                      {/* ISI */}
                      <div className="border border-white rounded-xl p-6 text-white leading-relaxed">

                        {item.isi_laporan}

                      </div>

                    </div>

                    {/* TANGGAL + KATEGORI */}
                    <div className="grid md:grid-cols-3 gap-5 mb-5">

                      <div>

                        <h2 className="text-white font-bold mb-2 flex items-center gap-2">

                          <Calendar className="w-4 h-4" />

                          Tanggal Kejadian

                        </h2>

                        <div className="border border-white rounded-xl p-4 text-white flex justify-between">

                          {formatDate(
                            item.tanggal_kejadian
                          )}

                          <Calendar className="w-4 h-4" />

                        </div>

                      </div>

                      <div className="md:col-span-2">

                        <h2 className="text-white font-bold mb-2">
                          Kategori Laporan
                        </h2>

                        <div className="border border-white rounded-xl p-4 text-white">

                          {item.category_name}

                        </div>

                      </div>

                    </div>

                    {/* LOKASI */}
                    <div>

                      <h2 className="text-white font-bold mb-2 flex items-center gap-2">

                        <MapPin className="w-4 h-4" />

                        Lokasi Kejadian

                      </h2>

                      <div className="border border-white rounded-xl p-4 text-white">

                        {item.lokasi_kejadian}

                      </div>

                    </div>

                    {/* PESAN ADMIN */}
                    {status === "selesai" &&
                      item.pesan_admin && (
                        <div className="mt-5 bg-white/10 border border-green-500 rounded-xl p-5 text-white">

                          <div className="flex items-center gap-2 mb-2">

                            <CheckCircle2 className="w-5 h-5" />

                            <span className="font-bold">
                              Pesan Admin
                            </span>

                          </div>

                          <p>
                            {item.pesan_admin}
                          </p>

                        </div>
                      )}

                    {/* ALASAN PENOLAKAN */}
                    {status === "ditolak" &&
                      item.alasan_penolakan && (
                        <div className="mt-5 bg-white/10 border border-red-500 rounded-xl p-5 text-white">

                          <div className="flex items-center gap-2 mb-2">

                            <XCircle className="w-5 h-5" />

                            <span className="font-bold">
                              Alasan Penolakan
                            </span>

                          </div>

                          <p>
                            {
                              item.alasan_penolakan
                            }
                          </p>

                        </div>
                      )}

                  </div>
                );
              })}

          </div>
        </section>
      </main>
    </>
  );
}