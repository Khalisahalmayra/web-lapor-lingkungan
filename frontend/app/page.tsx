import {
  Leaf,
  ShieldCheck,
  Zap,
  Earth,
  User,
  Droplets,
  Mail,
  Phone,
  MapPin,
  Trees,
} from "lucide-react";

import Link from "next/link";

import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

export default function HomePage() {
  const features = [
    {
      title: "Mudah",
      desc: "digunakan",
      icon: <Leaf className="w-7 h-7 text-green-700" />,
    },
    {
      title: "Aman &",
      desc: "Terpercaya",
      icon: <ShieldCheck className="w-7 h-7 text-green-700" />,
    },
    {
      title: "Respon",
      desc: "Cepat",
      icon: <Zap className="w-7 h-7 text-green-700" />,
    },
    {
      title: "Peduli",
      desc: "Lingkungan",
      icon: <Earth className="w-7 h-7 text-green-700" />,
    },
  ];

  const steps = [
    "Daftarkan diri anda",
    "Isi laporan beserta bukti yang valid",
    "Pantau laporan dan status anda",
    "Berikan kami feedback anda",
    "Pelajari cara merawat lingkungan",
  ];

  const testimonials = [
    {
      name: "Sara Kim",
      desc: "Platform ini sangat membantu masyarakat dalam melaporkan masalah lingkungan dengan cepat.",
    },
    {
      name: "Ilmah Aliando",
      desc: "Tampilan mudah digunakan dan proses pelaporan jadi lebih transparan.",
    },
  ];

  return (
    <main className="bg-[#f6f6f6] text-black min-h-screen">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/image/logo panjang.png"
              alt="Logo"
              className="w-48 h-auto object-contain"
            />
          </div>

          <ul className="hidden md:flex items-center gap-10 font-semibold">
            <li>
              <a
                href="#beranda"
                className="hover:text-green-700 cursor-pointer"
              >
                Beranda
              </a>
            </li>

            <li>
              <a
                href="#cara-lapor"
                className="hover:text-green-700 cursor-pointer"
              >
                Cara Lapor
              </a>
            </li>

            <li>
              <a
                href="#kontak"
                className="hover:text-green-700 cursor-pointer"
              >
                Kontak Kami
              </a>
            </li>
          </ul>

          <div className="flex gap-4">
  <Link href="/masuk">
    <button className="px-6 py-2 border-2 border-gray-300 rounded-full font-semibold hover:bg-white hover:scale-105 transition">
      Masuk
    </button>
  </Link>

  <Link href="/daftar">
    <button className="px-6 py-2 bg-green-700 text-white rounded-full font-semibold hover:bg-green-800 hover:scale-105 transition">
      Daftar
    </button>
  </Link>
</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="beranda"
        className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center"
      >
        <div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Laporkan Masalah <br />
            Lingkungan <br />
            <span className="text-green-700">
              dengan Mudah dan Cepat
            </span>
          </h1>

          <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-xl">
            Laporkan setiap masalah lingkungan di sekitar anda.
            Bersama kita ciptakan lingkungan yang bersih,
            sehat dan berkelanjutan.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="px-7 py-4 bg-white border-2 border-gray-300 rounded-xl font-bold shadow hover:scale-105 transition">
              Laporkan Sekarang
            </button>

            <button className="px-7 py-4 bg-green-700 text-white rounded-xl font-bold shadow-lg hover:bg-green-800 hover:scale-105 transition">
              Cara Lapor
            </button>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute w-[500px] h-[500px] bg-green-100 rounded-full blur-3xl opacity-50"></div>

          <div className="relative bg-gradient-to-br from-green-700 to-green-900 rounded-[3rem] p-5 shadow-2xl rotate-6 hover:rotate-0 transition duration-500">
            <img
              src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1200&auto=format&fit=crop"
              alt="Phone"
              className="w-[320px] h-[560px] object-cover rounded-[2rem]"
            />
          </div>
        </div>
      </section>

      {/* Tentang */}
<section className="max-w-7xl mx-auto px-6 py-16">
  <div className="bg-[#eaeaea] rounded-3xl p-12 grid lg:grid-cols-2 gap-12 items-center shadow-sm">

    {/* Kiri */}
    <div className="flex flex-col justify-center">
      <h2 className="text-4xl font-extrabold text-green-700 mb-6">
        Tentang Lapor Lingkungan
      </h2>

      <p className="text-gray-700 text-lg leading-relaxed">
        Platform digital yang memudahkan masyarakat dalam
        melaporkan masalah lingkungan secara cepat,
        mudah dan transparan.
      </p>

      <p className="text-gray-700 text-lg leading-relaxed mt-4">
        Pengguna dapat mengirim laporan serta memantau statusnya
        secara real-time untuk mendukung lingkungan yang lebih
        bersih dan berkelanjutan.
      </p>
    </div>

    {/* Kanan */}
    <div className="flex justify-center items-center">
      <div className="relative">
        <div className="absolute inset-0 bg-green-300 rounded-full blur-3xl opacity-40"></div>

        <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-2xl">
          <Trees className="w-32 h-32 text-white" />
        </div>
      </div>
    </div>

  </div>
</section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-green-600 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                {item.icon}
              </div>

              <div>
                <h3 className="font-extrabold text-green-700 text-lg">
                  {item.title}
                </h3>

                <p className="text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cara Menggunakan */}
      <section
        id="cara-lapor"
        className="max-w-7xl mx-auto px-6 py-14"
      >
        <h2 className="text-center text-4xl font-extrabold text-green-700 mb-10">
          Bagaimana Cara Menggunakannya?
        </h2>

        <div className="bg-green-800 rounded-3xl p-10 grid md:grid-cols-3 gap-6 shadow-2xl">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 flex items-center gap-5 shadow-lg hover:scale-105 transition"
            >
              <div className="w-14 h-14 rounded-full border-4 border-green-700 flex items-center justify-center font-extrabold text-green-700 text-xl">
                {index + 1}
              </div>

              <p className="font-semibold text-gray-700 text-lg capitalize">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimoni */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-center mb-10">
          <div className="bg-white border-2 border-green-700 rounded-2xl px-10 py-4 shadow-lg">
            <h2 className="text-3xl font-extrabold text-green-700">
              Masukan Dan Penilaian Anda
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-8 shadow hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="w-7 h-7 text-green-700" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>

                    <p className="text-gray-500 text-sm">5 days ago</p>
                  </div>
                </div>

                <img
                  src="/image/logo bulet.png"
                  alt="logo"
                  className="w-12 h-12 object-contain"
                />
              </div>

              <div className="text-yellow-400 text-xl mb-4">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="text-gray-700 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
<section className="max-w-7xl mx-auto px-6 py-24">
  <div className="grid lg:grid-cols-2 gap-16 items-center bg-[#ececec] rounded-[3rem] p-14 shadow-xl">

    {/* Kiri */}
    <div className="flex flex-col justify-center">
      <h2 className="text-5xl font-extrabold leading-tight mb-8">
        Ayo Jaga Dan Lebih Peduli Terhadap Lingkungan Disekitar Kita!
      </h2>

      <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-xl">
        Bersama kita dapat menciptakan lingkungan yang lebih bersih,
        sehat dan nyaman untuk generasi sekarang maupun masa depan.
      </p>

      <div>
        <button className="px-8 py-4 bg-green-700 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-green-800 hover:scale-105 transition duration-300">
          Buat Laporan Sekarang
        </button>
      </div>
    </div>

    {/* Kanan */}
    <div className="flex justify-center items-center">
      <div className="relative">
        <div className="absolute inset-0 bg-green-300 rounded-full blur-3xl opacity-40"></div>

        <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-2xl">
          <Droplets className="w-36 h-36 text-white" />
        </div>
      </div>
    </div>

  </div>
</section>

      {/* Footer */}
      <footer
        id="kontak"
        className="bg-[#d9d9d9] mt-10"
      >
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/image/image 1.png"
                alt="Logo"
                className="w-48 h-auto object-contain"
              />
            </div>

            <p className="text-gray-700 leading-relaxed">
              Platform digital yang memudahkan masyarakat dalam melaporkan masalah lingkungan secara cepat,
              mudah dan transparan.
            </p>
          </div>

          <div>
            <h3 className="font-extrabold text-xl mb-5">
              NAVIGASI
            </h3>

            <ul className="space-y-4 text-gray-700">
              <li>Beranda</li>
              <li>Cara Lapor</li>
              <li>Tentang Kami</li>
              <li>FAQ</li>
              <li>Kontak</li>
            </ul>
          </div>

          <div>
            <h3 className="font-extrabold text-xl mb-5">
              KONTAK KAMI
            </h3>

            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-700" />
                LaporLingkungan@gmail.com
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-700" />
                +628909875378
              </li>

              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-700" />
                Depok, Jawa Barat
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-extrabold text-xl mb-5">
              IKUTI KAMI
            </h3>

            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center gap-3">
                <FaInstagram className="text-green-700" />
                Instagram
              </li>

              <li className="flex items-center gap-3">
                <FaXTwitter className="text-green-700" />
                Twitter (X)
              </li>

              <li className="flex items-center gap-3">
                <FaFacebook className="text-green-700" />
                Facebook
              </li>

              <li className="flex items-center gap-3">
                <FaYoutube className="text-green-700" />
                Youtube
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-400 py-5 px-6 text-center text-gray-700 font-medium">
          © 2026 Lapor Lingkungan. All rights reserved
        </div>
      </footer>
    </main>
  );
}