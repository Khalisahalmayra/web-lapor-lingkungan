"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  CheckCircle2,
  Clock3,
  FileText,
  LoaderCircle,
  MapPin,
} from "lucide-react";

import SidebarAdmin from "../../components/sidebaradmin/page";
import TopbarAdmin from "../../components/topbaradmin/page";

export default function DashboardAdminPage() {
  const router = useRouter();

  const reports = [
    {
      id: "ENV-2023-001",
      kategori: "Pencemaran Sungai",
      lokasi: "Ciliwung, Jakarta",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-600",
    },
    {
      id: "ENV-2023-002",
      kategori: "Penebangan Liar",
      lokasi: "Bukit Barisan, Sumatera",
      status: "In Progress",
      statusColor: "bg-blue-100 text-blue-600",
    },
    {
      id: "ENV-2023-003",
      kategori: "Polusi Udara",
      lokasi: "Marunda, Jakarta",
      status: "Resolved",
      statusColor: "bg-green-100 text-green-600",
    },
    {
      id: "ENV-2023-004",
      kategori: "Sampah Illegal",
      lokasi: "Bantar Gebang, Bekasi",
      status: "Rejected",
      statusColor: "bg-red-100 text-red-600",
    },
    {
      id: "ENV-2023-005",
      kategori: "Kebakaran Hutan",
      lokasi: "Palangkaraya, Kalteng",
      status: "In Progress",
      statusColor: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <main className="flex min-h-screen bg-[#f4f5f7]">
      {/* SIDEBAR */}
      <SidebarAdmin />

      {/* CONTENT */}
      <section className="flex-1 p-6">
        {/* TOPBAR */}
        <TopbarAdmin />

        {/* STAT CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          {/* CARD 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-[6px] border-[#0B6B2B]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 font-medium">
                  TOTAL LAPORAN
                </p>

                <h2 className="text-5xl font-bold text-[#0b1b34] mt-4">
                  1,284
                </h2>

                <p className="text-green-600 text-sm mt-4">
                  ↗ +12% dari bulan lalu
                </p>
              </div>

              <div className="bg-green-100 p-3 rounded-xl">
                <FileText className="text-[#0B6B2B]" />
              </div>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-[6px] border-yellow-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 font-medium">
                  MENUNGGU
                </p>

                <h2 className="text-5xl font-bold text-[#0b1b34] mt-4">
                  156
                </h2>
              </div>

              <div className="bg-yellow-100 p-3 rounded-xl">
                <Clock3 className="text-yellow-600" />
              </div>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-[6px] border-[#0B6B2B]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 font-medium">
                  DALAM PROSES
                </p>

                <h2 className="text-5xl font-bold text-[#0b1b34] mt-4">
                  432
                </h2>
              </div>

              <div className="bg-green-100 p-3 rounded-xl">
                <LoaderCircle className="text-[#0B6B2B]" />
              </div>
            </div>
          </div>

          {/* CARD 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-[6px] border-green-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 font-medium">
                  SELESAI
                </p>

                <h2 className="text-5xl font-bold text-[#0b1b34] mt-4">
                  696
                </h2>
              </div>

              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircle2 className="text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          {/* TABLE LAPORAN */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <h2 className="text-3xl font-bold text-[#0B6B2B]">
                Laporan Terbaru
              </h2>

              <Link
                href="/admin/laporan"
                className="text-[#0B6B2B] font-semibold hover:underline"
              >
                Lihat Semua →
              </Link>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left text-gray-500">
                  <tr className="border-b">
                    <th className="px-6 py-4">ID LAPORAN</th>
                    <th className="px-6 py-4">KATEGORI</th>
                    <th className="px-6 py-4">LOKASI</th>
                    <th className="px-6 py-4">STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {reports.map((report, index) => (
                    <tr
                      key={index}
                      onClick={() =>
                        router.push(
                          `/admin/laporan/${report.id}`
                        )
                      }
                      className="border-b hover:bg-gray-50 transition cursor-pointer"
                    >
                      <td className="px-6 py-5 font-bold text-[#244b3d]">
                        #{report.id}
                      </td>

                      <td className="px-6 py-5 text-gray-700">
                        {report.kategori}
                      </td>

                      <td className="px-6 py-5 text-gray-700">
                        <div className="flex items-center gap-2">
                          <MapPin
                            size={16}
                            className="text-gray-400"
                          />
                          {report.lokasi}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${report.statusColor}`}
                        >
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-[#0B6B2B]">
                Kategori Laporan
              </h2>

              <div className="w-7 h-7 rounded-full border flex items-center justify-center text-gray-400">
                ⊕
              </div>
            </div>

            {/* ITEM */}
            <div className="space-y-7 mt-8">
              {[
                {
                  title: "Pencemaran Air",
                  value: "42%",
                  width: "42%",
                },
                {
                  title: "Polusi Udara",
                  value: "28%",
                  width: "28%",
                },
                {
                  title: "Limbah B3",
                  value: "18%",
                  width: "18%",
                },
                {
                  title: "Lainnya",
                  value: "12%",
                  width: "12%",
                },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-gray-700 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#0B6B2B]" />
                      {item.title}
                    </div>

                    <span>{item.value}</span>
                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full mt-3">
                    <div
                      className="h-3 bg-[#0B6B2B] rounded-full"
                      style={{ width: item.width }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* INSIGHT */}
            <div className="border-t mt-10 pt-6">
              <div className="flex gap-4">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=500&auto=format&fit=crop"
                  alt="insight"
                  className="w-20 h-20 rounded-xl object-cover"
                />

                <div>
                  <h3 className="font-bold text-gray-800">
                    Insight Pekan Ini
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    Kualitas udara di Jakarta meningkat 5%
                    dibanding pekan lalu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}