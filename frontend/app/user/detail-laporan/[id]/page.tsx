"use client";

import Image from "next/image";
import Navbar from "@/app/components/navbar/page";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  ThumbsUp,
  Share2,
  Send,
  MessageCircle,
  MapPin,
  CalendarDays,
  Phone,
} from "lucide-react";

export default function DetailLaporanPage() {
  const params = useParams();
  const id = params.id;

  const [laporan, setLaporan] = useState<any>(null);
  const [laporanSerupa, setLaporanSerupa] = useState<any[]>([]);
  const [komentar, setKomentar] = useState<any[]>([]);
  const [isiKomentar, setIsiKomentar] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/api/laporan/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const detail = data.data || data;
        setLaporan(detail);

        fetch("http://localhost:5000/api/laporan")
          .then((res) => res.json())
          .then((laporanData) => {
            const semuaLaporan = Array.isArray(laporanData)
              ? laporanData
              : laporanData.data || [];

            const filtered = semuaLaporan.filter(
              (item: any) =>
                item.id !== detail.id &&
                item.category_name === detail.category_name
            );

            setLaporanSerupa(filtered.slice(0, 4));
          });
      })
      .catch(console.log);
  }, [id]);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/api/komentar/laporan/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setKomentar(data);
        else if (Array.isArray(data.data)) setKomentar(data.data);
        else setKomentar([]);
      })
      .catch(console.log);
  }, [id]);

  if (!laporan) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
          <h1 className="text-2xl font-bold text-black">Loading...</h1>
        </main>
      </>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: laporan.judul_laporan,
        text: laporan.isi_laporan,
        url: window.location.href,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleKirimKomentar = async () => {
    if (!isiKomentar.trim()) {
      alert("Komentar tidak boleh kosong");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await fetch(
        "http://localhost:5000/api/komentar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            laporan_id: id,
            user_id: user.id,
            isi_komentar: isiKomentar,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setKomentar((prev) => [
          ...prev,
          data.data || {
            isi_komentar: isiKomentar,
            username: user.username || "User",
            created_at: new Date(),
          },
        ]);

        setIsiKomentar("");
        alert("Komentar berhasil dikirim");
      } else {
        alert(data.message || "Gagal mengirim komentar");
      }
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F5F5F5] px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

          {/* LEFT */}
          <div>

            {/* HEADER */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">

              <div className="flex justify-between flex-wrap gap-4">

                <span className="px-4 py-2 rounded-full bg-[#DDEBDD] text-[#0B6B2B] font-semibold text-sm">
                  {laporan.category_name}
                </span>

                <div className="flex items-center gap-2 text-sm text-black">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(laporan.created_at).toLocaleDateString("id-ID")}
                </div>
              </div>

              <h1 className="mt-5 text-3xl font-bold text-black">
                {laporan.judul_laporan}
              </h1>

              <div className="mt-6 border rounded-2xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#0B6B2B] flex items-center justify-center text-white font-bold text-xl">
                  {laporan.username?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">Dilaporkan Oleh</p>
                  <p>{laporan.username}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                {laporan.lokasi_kejadian}
              </div>
            </div>

            {/* IMAGE */}
            <div className="relative mt-6 w-full h-[500px] rounded-2xl overflow-hidden">
              <Image
                src={laporan.gambar || "/image/laporan.png"}
                alt="Laporan"
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            {/* DESKRIPSI */}
            <div className="mt-6 bg-[#005F18] rounded-2xl p-6">

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#005F18]" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Detail Deskripsi Laporan
                </h2>
              </div>

              <div className="mt-6 border border-white rounded-2xl p-6">
                <p className="text-white whitespace-pre-line">
                  {laporan.isi_laporan}
                </p>
              </div>

              <div className="flex gap-5 mt-8">

                <button className="px-10 py-4 rounded-xl bg-white text-black font-bold flex items-center gap-3">
                  <ThumbsUp className="w-5 h-5" />
                  Dukung ({laporan.total_like || 0})
                </button>

                <button
                  onClick={handleShare}
                  className="px-10 py-4 rounded-xl bg-white text-black font-bold flex items-center gap-3"
                >
                  <Share2 className="w-5 h-5" />
                  Bagikan
                </button>

              </div>
            </div>

            {/* KOMENTAR */}
            <div className="mt-10 bg-white rounded-2xl p-6 border">

              <h2 className="text-3xl font-bold">Komentar</h2>

              <div className="flex gap-5 mt-8">

                <div className="w-14 h-14 rounded-full bg-[#0B6B2B]" />

                <div className="flex-1">

                  <textarea
                    value={isiKomentar}
                    onChange={(e) => setIsiKomentar(e.target.value)}
                    className="w-full h-[120px] border rounded-2xl p-5"
                    placeholder="Tulis komentar..."
                  />

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleKirimKomentar}
                      className="px-10 py-3 rounded-xl bg-[#005F18] text-white flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Kirim
                    </button>
                  </div>

                </div>
              </div>

              {komentar.length === 0 && (
                <p className="text-center mt-8 text-gray-500">
                  Belum ada komentar
                </p>
              )}

              {komentar.map((item, index) => (
                <div key={index} className="flex gap-5 mt-8">

                  <div className="w-14 h-14 rounded-full bg-[#0B6B2B] flex items-center justify-center text-white font-bold">
                    {item.username?.charAt(0) || "U"}
                  </div>

                  <div className="flex-1 border rounded-2xl p-5">
                    <h3 className="font-bold">{item.username}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </p>
                    <p className="mt-3">{item.isi_komentar}</p>
                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            <div className="bg-white rounded-2xl p-6">

              <h2 className="text-2xl font-bold mb-6">
                Laporan Serupa
              </h2>

              {laporanSerupa.map((item) => (
                <Link
                  key={item.id}
                  href={`/user/detail-laporan/${item.id}`}
                >
                  <div className="flex gap-4 mb-5">
                    <Image
                      src={item.gambar || "/image/laporan.png"}
                      alt=""
                      width={90}
                      height={90}
                      className="rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-bold">{item.judul_laporan}</h3>
                      <p className="text-sm">{item.lokasi_kejadian}</p>
                    </div>
                  </div>
                </Link>
              ))}

            </div>

            <div className="bg-[#5A8516] p-6 rounded-2xl text-white">

              <h2 className="text-2xl font-bold">
                Butuh Laporan Segera?
              </h2>

              <p className="mt-3">
                Hubungi layanan darurat lingkungan hidup.
              </p>

              <button className="mt-6 w-full bg-white text-black py-3 rounded-xl flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Hubungi Kami
              </button>

            </div>

          </div>

        </div>
      </main>
    </>
  );
}