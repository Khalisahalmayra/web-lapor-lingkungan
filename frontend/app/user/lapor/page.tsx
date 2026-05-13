"use client";

import Image from "next/image";
import Navbar from "../../components/navbar/page";

import {
  CalendarDays,
  Upload,
  ChevronDown,
} from "lucide-react";

export default function LaporPage() {
  return (
    <>
      <Navbar />

      <main className="w-full min-h-screen bg-[#f5f5f5] pb-20">
        
        {/* HERO */}
        <section className="relative overflow-hidden px-6 lg:px-16 py-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
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
                <button className="px-7 py-4 rounded-xl bg-[#0B6B2B] text-white shadow-md font-semibold hover:bg-green-800 hover:scale-105 transition">
                  Buat Laporan Sekarang
                </button>

                <button className="px-7 py-4 rounded-xl bg-white border border-gray-300 shadow-md text-black font-semibold hover:scale-105 transition">
                  Pelajari Cara Lapor
                </button>
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

        {/* CARA PENGGUNAAN */}
        <section className="px-6 lg:px-16 mt-8">
          
          <h2 className="text-center text-2xl lg:text-4xl font-bold text-[#0B6B2B] mb-10">
            Bagaimana Cara Menggunakannya ?
          </h2>

          <div className="bg-[#567d18] rounded-3xl p-6 lg:p-10 shadow-lg">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              
              {[
                "Isi Laporan",
                "Berikan bukti yang valid",
                "Kirim Laporan",
                "Pantau Status Laporan",
                "Pelajari Cara Merawat Lingkungan",
              ].map((item, index) => (
                
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 flex flex-col items-center text-center min-h-[220px] shadow-md hover:scale-[1.02] transition"
                >
                  
                  {/* ANGKA */}
                  <div className="w-16 h-16 rounded-full bg-[#0B6B2B] text-white flex items-center justify-center text-2xl font-bold">
                    {index + 1}
                  </div>

                  {/* TEXT */}
                  <p className="mt-6 text-black font-semibold leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FORM LAPORAN */}
        <section className="px-6 lg:px-16 mt-16">
          
          <div className="bg-[#006b1a] rounded-xl p-5 lg:p-10 shadow-lg">
            
            {/* HEADER */}
            <div className="bg-white rounded-lg px-6 py-4 flex items-center gap-4">
              
              <div className="w-5 h-5 rounded-full bg-[#0B6B2B]" />

              <h2 className="text-xl lg:text-3xl font-bold text-black">
                Sampaikan Laporan Anda
              </h2>
            </div>

            {/* FORM */}
            <form className="mt-10 space-y-8">
              
              {/* JUDUL */}
              <div>
                <label className="block text-white font-semibold text-lg mb-3">
                  Judul Laporan
                </label>

                <input
                  type="text"
                  placeholder="Ketik Judul Laporan Anda"
                  className="w-full border border-green-300 bg-transparent rounded-lg px-5 py-4 text-white placeholder:text-gray-300 outline-none"
                />
              </div>

              {/* DESKRIPSI */}
              <div>
                <label className="block text-white font-semibold text-lg mb-3">
                  Laporan Anda
                </label>

                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
                  
                  {/* UPLOAD */}
                  <label className="border border-green-300 rounded-lg min-h-[220px] flex flex-col items-center justify-center text-white cursor-pointer hover:bg-white/5 transition">
                    
                    <Upload size={70} />

                    <p className="mt-4 text-lg">
                      Kirim Gambar
                    </p>

                    <input type="file" className="hidden" />
                  </label>

                  {/* TEXTAREA */}
                  <textarea
                    placeholder="Ketik Isi Deskripsi Laporan Anda"
                    className="border border-green-300 rounded-lg bg-transparent p-5 min-h-[220px] text-white placeholder:text-gray-300 outline-none resize-none"
                  />
                </div>
              </div>

              {/* TANGGAL */}
              <div>
                <label className="block text-white font-semibold text-lg mb-3">
                  Tanggal Kejadian
                </label>

                <div className="relative">
                  
                  <input
                    type="date"
                    className="w-full border border-green-300 bg-transparent rounded-lg px-5 py-4 text-white outline-none appearance-none"
                  />

                  <CalendarDays
                    size={24}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white pointer-events-none"
                  />
                </div>
              </div>

              {/* LOKASI */}
              <div>
                <label className="block text-white font-semibold text-lg mb-3">
                  Lokasi Kejadian
                </label>

                <input
                  type="text"
                  placeholder="Pilih Lokasi Kejadian"
                  className="w-full border border-green-300 bg-transparent rounded-lg px-5 py-4 text-white placeholder:text-gray-300 outline-none"
                />
              </div>

              {/* KATEGORI */}
              <div>
                <label className="block text-white font-semibold text-lg mb-3">
                  Kategori Laporan
                </label>

                <div className="relative">
                  
                  <select className="w-full border border-green-300 bg-transparent rounded-lg px-5 py-4 text-white outline-none appearance-none">
                    
                    <option className="text-black">
                      Pilih Kategori
                    </option>

                    <option className="text-black">
                      Sampah
                    </option>

                    <option className="text-black">
                      Pencemaran Air
                    </option>

                    <option className="text-black">
                      Pencemaran Udara
                    </option>

                    <option className="text-black">
                      Penebangan Liar
                    </option>
                  </select>

                  <ChevronDown
                    size={22}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white pointer-events-none"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex justify-end pt-5">
                
                <button
                  type="submit"
                  className="bg-white text-black font-bold px-10 py-4 rounded-lg shadow-md hover:scale-105 transition"
                >
                  Kirim Laporan
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}