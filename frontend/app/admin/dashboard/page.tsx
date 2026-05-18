"use client";

import { useEffect, useState } from "react";
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

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH LAPORAN
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5000/api/laporan");
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Gagal ambil data laporan");
          return;
        }

        setReports(data);
      } catch (err) {
        console.log(err);
        setError("Server tidak terhubung");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "border-yellow-400 text-yellow-600 bg-yellow-50";

    case "diproses":
      return "border-orange-400 text-orange-600 bg-orange-50";

    case "ditolak":
      return "border-red-400 text-red-600 bg-red-50";

    case "selesai":
      return "border-green-400 text-green-600 bg-green-50";

    default:
      return "border-gray-300 text-gray-600 bg-gray-50";
  }
};

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

          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-[6px] border-[#0B6B2B]">
            <p className="text-gray-500 font-medium">TOTAL LAPORAN</p>
            <h2 className="text-5xl font-bold mt-4">{reports.length}</h2>
            <FileText className="text-[#0B6B2B] mt-4" />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-[6px] border-yellow-500">
            <p className="text-gray-500 font-medium">MENUNGGU</p>
            <h2 className="text-5xl font-bold mt-4">
              {reports.filter(r => r.status === "pending").length}
            </h2>
            <Clock3 className="text-yellow-600 mt-4" />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-[6px] border-orange-500">
            <p className="text-gray-500 font-medium">PROSES</p>
            <h2 className="text-5xl font-bold mt-4">
              {reports.filter(r => r.status === "diproses").length}
            </h2>
            <LoaderCircle className="text-orange-500 mt-4" />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-[6px] border-green-500">
            <p className="text-gray-500 font-medium">SELESAI</p>
            <h2 className="text-5xl font-bold mt-4">
              {reports.filter(r => r.status === "selesai").length}
            </h2>
            <CheckCircle2 className="text-green-500 mt-4" />
          </div>

        </div>

        {/* TABLE */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

          {/* LAPORAN TABLE */}
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

            {/* LOADING */}
            {loading && (
              <div className="p-10 text-center text-gray-500">
                Loading data...
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="p-10 text-center text-red-500">
                {error}
              </div>
            )}

            {/* TABLE */}
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead className="text-left text-gray-500">
                    <tr className="border-b">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">KATEGORI</th>
                      <th className="px-6 py-4">LOKASI</th>
                      <th className="px-6 py-4">STATUS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reports.slice(0, 5).map((report) => (
                      <tr
                        key={report.id}
                        onClick={() =>
                          router.push(`/admin/laporan/${report.id}`)
                        }
                        className="border-b hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-6 py-5 font-bold">
                          #{report.id}
                        </td>

                        <td className="px-6 py-5">
                          {report.category_name}
                        </td>

                        <td className="px-6 py-5 flex items-center gap-2">
                          <MapPin size={16} className="text-gray-400" />
                          {report.lokasi_kejadian}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusStyle(
                              report.status
                            )}`}
                          >
                            {report.status}
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}

          </div>

          {/* KATEGORI */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">

              <h2 className="text-3xl font-bold text-[#0B6B2B]">
                Kategori Laporan
              </h2>

              <div className="mt-8 space-y-6">

                {[
                  "Sampah",
                  "Pencemaran",
                  "Drainase & Banjir",
                  "Penghijauan",
                  "Limbah Berbahaya",
                  "Fasilitas Umum Lingkungan",
                  "Kebersihan Umum",
                  "Lainnya"
                ].map((kategori) => {

                  const totalKategori =
                    reports.filter(
                      (item) =>
                        item.category_name
                          ?.trim()
                          .toLowerCase() ===
                        kategori
                          .trim()
                          .toLowerCase()
                    ).length;

                  const percentage =
                    reports.length > 0
                      ? Math.round(
                          (totalKategori / reports.length) *
                            100
                        )
                      : 0;

                  return (
                    <div key={kategori}>

                      {/* TITLE */}
                      <div className="flex items-center justify-between mb-2">

                        <h3 className="font-semibold text-gray-700">
                          {kategori}
                        </h3>

                        <span className="text-sm font-bold text-[#0B6B2B]">
                          {percentage}%
                        </span>

                      </div>

          {/* BAR */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

            <div
              className="h-full bg-[#0B6B2B] rounded-full transition-all duration-500"
              style={{
                width: `${percentage}%`,
              }}
            />

          </div>

          {/* TOTAL */}
          <p className="text-xs text-gray-400 mt-2">
            {totalKategori} laporan
          </p>

        </div>
      );
    })}

  </div>

</div>

        </div>

      </section>
    </main>
  );
}