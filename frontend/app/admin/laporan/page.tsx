"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SidebarAdmin from "../../components/sidebaradmin/page";
import TopbarAdmin from "../../components/topbaradmin/page";

import {
  CalendarDays,
  Download,
  MapPin,
  Printer,
  SlidersHorizontal,
} from "lucide-react";

// =========================
// TYPES
// =========================
type Laporan = {
  id: number;
  nama: string;
  initials: string;
  kategori: string;
  tanggal: string;
  lokasi: string;
  status: string;
  statusColor: string;
};

type Kategori = {
  id: number;
  category_name: string;
};

export default function LaporanPage() {
  const router = useRouter();

  // =========================
  // STATE DATA
  // =========================
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [kategori, setKategori] = useState<Kategori[]>([]);

  // =========================
  // STATE FILTER
  // =========================
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // =========================
  // FETCH LAPORAN
  // =========================
  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/laporan");
        const data = await res.json();

        const formatted: Laporan[] = data.map((item: any) => ({
          id: item.id,
          nama: item.username,
          initials: item.username
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),

          kategori: item.category_name,
          tanggal: new Date(item.created_at).toLocaleDateString("id-ID"),
          lokasi: item.lokasi_kejadian,
          status: item.status,

          statusColor:
            item.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : item.status === "diproses"
              ? "bg-orange-100 text-orange-700"
              : item.status === "ditolak"
              ? "bg-red-100 text-red-700"
              : item.status === "selesai"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700",
        }));

        setLaporan(formatted);
      } catch (error) {
        console.log("Error fetch laporan:", error);
      }
    };

    fetchLaporan();
  }, []);

  // =========================
  // FETCH KATEGORI
  // =========================
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/kategori");
        const data = await res.json();
        setKategori(data);
      } catch (error) {
        console.log("Error fetch kategori:", error);
      }
    };

    fetchKategori();
  }, []);

  // =========================
  // FILTER LOGIC
  // =========================
  const filteredLaporan = laporan.filter((item) => {
    const matchKategori =
      selectedKategori === "" || item.kategori === selectedKategori;

    const matchStatus =
      selectedStatus === "" || item.status === selectedStatus;

    return matchKategori && matchStatus;
  });

  return (
    <main className="flex min-h-screen bg-[#f5f6f8]">
      {/* SIDEBAR */}
      <div className="w-72 flex-shrink-0">
        <SidebarAdmin />
      </div>

      {/* CONTENT */}
      <section className="flex-1 overflow-hidden">
        <TopbarAdmin />

        <div className="p-8">
          {/* HEADER (TIDAK DIUBAH) */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-black">
                Arsip Laporan Lingkungan
              </h1>
              <p className="text-black mt-3 max-w-3xl leading-relaxed text-lg">
                Kelola dan pantau seluruh laporan lingkungan dari berbagai wilayah secara terpusat.
              </p>
            </div>

            <div className="flex gap-4">
              <button className="border border-black bg-white px-6 py-4 rounded-xl flex items-center gap-3 font-semibold text-black">
                <Download size={18} />
                EXPORT CSV
              </button>

              <button className="border border-black bg-white px-6 py-4 rounded-xl flex items-center gap-3 font-semibold text-black">
                <Printer size={18} />
                CETAK DATA
              </button>
            </div>
          </div>

          {/* FILTER (TIDAK DIUBAH DESIGN) */}
          <div className="bg-white rounded-2xl p-6 mt-8 shadow-sm border border-black">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

              {/* KATEGORI */}
              <div>
                <label className="text-sm font-semibold text-black">
                  KATEGORI
                </label>

                <select
                  className="w-full border border-black text-black rounded-xl px-4 py-3 mt-2"
                  value={selectedKategori}
                  onChange={(e) => setSelectedKategori(e.target.value)}
                >
                  <option value="">Semua</option>
                  {kategori.map((item) => (
                    <option key={item.id} value={item.category_name}>
                      {item.category_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}
              <div>
                <label className="text-sm font-semibold text-black">
                  STATUS
                </label>

                <select
                  className="w-full border border-black text-black rounded-xl px-4 py-3 mt-2"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">Semua Status</option>
                  <option value="pending">pending</option>
                  <option value="diproses">diproses</option>
                  <option value="ditolak">ditolak</option>
                  <option value="selesai">selesai</option>
                </select>
              </div>

              {/* DATE (tidak diubah) */}
              <div>
                <label className="text-sm font-semibold text-black">
                  TANGGAL MULAI
                </label>
                <div className="relative mt-2">
                  <input type="date" className="w-full border border-black text-black rounded-xl px-4 py-3" />
                  <CalendarDays size={18} className="absolute right-4 top-4" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-black">
                  TANGGAL AKHIR
                </label>
                <div className="relative mt-2">
                  <input type="date" className="w-full border border-black text-black rounded-xl px-4 py-3" />
                  <CalendarDays size={18} className="absolute right-4 top-4" />
                </div>
              </div>

              <div className="flex items-end">
                <button className="w-full bg-[#0B6B2B] text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2">
                  <SlidersHorizontal size={18} />
                  Terapkan Filter
                </button>
              </div>

            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-8 border border-black">
            <div className="overflow-x-auto">
              <table className="w-full">

                <thead className="bg-[#eef2ff] text-left border-b border-black">
                  <tr className="text-black">
                    <th className="px-6 py-5 font-bold">ID LAPORAN</th>
                    <th className="px-6 py-5 font-bold">NAMA PELAPOR</th>
                    <th className="px-6 py-5 font-bold">KATEGORI</th>
                    <th className="px-6 py-5 font-bold">TANGGAL</th>
                    <th className="px-6 py-5 font-bold">LOKASI</th>
                    <th className="px-6 py-5 font-bold">STATUS</th>
                    <th className="px-6 py-5 font-bold text-center">AKSI</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLaporan.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => router.push(`/admin/laporan/${item.id}`)}
                      className="border-b border-black hover:bg-gray-50 transition cursor-pointer"
                    >
                      <td className="px-6 py-6 font-bold text-black">
                        {item.id}
                      </td>

                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center font-bold text-[#0B6B2B] border border-black">
                            {item.initials}
                          </div>
                          <div className="font-semibold text-black">
                            {item.nama}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-6 text-black">
                        {item.kategori}
                      </td>

                      <td className="px-6 py-6 text-black">
                        {item.tanggal}
                      </td>

                      <td className="px-6 py-6 flex items-center gap-2 text-black">
                        <MapPin size={16} />
                        {item.lokasi}
                      </td>

                      <td className="px-6 py-6">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6 py-6 text-center">
                        ⋮
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}