"use client";

import Image from "next/image";
import Navbar from "../../components/navbar/page";

import {
  CalendarDays,
  Upload,
  ChevronDown,
  X,
  CheckCircle,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

// =====================
// INTERFACE KATEGORI
// =====================
interface Kategori {
  id: number;
  category_name: string;
}

export default function LaporPage() {

  // =====================
  // STATE FORM
  // =====================
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [kategori, setKategori] = useState("");

  const [gambar, setGambar] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [kategoriList, setKategoriList] =
    useState<Kategori[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  // =====================
  // FETCH KATEGORI
  // =====================
  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/api/kategori"
      );

      if (!res.ok) {
        throw new Error(
          "Gagal mengambil kategori"
        );
      }

      const data = await res.json();

      setKategoriList(data);

    } catch (error) {

      console.log(error);

      setMessage(
        "Kategori gagal dimuat"
      );
    }
  };

  // =====================
  // HANDLE FILE
  // =====================
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (file) {

      setGambar(file);

      const imageUrl =
        URL.createObjectURL(file);

      setPreview(imageUrl);
    }
  };

  // =====================
  // REMOVE IMAGE
  // =====================
  const handleRemoveImage = () => {

    setGambar(null);
    setPreview("");
  };

  // =====================
  // HANDLE SUBMIT
  // =====================
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {

      const token =
        localStorage.getItem("token");

      console.log("TOKEN :", token);

      if (!token) {

        throw new Error(
          "Silakan login terlebih dahulu"
        );
      }

      // =====================
      // CONVERT IMAGE
      // =====================
      let imageBase64 = "";

      if (gambar) {

        imageBase64 =
          await new Promise<string>(
            (resolve, reject) => {

              const reader =
                new FileReader();

              reader.readAsDataURL(
                gambar
              );

              reader.onload = () => {
                resolve(
                  reader.result as string
                );
              };

              reader.onerror = (
                error
              ) => {
                reject(error);
              };
            }
          );
      }

      // =====================
      // REQUEST BODY
      // =====================
      const payload = {
        judul_laporan: judul,
        isi_laporan: isi,
        gambar: imageBase64,
        tanggal_kejadian: tanggal,
        lokasi_kejadian: lokasi,
        kategori_id: Number(kategori),
      };

      console.log("PAYLOAD :", payload);

      // =====================
      // FETCH API
      // =====================
      const res = await fetch(
        "http://localhost:5000/api/laporan",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      // =====================
      // RESPONSE TEXT
      // =====================
      const text =
        await res.text();

      console.log(
        "RAW RESPONSE :",
        text
      );

      let data;

      try {

        data = JSON.parse(text);

      } catch {

        throw new Error(
          "Response backend bukan JSON"
        );
      }

      console.log("DATA :", data);

      if (!res.ok) {

        throw new Error(
          data.message ||
          "Gagal mengirim laporan"
        );
      }

      // =====================
      // SUCCESS
      // =====================
      setShowModal(true);

      // RESET
      setJudul("");
      setIsi("");
      setTanggal("");
      setLokasi("");
      setKategori("");

      setGambar(null);
      setPreview("");

    } catch (err: any) {

      console.log(
        "ERROR SUBMIT :",
        err
      );

      setMessage(
        err.message ||
        "Terjadi kesalahan"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* =====================
          MODAL SUCCESS
      ===================== */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5">

          <div className="bg-white rounded-3xl max-w-[500px] w-full p-8 relative">

            {/* CLOSE */}
            <button
              onClick={() =>
                setShowModal(false)
              }
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
            >
              <X size={18} />
            </button>

            {/* ICON */}
            <div className="flex justify-center">

              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">

                <CheckCircle
                  size={60}
                  className="text-green-600"
                />

              </div>
            </div>

            {/* TEXT */}
            <h2 className="text-3xl font-bold text-center text-[#0B6B2B] mt-6">

              Laporan Berhasil Dikirim

            </h2>

            <p className="text-center text-gray-600 leading-relaxed mt-5 text-lg">

              Laporan anda sudah berhasil dikirim.
              Silahkan tunggu proses verifikasi admin 🌱

            </p>

            {/* BUTTON */}
            <div className="mt-8 flex justify-center">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="bg-[#0B6B2B] hover:bg-green-800 text-white font-bold px-8 py-4 rounded-xl transition"
              >
                Tutup
              </button>

            </div>
          </div>
        </div>
      )}

      <main className="w-full min-h-screen bg-[#f5f5f5] pb-20">

        {/* HERO */}
        <section className="relative overflow-hidden px-6 lg:px-16 py-16">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

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

            </div>

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

        {/* =====================
            CARA PENGGUNAAN
        ===================== */}
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

                  <div className="w-16 h-16 rounded-full bg-[#0B6B2B] text-white flex items-center justify-center text-2xl font-bold">

                    {index + 1}

                  </div>

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

            <div className="bg-white rounded-lg px-6 py-4 flex items-center gap-4">

              <div className="w-5 h-5 rounded-full bg-[#0B6B2B]" />

              <h2 className="text-xl lg:text-3xl font-bold text-black">

                Sampaikan Laporan Anda

              </h2>

            </div>

            {/* ERROR MESSAGE */}
            {message && (

              <div className="mt-5 bg-red-500 text-white p-4 rounded-xl font-semibold">

                {message}

              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-8"
            >

              {/* JUDUL */}
              <div>

                <label className="block text-white font-semibold text-lg mb-3">

                  Judul Laporan

                </label>

                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) =>
                    setJudul(e.target.value)
                  }
                  className="w-full border border-green-300 bg-transparent rounded-lg px-5 py-4 text-white outline-none"
                />

              </div>

              {/* UPLOAD + DESKRIPSI */}
              <div>

                <label className="block text-white font-semibold text-lg mb-3">

                  Laporan Anda

                </label>

                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">

                  {/* UPLOAD IMAGE */}
                  <label className="relative border border-green-300 rounded-lg min-h-[220px] overflow-hidden flex flex-col items-center justify-center text-white cursor-pointer hover:bg-white/5 transition">

                    {preview ? (

                      <>
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveImage();
                          }}
                          className="absolute top-3 right-3 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition"
                        >
                          <X size={18} />
                        </button>
                      </>

                    ) : (

                      <div className="flex flex-col items-center justify-center">

                        <Upload size={70} />

                        <p className="mt-4 text-lg">

                          Kirim Gambar

                        </p>

                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                  </label>

                  {/* TEXTAREA */}
                  <textarea
                    required
                    value={isi}
                    onChange={(e) =>
                      setIsi(e.target.value)
                    }
                    className="border border-green-300 rounded-lg bg-transparent p-5 min-h-[220px] text-white outline-none"
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
                    required
                    value={tanggal}
                    onChange={(e) =>
                      setTanggal(e.target.value)
                    }
                    className="w-full border border-green-300 bg-transparent rounded-lg px-5 py-4 text-white outline-none"
                  />

                  <CalendarDays className="absolute right-5 top-1/2 -translate-y-1/2 text-white" />

                </div>
              </div>

              {/* LOKASI */}
              <div>

                <label className="block text-white font-semibold text-lg mb-3">

                  Lokasi Kejadian

                </label>

                <input
                  type="text"
                  required
                  value={lokasi}
                  onChange={(e) =>
                    setLokasi(e.target.value)
                  }
                  className="w-full border border-green-300 bg-transparent rounded-lg px-5 py-4 text-white outline-none"
                />

              </div>

              {/* KATEGORI */}
              <div>

                <label className="block text-white font-semibold text-lg mb-3">

                  Kategori Laporan

                </label>

                <div className="relative">

                  <select
                    required
                    value={kategori}
                    onChange={(e) =>
                      setKategori(e.target.value)
                    }
                    className="w-full border border-green-300 bg-[#006b1a] rounded-lg px-5 py-4 text-white appearance-none outline-none"
                  >

                    <option
                      value=""
                      className="text-black"
                    >
                      Pilih Kategori
                    </option>

                    {kategoriList.map((item) => (

                      <option
                        key={item.id}
                        value={item.id}
                        className="text-black"
                      >
                        {item.category_name}
                      </option>

                    ))}

                  </select>

                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white" />

                </div>
              </div>

              {/* BUTTON */}
              <div className="flex justify-end pt-5">

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-black font-bold px-10 py-4 rounded-lg shadow-md hover:scale-105 transition disabled:opacity-50"
                >

                  {loading
                    ? "Mengirim..."
                    : "Kirim Laporan"}

                </button>

              </div>

            </form>
          </div>
        </section>
      </main>
    </>
  );
}