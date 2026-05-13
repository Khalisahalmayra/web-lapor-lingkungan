"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/navbar/page";

import {
  Trash2,
  Trees,
  Recycle,
  Droplets,
  Sparkles,
  ThumbsUp,
  MessageCircle,
  Trash,
  Waves,
  TreePine,
  ShieldAlert,
  Wrench,
  ListFilter,
  Clock3,
  TrendingUp,
} from "lucide-react";

export default function BerandaPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeFilter, setActiveFilter] = useState("Terbaru");

  return (
    <>
      <Navbar />

      <main className="relative w-full min-h-screen overflow-hidden bg-white">
        
        {/* HERO SECTION */}
        <section className="relative z-10 flex items-center min-h-screen px-6 lg:px-16 pt-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* LEFT */}
            <div className="max-w-[650px]">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-100 text-[#0B6B2B] font-semibold text-sm">
                🌱 Bersama Menjaga Lingkungan
              </div>

              {/* Title */}
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

              {/* Description */}
              <p className="mt-6 text-base lg:text-lg text-black/70 leading-relaxed">
                Laporkan setiap masalah lingkungan di sekitar anda.
                Bersama kita ciptakan lingkungan yang bersih,
                sehat, dan berkelanjutan.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                
                <Link href="/lapor">
                  <button className="px-7 py-4 rounded-xl bg-[#0B6B2B] text-white shadow-md font-semibold hover:bg-green-800 hover:scale-105 transition">
                    Buat Laporan Sekarang
                  </button>
                </Link>

                <Link href="/lapor">
                  <button className="px-7 py-4 rounded-xl bg-white border border-gray-300 shadow-md text-black font-semibold hover:scale-105 transition">
                    Pelajari Cara Lapor
                  </button>
                </Link>
              </div>
            </div>

            {/* RIGHT IMAGE */}
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

        {/* SECTION LAPORAN TERKINI */}
        <section className="relative z-10 px-6 lg:px-16 pb-20">
          
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            
            {/* SIDEBAR */}
            <div className="bg-[#F5F5F5] rounded-2xl shadow-md p-6 h-fit">
              
              <h2 className="text-2xl font-bold text-[#0B6B2B] mb-6">
                Kategori
              </h2>

              <div className="space-y-3">

                {/* Semua */}
                <button
                  onClick={() => setActiveCategory("Semua")}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold transition-all duration-300 ${
                    activeCategory === "Semua"
                      ? "bg-[#B8CBB8] text-[#0B6B2B] shadow-md scale-[1.02]"
                      : "hover:bg-gray-100 text-[#0B6B2B]"
                  }`}
                >
                  <ListFilter className="w-5 h-5" />
                  Semua
                </button>

                {/* Sampah */}
                <button
                  onClick={() => setActiveCategory("Sampah")}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeCategory === "Sampah"
                      ? "bg-[#B8CBB8] text-[#0B6B2B] shadow-md scale-[1.02]"
                      : "hover:bg-gray-100 text-[#0B6B2B]"
                  }`}
                >
                  <Trash className="w-5 h-5" />
                  Sampah
                </button>

                {/* Pencemaran */}
                <button
                  onClick={() => setActiveCategory("Pencemaran")}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeCategory === "Pencemaran"
                      ? "bg-[#B8CBB8] text-[#0B6B2B] shadow-md scale-[1.02]"
                      : "hover:bg-gray-100 text-[#0B6B2B]"
                  }`}
                >
                  <Waves className="w-5 h-5" />
                  Pencemaran
                </button>

                {/* Drainase */}
                <button
                  onClick={() => setActiveCategory("Drainase")}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeCategory === "Drainase"
                      ? "bg-[#B8CBB8] text-[#0B6B2B] shadow-md scale-[1.02]"
                      : "hover:bg-gray-100 text-[#0B6B2B]"
                  }`}
                >
                  <Droplets className="w-5 h-5" />
                  Drainase & Banjir
                </button>

                {/* Penghijauan */}
                <button
                  onClick={() => setActiveCategory("Penghijauan")}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeCategory === "Penghijauan"
                      ? "bg-[#B8CBB8] text-[#0B6B2B] shadow-md scale-[1.02]"
                      : "hover:bg-gray-100 text-[#0B6B2B]"
                  }`}
                >
                  <TreePine className="w-5 h-5" />
                  Penghijauan
                </button>

                {/* Limbah */}
                <button
                  onClick={() => setActiveCategory("Limbah")}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeCategory === "Limbah"
                      ? "bg-[#B8CBB8] text-[#0B6B2B] shadow-md scale-[1.02]"
                      : "hover:bg-gray-100 text-[#0B6B2B]"
                  }`}
                >
                  <ShieldAlert className="w-5 h-5" />
                  Limbah Berbahaya
                </button>

                {/* Fasilitas */}
                <button
                  onClick={() => setActiveCategory("Fasilitas")}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeCategory === "Fasilitas"
                      ? "bg-[#B8CBB8] text-[#0B6B2B] shadow-md scale-[1.02]"
                      : "hover:bg-gray-100 text-[#0B6B2B]"
                  }`}
                >
                  <Wrench className="w-5 h-5" />
                  Fasilitas Umum Lingkungan
                </button>

                {/* Kebersihan */}
                <button
                  onClick={() => setActiveCategory("Kebersihan")}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeCategory === "Kebersihan"
                      ? "bg-[#B8CBB8] text-[#0B6B2B] shadow-md scale-[1.02]"
                      : "hover:bg-gray-100 text-[#0B6B2B]"
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  Kebersihan Umum
                </button>
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
                    className={`px-5 py-3 rounded-xl border font-semibold flex items-center gap-2 transition-all duration-300 ${
                      activeFilter === "Terbaru"
                        ? "bg-[#E8F0E8] border-black text-black scale-105"
                        : "bg-white border-gray-300 text-black hover:scale-105"
                    }`}
                  >
                    <Clock3 className="w-5 h-5" />
                    Terbaru
                  </button>

                  <button
                    onClick={() => setActiveFilter("Terpopuler")}
                    className={`px-5 py-3 rounded-xl border font-semibold flex items-center gap-2 transition-all duration-300 ${
                      activeFilter === "Terpopuler"
                        ? "bg-[#E8F0E8] border-black text-black scale-105"
                        : "bg-white border-gray-300 text-black hover:scale-105"
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                    Terpopuler
                  </button>
                </div>
              </div>

              {/* CARD */}
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="bg-[#F7F7F7] rounded-2xl shadow-sm p-4 mb-6 hover:shadow-md transition"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
                    
                    {/* IMAGE */}
                    <div className="relative w-full h-[230px] rounded-xl overflow-hidden">
                      <Image
                        src="/image/laporan.png"
                        alt="Laporan"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-col justify-between">
                      
                      <div>
                        
                        <div className="flex items-center justify-between">
                          
                          <span className="px-4 py-1 rounded-full bg-green-100 text-[#0B6B2B] text-sm font-semibold">
                            Sampah
                          </span>

                          <span className="text-sm text-gray-500">
                            8 April 2025
                          </span>
                        </div>

                        <h3 className="mt-4 text-2xl font-bold text-black">
                          Tumpukan Sampah Bikin Sempit Jalan Cimanggis
                        </h3>

                        <p className="text-gray-500 mt-2 text-sm">
                          Samping Superindo, Jalan Raya Bogor Depok, Jawa Barat
                        </p>

                        <p className="mt-5 text-gray-600 leading-relaxed">
                          Harapannya pemerintah segera rapihin aja dong
                          sampah-sampah ini bikinnya gimana, jangan kayak gini.
                          Mau lewat, kita kok kesolong sampah...
                        </p>
                      </div>

                      {/* FOOTER */}
                      <div className="flex items-center justify-between mt-6">
                        
                        <div className="flex items-center gap-6 text-gray-600">
                          
                          {/* LIKE */}
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="w-5 h-5" />
                            <span>42</span>
                          </div>

                          {/* KOMEN */}
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            <span>21</span>
                          </div>
                        </div>

                        <button className="text-[#0B6B2B] font-semibold hover:underline">
                          Lihat Detail Laporan →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION PEDULI LINGKUNGAN */}
        <section className="relative z-10 px-6 lg:px-16 pb-20">
          
          {/* Card Atas */}
          <div className="w-full bg-[#F5F5F5] rounded-2xl shadow-md p-6 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Text */}
            <div className="max-w-[700px]">
              <h2 className="text-2xl lg:text-4xl font-bold text-[#0B6B2B] leading-snug">
                Mengapa kita harus lebih peduli terhadap lingkungan ?
              </h2>

              <p className="mt-5 text-black/80 text-base lg:text-lg leading-relaxed">
                Kita perlu lebih peduli terhadap lingkungan karena kondisi
                lingkungan yang sehat sangat berpengaruh pada kualitas hidup
                manusia. Kerusakan lingkungan seperti pencemaran dan penumpukan
                sampah dapat berdampak buruk bagi kesehatan dan keberlangsungan
                hidup di masa depan.
              </p>
            </div>

            {/* Icon */}
            <div className="flex items-center justify-center">
              <div className="w-[220px] h-[220px] rounded-full bg-[#5A8516] shadow-lg flex items-center justify-center">
                <Sparkles className="w-24 h-24 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="flex justify-center mt-10">
            <div className="bg-[#FAFAF5] border border-black shadow-md rounded-xl px-8 py-4">
              <h3 className="text-black text-lg lg:text-2xl font-semibold text-center">
                Tips Yang Bisa Kamu Lakukan Untuk Lingkungan
              </h3>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1 */}
            <div className="bg-[#5A8516] rounded-2xl shadow-lg p-5 flex items-center gap-5 hover:scale-[1.02] transition">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-[#5A8516]" />
              </div>

              <div>
                <h4 className="text-white font-bold text-lg">
                  Buang Sampah pada Tempatnya
                </h4>

                <p className="text-white/90 text-sm">
                  Pisahkan sampah organik dan anorganik
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#5A8516] rounded-2xl shadow-lg p-5 flex items-center gap-5 hover:scale-[1.02] transition">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                <Trees className="w-8 h-8 text-[#5A8516]" />
              </div>

              <div>
                <h4 className="text-white font-bold text-lg">
                  Menanam Pohon atau Tanaman
                </h4>

                <p className="text-white/90 text-sm">
                  Membantu menjaga kualitas udara
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#5A8516] rounded-2xl shadow-lg p-5 flex items-center gap-5 hover:scale-[1.02] transition">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                <Recycle className="w-8 h-8 text-[#5A8516]" />
              </div>

              <div>
                <h4 className="text-white font-bold text-lg">
                  Kurangi Penggunaan Plastik
                </h4>

                <p className="text-white/90 text-sm">
                  Gunakan tas belanja dan botol reusable
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#5A8516] rounded-2xl shadow-lg p-5 flex items-center gap-5 hover:scale-[1.02] transition">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                <Droplets className="w-8 h-8 text-[#5A8516]" />
              </div>

              <div>
                <h4 className="text-white font-bold text-lg">
                  Hemat Air dan Listrik
                </h4>

                <p className="text-white/90 text-sm">
                  Gunakan seperlunya untuk mengurangi pemborosan
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}