"use client";

import Image from "next/image";
import Navbar from "../../components/navbar/page";

import {
  CalendarDays,
  Upload,
  ChevronDown,
  X,
  CheckCircle,
  MapPin,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { getSession } from "next-auth/react";

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

  const [lokasiLoading, setLokasiLoading] =
    useState(false);

  const [errors, setErrors] =
    useState<{
      judul?: string;
      isi?: string;
      gambar?: string;
      tanggal?: string;
      lokasi?: string;
      kategori?: string;
    }>({});

  // =====================
  // REF PETA
  // =====================
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

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
        throw new Error("Gagal mengambil kategori");
      }

      const data = await res.json();
      setKategoriList(data);

    } catch (error) {
      console.log(error);
      setMessage("Kategori gagal dimuat");
    }
  };

  // =====================
  // INIT LEAFLET MAP
  // =====================
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    import("leaflet").then((L) => {
      // Fix default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView([-2.5, 118.0], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const customIcon = L.divIcon({
        className: "",
        html: `<div style="width:28px;height:28px;background:#0B6B2B;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
        iconAnchor: [14, 28],
      });

      map.on("click", async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) map.removeLayer(markerRef.current);
        markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);

        setLokasiLoading(true);
        setLokasi("");

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=id`
          );
          const data = await res.json();
          const addr = data.address || {};

          const parts = [
            addr.village || addr.suburb || addr.quarter,
            addr.city_district || addr.district || addr.county,
            addr.city || addr.town,
            addr.state,
          ].filter(Boolean);

          const locationName =
            parts.length > 0 ? parts.join(", ") : data.display_name;

          setLokasi(locationName);
          setErrors((prev) => ({ ...prev, lokasi: "" }));

        } catch {
          setLokasi(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } finally {
          setLokasiLoading(false);
        }
      });

      leafletMapRef.current = map;
    });
  }, []);

  // =====================
  // HANDLE FILE
  // =====================
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setGambar(file);
      const imageUrl = URL.createObjectURL(file);
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
  // VALIDATE FORM
  // =====================
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!judul.trim()) {
      newErrors.judul = "Judul laporan tidak boleh kosong";
    }

    if (!isi.trim()) {
      newErrors.isi = "Deskripsi laporan tidak boleh kosong";
    }

    if (!gambar) {
      newErrors.gambar = "Gambar laporan tidak boleh kosong";
    }

    if (!tanggal) {
      newErrors.tanggal = "Tanggal kejadian tidak boleh kosong";
    }

    if (!lokasi.trim()) {
      newErrors.lokasi = "Lokasi kejadian tidak boleh kosong";
    }

    if (!kategori) {
      newErrors.kategori = "Kategori laporan tidak boleh kosong";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =====================
  // HANDLE SUBMIT
  // =====================
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setMessage("");

    try {
      const session = await getSession();
      const token =
        (session as any)?.accessToken ||
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("accessToken");

      console.log("SESSION:", session);
      console.log("TOKEN :", token);

      if (!token) {
        throw new Error("Silakan login terlebih dahulu");
      }

      const formData = new FormData();
      formData.append("judul_laporan", judul);
      formData.append("isi_laporan", isi);
      formData.append("tanggal_kejadian", tanggal);
      formData.append("lokasi_kejadian", lokasi);
      formData.append("kategori_id", kategori);
      if (gambar) {
        formData.append("gambar", gambar);
      }

      console.log("FORMDATA SEND", {
        judul_laporan: judul,
        isi_laporan: isi,
        tanggal_kejadian: tanggal,
        lokasi_kejadian: lokasi,
        kategori_id: kategori,
        gambar: gambar?.name,
      });

      const res = await fetch(
        "http://localhost:5000/api/laporan",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      // =====================
      // RESPONSE TEXT
      // =====================
      const text = await res.text();
      console.log("RAW RESPONSE :", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Response backend bukan JSON");
      }

      console.log("DATA :", data);

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengirim laporan");
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

      // Reset marker peta
      if (markerRef.current && leafletMapRef.current) {
        leafletMapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }

    } catch (err: any) {
      console.log("ERROR SUBMIT :", err);
      setMessage(err.message || "Terjadi kesalahan");

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
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
            >
              <X size={18} />
            </button>

            {/* ICON */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={60} className="text-green-600" />
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
                onClick={() => setShowModal(false)}
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

            <form onSubmit={handleSubmit} className="mt-10 space-y-8">

              {/* JUDUL */}
              <div>
                <label className="block text-white font-semibold text-lg mb-3">
                  Judul Laporan
                </label>

                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => {
                    setJudul(e.target.value);
                    if (errors.judul) setErrors({ ...errors, judul: "" });
                  }}
                  placeholder="Masukkan Judul Laporan Anda"
                  className={`w-full border rounded-lg px-5 py-4 text-white outline-none bg-transparent transition ${
                    errors.judul
                      ? "border-red-500 bg-red-500/10"
                      : "border-green-300"
                  }`}
                />

                {errors.judul && (
                  <p className="text-red-400 text-sm mt-2 font-medium">
                    ⚠️ {errors.judul}
                  </p>
                )}
              </div>

              {/* UPLOAD + DESKRIPSI */}
              <div>
                <label className="block text-white font-semibold text-lg mb-3">
                  Laporan Anda
                </label>

                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">

                  {/* UPLOAD IMAGE */}
                  <div className="flex flex-col gap-2">
                    <label className={`relative border rounded-lg min-h-[220px] overflow-hidden flex flex-col items-center justify-center text-white cursor-pointer hover:bg-white/5 transition ${
                      errors.gambar
                        ? "border-red-500 bg-red-500/10"
                        : "border-green-300"
                    }`}>
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
                              setErrors({ ...errors, gambar: "" });
                            }}
                            className="absolute top-3 right-3 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Upload size={70} />
                          <p className="mt-4 text-lg">Kirim Gambar</p>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          handleFileChange(e);
                          if (errors.gambar) setErrors({ ...errors, gambar: "" });
                        }}
                      />
                    </label>

                    {errors.gambar && (
                      <p className="text-red-400 text-sm font-medium">
                        ⚠️ {errors.gambar}
                      </p>
                    )}
                  </div>

                  {/* TEXTAREA */}
                  <div>
                    <textarea
                      required
                      value={isi}
                      onChange={(e) => {
                        setIsi(e.target.value);
                        if (errors.isi) setErrors({ ...errors, isi: "" });
                      }}
                      placeholder="Masukkan Deskripsi Laporan Anda"
                      className={`w-full border rounded-lg bg-transparent p-5 min-h-[220px] text-white outline-none transition ${
                        errors.isi
                          ? "border-red-500 bg-red-500/10"
                          : "border-green-300"
                      }`}
                    />

                    {errors.isi && (
                      <p className="text-red-400 text-sm mt-2 font-medium">
                        ⚠️ {errors.isi}
                      </p>
                    )}
                  </div>
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
                    onChange={(e) => {
                      setTanggal(e.target.value);
                      if (errors.tanggal) setErrors({ ...errors, tanggal: "" });
                    }}
                    className={`w-full border rounded-lg px-5 py-4 text-white outline-none bg-transparent transition ${
                      errors.tanggal
                        ? "border-red-500 bg-red-500/10"
                        : "border-green-300"
                    }`}
                  />
                  <CalendarDays className="absolute right-5 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
                </div>

                {errors.tanggal && (
                  <p className="text-red-400 text-sm mt-2 font-medium">
                    ⚠️ {errors.tanggal}
                  </p>
                )}
              </div>

              {/* LOKASI */}
              <div>
                <label className="block text-white font-semibold text-lg mb-3">
                  Lokasi Kejadian
                </label>

                {/* Tampilan nama lokasi terpilih */}
                <div className={`flex items-center gap-3 border rounded-lg px-5 py-4 mb-3 bg-transparent transition min-h-[56px] ${
                  errors.lokasi
                    ? "border-red-500 bg-red-500/10"
                    : "border-green-300"
                }`}>
                  <MapPin
                    size={18}
                    className={`flex-shrink-0 ${lokasi ? "text-green-300" : "text-white/30"}`}
                  />
                  {lokasiLoading ? (
                    <span className="text-white/50 text-sm animate-pulse">
                      Mencari nama wilayah...
                    </span>
                  ) : (
                    <span className={`text-sm leading-relaxed ${lokasi ? "text-white" : "text-white/40"}`}>
                      {lokasi || "Klik pada peta untuk memilih lokasi..."}
                    </span>
                  )}
                </div>

                {/* Peta Leaflet */}
                <div className={`rounded-xl overflow-hidden border ${
                    errors.lokasi ? "border-red-500" : "border-green-300"
                  }`} style={{ zIndex: 0, position: "relative" }}>
                    <div ref={mapRef} style={{ height: "320px", width: "100%" }} />
                  </div>

                <p className="text-white/40 text-xs mt-2 flex items-center gap-1">
                  📍 Klik di mana saja pada peta — nama daerah terisi otomatis
                </p>

                {errors.lokasi && (
                  <p className="text-red-400 text-sm mt-2 font-medium">
                    ⚠️ {errors.lokasi}
                  </p>
                )}
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
                    onChange={(e) => {
                      setKategori(e.target.value);
                      if (errors.kategori) setErrors({ ...errors, kategori: "" });
                    }}
                    className={`w-full border rounded-lg px-5 py-4 text-white appearance-none outline-none transition bg-[#006b1a] ${
                      errors.kategori
                        ? "border-red-500 bg-red-500/10"
                        : "border-green-300"
                    }`}
                  >
                    <option value="" className="text-black">
                      Pilih Kategori
                    </option>
                    {kategoriList.map((item) => (
                      <option key={item.id} value={item.id} className="text-black">
                        {item.category_name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
                </div>

                {errors.kategori && (
                  <p className="text-red-400 text-sm mt-2 font-medium">
                    ⚠️ {errors.kategori}
                  </p>
                )}
              </div>

              {/* BUTTON */}
              <div className="flex justify-end pt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-black font-bold px-10 py-4 rounded-lg shadow-md hover:scale-105 transition disabled:opacity-50"
                >
                  {loading ? "Mengirim..." : "Kirim Laporan"}
                </button>
              </div>

            </form>
          </div>
        </section>
      </main>
    </>
  );
}