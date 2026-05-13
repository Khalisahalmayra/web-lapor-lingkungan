import Image from "next/image";
import Navbar from "@/app/components/navbar/page";

import {
  ThumbsUp,
  Share2,
  Send,
} from "lucide-react";

export default function DetailLaporanPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F5F5F5] px-6 lg:px-10 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          
          {/* LEFT CONTENT */}
          <div>
            
            {/* HEADER */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              
              <div className="flex items-center justify-between">
                
                <span className="px-4 py-2 rounded-full bg-[#DDEBDD] text-[#0B6B2B] font-semibold text-sm">
                  Sampah
                </span>

                <p className="text-sm text-black">
                  8 April 2025
                </p>
              </div>

              <h1 className="mt-5 text-4xl font-bold text-black leading-snug">
                Tumpukan Sampah Bikin Sempit Jalan Cimanggis
              </h1>

              {/* USER */}
              <div className="mt-6 border border-gray-300 rounded-2xl p-4 flex items-center gap-4">
                
                <div className="w-14 h-14 rounded-full bg-gray-300" />

                <div>
                  <p className="font-semibold text-black">
                    Dilaporkan Oleh
                  </p>

                  <p className="text-black">
                    Sara Kim
                  </p>
                </div>
              </div>
            </div>

            {/* IMAGE */}
            <div className="relative mt-6 w-full h-[500px] rounded-2xl overflow-hidden shadow-sm">
              <Image
                src="/image/laporan.png"
                alt="Laporan"
                fill
                className="object-cover"
              />
            </div>

            {/* DESKRIPSI */}
            <div className="mt-6 bg-[#005F18] rounded-2xl p-6">
              
              {/* TITLE */}
              <div className="flex items-center gap-4">
                
                <div className="w-10 h-10 rounded-full bg-white" />

                <h2 className="text-3xl font-bold text-white">
                  Detail Deskripsi Laporan
                </h2>
              </div>

              {/* BOX */}
              <div className="mt-6 border border-white rounded-2xl p-6">
                
                <p className="text-white text-lg leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                  ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <br />

                <p className="text-white text-lg leading-relaxed">
                  Harapannya Pemerintah segera rapihin aja dong
                  sampah-sampah ini bikinnya gimana, jangan kayak gini.
                  Mau lewat, kita kok kehilangan sampah.
                </p>
              </div>

              {/* BUTTON */}
              <div className="flex flex-wrap gap-5 mt-8">
                
                {/* DUKUNG */}
                <button className="px-10 py-4 rounded-xl bg-white text-black font-bold flex items-center gap-3 hover:scale-105 transition">
                  <ThumbsUp className="w-5 h-5" />
                  Dukung (42)
                </button>

                {/* BAGIKAN */}
                <button className="px-10 py-4 rounded-xl bg-white text-black font-bold flex items-center gap-3 hover:scale-105 transition">
                  <Share2 className="w-5 h-5" />
                  Bagikan
                </button>
              </div>
            </div>

            {/* KOMENTAR */}
            <div className="mt-10 bg-white rounded-2xl p-6 border border-gray-300">
              
              <h2 className="text-4xl font-bold text-black">
                Komentar
              </h2>

              {/* INPUT */}
              <div className="flex gap-5 mt-8">
                
                <div className="w-14 h-14 rounded-full bg-gray-300 flex-shrink-0" />

                <div className="flex-1">
                  
                  <textarea
                    placeholder="Tulis Komentar Anda . . ."
                    className="w-full h-[120px] rounded-2xl border border-gray-400 p-5 outline-none resize-none text-black"
                  />

                  <div className="flex justify-end mt-4">
                    <button className="px-10 py-3 rounded-xl bg-[#005F18] text-white font-semibold hover:bg-green-800 transition flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Kirim
                    </button>
                  </div>
                </div>
              </div>

              {/* COMMENT ITEM */}
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="flex gap-5 mt-8"
                >
                  
                  <div className="w-14 h-14 rounded-full bg-gray-300 flex-shrink-0" />

                  <div className="flex-1 border border-gray-400 rounded-2xl p-5">
                    
                    <div className="flex items-center justify-between">
                      
                      <h3 className="font-bold text-2xl text-black">
                        Kanaya
                      </h3>

                      <p className="text-black">
                        1 jam yang lalu
                      </p>
                    </div>

                    <p className="mt-4 text-black text-lg leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore
                      magna aliqua.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            
            {/* LAPORAN SERUPA */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              
              <h2 className="text-3xl font-bold text-black mb-6">
                Laporan Serupa
              </h2>

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex gap-4 mb-6 last:mb-0"
                >
                  
                  <div className="w-[90px] h-[90px] rounded-xl bg-gray-300 flex-shrink-0" />

                  <div>
                    <h3 className="font-bold text-lg leading-snug text-black">
                      Saluran Air Tersumbat
                    </h3>

                    <p className="text-black mt-2">
                      Jln. Kelapa Dua, Depok, Jawa Barat
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* BANTUAN */}
            <div className="bg-[#5A8516] rounded-2xl p-6">
              
              <h2 className="text-3xl font-bold text-white leading-snug">
                Butuh Laporan Segera ?
              </h2>

              <p className="mt-4 text-white text-lg leading-relaxed">
                Hubungi layanan darurat lingkungan hidup untuk penanganan
                limbah berbahaya.
              </p>

              <button className="w-full mt-8 py-4 rounded-xl bg-white text-black font-bold hover:scale-[1.02] transition">
                Hubungi Kami
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}