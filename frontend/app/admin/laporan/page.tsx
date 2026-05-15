"use client";

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

export default function LaporanPage() {
  const router = useRouter();

  const laporan = [
    {
      id: "ENV-2024-089",
      nama: "Sarah Mitchell",
      initials: "SM",
      kategori: "Pencemaran",
      tanggal: "24 Okt 2023",
      lokasi: "Jakarta Selatan",
      status: "Terverifikasi",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      id: "ENV-2024-090",
      nama: "James Howlett",
      initials: "JH",
      kategori: "Sampah",
      tanggal: "25 Okt 2023",
      lokasi: "Bandung",
      status: "Menunggu Review",
      statusColor: "bg-blue-100 text-blue-700",
    },
    {
      id: "ENV-2024-091",
      nama: "Elena Petrova",
      initials: "EP",
      kategori: "Drainase & Banjir",
      tanggal: "27 Okt 2023",
      lokasi: "Surabaya",
      status: "Ditandai",
      statusColor: "bg-red-100 text-red-600",
    },
    {
      id: "ENV-2024-092",
      nama: "Marcus Bennett",
      initials: "MB",
      kategori: "Penghijauan",
      tanggal: "28 Okt 2023",
      lokasi: "Yogyakarta",
      status: "Terverifikasi",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      id: "ENV-2024-093",
      nama: "Linda Kim",
      initials: "LK",
      kategori: "Limbah Berbahaya",
      tanggal: "30 Okt 2023",
      lokasi: "Bekasi",
      status: "Diproses",
      statusColor: "bg-yellow-100 text-yellow-700",
    },
  ];

  return (
    <main className="flex min-h-screen bg-[#f5f6f8]">
      {/* SIDEBAR */}
      <div className="w-72 flex-shrink-0">
        <SidebarAdmin />
      </div>

      {/* CONTENT */}
      <section className="flex-1 overflow-hidden">
        {/* TOPBAR */}
        <TopbarAdmin />

        {/* PAGE CONTENT */}
        <div className="p-8">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-black">
                Arsip Laporan Lingkungan
              </h1>

              <p className="text-black mt-3 max-w-3xl leading-relaxed text-lg">
                Kelola dan pantau seluruh laporan lingkungan dari
                berbagai wilayah secara terpusat.
              </p>
            </div>

            {/* BUTTON */}
            <div className="flex gap-4">
              <button className="border border-black bg-white px-6 py-4 rounded-xl flex items-center gap-3 font-semibold hover:bg-gray-50 transition text-black">
                <Download size={18} />
                EXPORT CSV
              </button>

              <button className="border border-black bg-white px-6 py-4 rounded-xl flex items-center gap-3 font-semibold hover:bg-gray-50 transition text-black">
                <Printer size={18} />
                CETAK DATA
              </button>
            </div>
          </div>

          {/* FILTER */}
          <div className="bg-white rounded-2xl p-6 mt-8 shadow-sm border border-black">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
              {/* CATEGORY */}
              <div>
                <label className="text-sm font-semibold text-black">
                  KATEGORI
                </label>

                <select className="w-full border border-black text-black rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]">
                  <option>Semua</option>
                  <option>Sampah</option>
                  <option>Pencemaran</option>
                  <option>Drainase & Banjir</option>
                  <option>Penghijauan</option>
                  <option>Limbah Berbahaya</option>
                  <option>Fasilitas Umum Lingkungan</option>
                  <option>Kebersihan Umum</option>
                </select>
              </div>

              {/* STATUS */}
              <div>
                <label className="text-sm font-semibold text-black">
                  STATUS
                </label>

                <select className="w-full border border-black text-black rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]">
                  <option>Semua Status</option>
                  <option>Terverifikasi</option>
                  <option>Menunggu Review</option>
                  <option>Ditandai</option>
                  <option>Diproses</option>
                </select>
              </div>

              {/* DATE START */}
              <div>
                <label className="text-sm font-semibold text-black">
                  TANGGAL MULAI
                </label>

                <div className="relative mt-2">
                  <input
                    type="date"
                    className="w-full border border-black text-black rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
                  />

                  <CalendarDays
                    size={18}
                    className="absolute right-4 top-4 text-black"
                  />
                </div>
              </div>

              {/* DATE END */}
              <div>
                <label className="text-sm font-semibold text-black">
                  TANGGAL AKHIR
                </label>

                <div className="relative mt-2">
                  <input
                    type="date"
                    className="w-full border border-black text-black rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
                  />

                  <CalendarDays
                    size={18}
                    className="absolute right-4 top-4 text-black"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex items-end">
                <button className="w-full bg-[#0B6B2B] hover:bg-[#095424] text-white rounded-xl py-3 font-semibold transition flex items-center justify-center gap-2">
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
                {/* HEAD */}
                <thead className="bg-[#eef2ff] text-left border-b border-black">
                  <tr className="text-black">
                    <th className="px-6 py-5 font-bold">
                      ID LAPORAN
                    </th>

                    <th className="px-6 py-5 font-bold">
                      NAMA PELAPOR
                    </th>

                    <th className="px-6 py-5 font-bold">
                      KATEGORI
                    </th>

                    <th className="px-6 py-5 font-bold">
                      TANGGAL
                    </th>

                    <th className="px-6 py-5 font-bold">
                      LOKASI
                    </th>

                    <th className="px-6 py-5 font-bold">
                      STATUS
                    </th>

                    <th className="px-6 py-5 font-bold text-center">
                      AKSI
                    </th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {laporan.map((item, index) => (
                    <tr
                      key={index}
                      onClick={() =>
                        router.push(
                          `/admin/laporan/${item.id}`
                        )
                      }
                      className="border-b border-black hover:bg-gray-50 transition cursor-pointer"
                    >
                      {/* ID */}
                      <td className="px-6 py-6 font-bold text-black">
                        {item.id}
                      </td>

                      {/* REPORTER */}
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center font-bold text-[#0B6B2B] border border-black">
                            {item.initials}
                          </div>

                          <div>
                            <h3 className="font-semibold text-black">
                              {item.nama}
                            </h3>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-6 text-black font-medium">
                        {item.kategori}
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-6 text-black">
                        {item.tanggal}
                      </td>

                      {/* LOCATION */}
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-black">
                          <MapPin
                            size={16}
                            className="text-black"
                          />
                          {item.lokasi}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-6">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${item.statusColor}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-6 text-center">
                        <button className="text-2xl text-black hover:text-gray-700 transition">
                          ⋮
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-t border-black bg-[#fafafa]">
              <p className="text-black font-medium">
                Menampilkan 1 sampai 5 dari 124 data
              </p>

              {/* PAGINATION */}
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 border border-black rounded-lg flex items-center justify-center hover:bg-gray-100 text-black">
                  ‹
                </button>

                <button className="w-10 h-10 bg-[#0B6B2B] text-white rounded-lg font-semibold">
                  1
                </button>

                <button className="w-10 h-10 border border-black rounded-lg hover:bg-gray-100 text-black">
                  2
                </button>

                <button className="w-10 h-10 border border-black rounded-lg hover:bg-gray-100 text-black">
                  3
                </button>

                <button className="w-10 h-10 border border-black rounded-lg flex items-center justify-center hover:bg-gray-100 text-black">
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}