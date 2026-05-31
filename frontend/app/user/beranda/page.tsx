"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/page";

import {
  Trash2,
  Trees,
  Recycle,
  Droplets,
  Sparkles,
  ThumbsUp,
  MessageCircle,
  ListFilter,
  Clock3,
  TrendingUp,
  Factory,
  ShieldAlert,
  Building2,
  Waves,
} from "lucide-react";

export default function BerandaPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeFilter, setActiveFilter] = useState("Terbaru");

  const [laporan, setLaporan] = useState<any[]>([]);
  const [kategori, setKategori] = useState<any[]>([]);

  // =========================
  // ICON KATEGORI
  // =========================
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Sampah":
        return <Trash2 className="w-5 h-5" />;

      case "Pencemaran":
        return <Factory className="w-5 h-5" />;

      case "Drainase & Banjir":
        return <Waves className="w-5 h-5" />;

      case "Penghijauan":
        return <Trees className="w-5 h-5" />;

      case "Limbah Berbahaya":
        return <ShieldAlert className="w-5 h-5" />;

      case "Fasilitas Umum Lingkungan":
        return <Building2 className="w-5 h-5" />;

      case "Kebersihan Umum":
        return <Recycle className="w-5 h-5" />;

      default:
        return <ListFilter className="w-5 h-5" />;
    }
  };

  // =========================
  // GET LAPORAN
  // =========================
  useEffect(() => {
    fetch("http://localhost:5000/api/laporan")
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA LAPORAN:", data);

        if (Array.isArray(data)) {
          setLaporan(data);
        } else if (Array.isArray(data.data)) {
          setLaporan(data.data);
        } else {
          setLaporan([]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // =========================
  // GET KATEGORI
  // =========================
  useEffect(() => {
    fetch("http://localhost:5000/api/kategori")
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA KATEGORI:", data);

        if (Array.isArray(data)) {
          setKategori(data);
        } else if (Array.isArray(data.data)) {
          setKategori(data.data);
        } else {
          setKategori([]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // =========================
  // FILTER LAPORAN
  // =========================
  let filteredLaporan =
    activeCategory === "Semua"
      ? laporan
      : laporan.filter(
          (item) =>
            item.category_name === activeCategory
        );

  // =========================
  // FILTER TERBARU
  // =========================
  if (activeFilter === "Terbaru") {
    filteredLaporan = [...filteredLaporan].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
  }

  // =========================
  // FILTER TERPOPULER
  // =========================
  if (activeFilter === "Terpopuler") {
    filteredLaporan = [...filteredLaporan].sort(
      (a, b) =>
        (b.total_like || 0) -
        (a.total_like || 0)
    );
  }

  return (
    <>
      <Navbar />

      <main className="relative w-full min-h-screen overflow-hidden bg-white">

        {/* HERO */}
        <section className="relative z-10 flex items-center min-h-screen px-6 lg:px-16 pt-10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

            {/* LEFT */}
            <div className="max-w-[650px]">

              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-100 text-[#0B6B2B] font-semibold text-sm">
                🌱 Bersama Menjaga Lingkungan
              </div>

              <h1 className="mt-6 text-4xl lg:text-6xl font-bold leading-tight text-black">
                Laporkan Masalah
                <br />
                Lingkungan
                <br />
                <span className="text-[#0B6B2B]">
                  dengan Mudah
                  <br />
                  dan Cepat
                </span>
              </h1>

              <p className="mt-6 text-base lg:text-lg text-black/70 leading-relaxed">
                Laporkan setiap masalah lingkungan di sekitar anda.
                Bersama kita ciptakan lingkungan yang bersih,
                sehat, dan berkelanjutan.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">

                <Link href="/user/lapor">
                  <button className="px-7 py-4 rounded-xl bg-[#0B6B2B] text-white shadow-md font-semibold hover:bg-green-800 hover:scale-105 transition">
                    Buat Laporan Sekarang
                  </button>
                </Link>

                <Link href="/user/lapor">
                  <button className="px-7 py-4 rounded-xl bg-white border border-gray-300 shadow-md text-black font-semibold hover:scale-105 transition">
                    Pelajari Cara Lapor
                  </button>
                </Link>

              </div>
            </div>

            {/* IMAGE */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-[600px] h-[450px]">
                <Image
                  src="/image/pohon.png"
                  alt="Hero"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ===================================== */}
        {/* SECTION PEDULI LINGKUNGAN */}
        {/* ===================================== */}
        <section className="relative z-10 px-6 lg:px-16 pb-20">

          {/* CARD */}
          <div className="w-full bg-[#F5F5F5] rounded-2xl shadow-md p-6 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">

            {/* TEXT */}
            <div className="max-w-[700px]">
              <h2 className="text-2xl lg:text-4xl font-bold text-[#0B6B2B] leading-snug">
                Mengapa kita harus lebih peduli terhadap lingkungan ?
              </h2>

              <p className="mt-5 text-black/80 text-base lg:text-lg leading-relaxed">
                Kita perlu lebih peduli terhadap lingkungan karena kondisi
                lingkungan yang sehat sangat berpengaruh pada kualitas hidup
                manusia.
              </p>
            </div>

            {/* ICON */}
            <div className="flex items-center justify-center">
              <div className="w-[220px] h-[220px] rounded-full bg-[#5A8516] shadow-lg flex items-center justify-center">
                <Sparkles className="w-24 h-24 text-white" />
              </div>
            </div>

          </div>
        </section>

        {/* ===================================== */}
        {/* SECTION LAPORAN */}
        {/* ===================================== */}
        <section className="relative z-10 px-6 lg:px-16 pb-20">

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

            {/* SIDEBAR */}
            <div className="bg-[#F5F5F5] rounded-2xl shadow-md p-6 h-fit sticky top-24">

              <h2 className="text-2xl font-bold text-[#0B6B2B] mb-6">
                Kategori
              </h2>

              <div className="space-y-3">

                {/* SEMUA */}
                <button
                  onClick={() => setActiveCategory("Semua")}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold transition-all duration-300 ${
                    activeCategory === "Semua"
                      ? "bg-[#B8CBB8] text-[#0B6B2B]"
                      : "hover:bg-gray-100 text-[#0B6B2B]"
                  }`}
                >
                  <ListFilter className="w-5 h-5" />
                  Semua
                </button>

                {/* KATEGORI */}
                {kategori.length > 0 ? (
                  kategori.map((item) => (
                    <button
                      key={item.id}
                      onClick={() =>
                        setActiveCategory(item.category_name)
                      }
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all duration-300 ${
                        activeCategory === item.category_name
                          ? "bg-[#B8CBB8] text-[#0B6B2B]"
                          : "hover:bg-gray-100 text-[#0B6B2B]"
                      }`}
                    >
                      {getCategoryIcon(item.category_name)}

                      {item.category_name}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    Kategori belum ada
                  </p>
                )}

              </div>
            </div>

            {/* CONTENT */}
            <div>

              {/* HEADER */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

                <div>
                  <h2 className="text-3xl font-bold text-black">
                    Laporan Terkini
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Pantau dan dukung perbaikan lingkungan sekitar mu.
                  </p>
                </div>

                {/* FILTER */}
                <div className="flex gap-3">

                  <button
                    onClick={() => setActiveFilter("Terbaru")}
                    className={`px-5 py-3 text-black rounded-xl border font-semibold flex items-center gap-2 ${
                      activeFilter === "Terbaru"
                        ? "bg-[#E8F0E8] border-black"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <Clock3 className="w-5 h-5" />
                    Terbaru
                  </button>

                  <button
                    onClick={() => setActiveFilter("Terpopuler")}
                    className={`px-5 py-3 rounded-xl text-black border font-semibold flex items-center gap-2 ${
                      activeFilter === "Terpopuler"
                        ? "bg-[#E8F0E8] border-black"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                    Terpopuler
                  </button>

                </div>
              </div>

              {/* DATA KOSONG */}
              {filteredLaporan.length === 0 && (
                <div className="bg-[#F5F5F5] rounded-2xl p-10 text-center text-gray-500">
                  Belum ada laporan
                </div>
              )}

              {/* CARD */}
              {filteredLaporan.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#F7F7F7] rounded-2xl shadow-sm p-4 mb-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">

                    {/* IMAGE */}
                    <div className="relative w-full h-[230px] rounded-xl overflow-hidden">
                        {item.gambar ? (
                          <img
                            src={`http://localhost:5000/uploads/${item.gambar}`}
                            alt="Laporan"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src="/image/laporan.png"
                            alt="Laporan"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-col justify-between">

                      <div>

                        <div className="flex items-center justify-between">

                          <span className="px-4 py-1 rounded-full bg-green-100 text-[#0B6B2B] text-sm font-semibold">
                            {item.category_name}
                          </span>

                          <span className="text-sm text-gray-500">
                            {new Date(
                              item.created_at
                            ).toLocaleDateString("id-ID")}
                          </span>

                        </div>

                        <h3 className="mt-4 text-2xl font-bold text-black">
                          {item.judul_laporan}
                        </h3>

                        <p className="text-gray-500 mt-2 text-sm">
                          {item.lokasi_kejadian}
                        </p>

                        <p className="text-sm text-[#0B6B2B] mt-2 font-medium">
                          Dilaporkan oleh {item.username}
                        </p>

                        <p className="mt-5 text-gray-600 leading-relaxed line-clamp-3">
                          {item.isi_laporan}
                        </p>

                      </div>

                      {/* FOOTER */}
                      <div className="flex items-center justify-between mt-6">

                        <div className="flex items-center gap-6 text-gray-600">

                          <div className="flex items-center gap-2">
                            <ThumbsUp className="w-5 h-5" />
                            <span>{item.total_like || 0}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            <span>{item.total_komen || 0}</span>
                          </div>

                        </div>

                        <Link
                          href={`/user/detail-laporan/${item.id}`}
                          className="text-[#0B6B2B] font-semibold hover:underline"
                        >
                          Lihat Detail Laporan →
                        </Link>

                      </div>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>
      </main>
    </>
  );
}