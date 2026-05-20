"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"masuk" | "daftar">("masuk");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =========================
  // FETCH PROFILE (BACKEND CONNECT)
  // =========================
  const getProfile = async (token: string) => {
    const res = await fetch("http://localhost:5000/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Gagal mengambil profile");
    }

    return await res.json();
  };

  // =========================
  // HANDLE LOGIN
  // =========================
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setServerError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      // =========================
      // ERROR HANDLING
      // =========================
      if (!response.ok) {
        setServerError(data.message || "Email atau password salah");
        return;
      }

      if (!data.token) {
        setServerError("Token tidak ditemukan");
        return;
      }

      // =========================
      // SAVE TOKEN ONLY
      // =========================
      localStorage.setItem("token", data.token);

      // =========================
      // GET USER FROM BACKEND (PROFILE)
      // =========================
      const profile = await getProfile(data.token);

      localStorage.setItem("user", JSON.stringify(profile));

      // trigger update topbar
      window.dispatchEvent(new Event("auth-change"));

      // =========================
      // REDIRECT BY ROLE
      // =========================
      switch (profile.role) {
        case "Superadmin":
          router.push("/superadmin/dashboard");
          break;

        case "admin":
          router.push("/admin/dashboard");
          break;

        default:
          router.push("/user/beranda");
          break;
      }
    } catch (error) {
      setServerError("Server gagal terhubung");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white overflow-hidden font-sans">

      {/* BACKGROUND (TIDAK DIUBAH) */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image
          src="/image/bg logres.png"
          alt="Background Curve"
          fill
          className="object-cover object-right lg:object-fill"
          priority
        />
      </div>

      {/* LOGO (TIDAK DIUBAH) */}
      <div className="absolute top-6 left-6 z-30">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center p-1 overflow-hidden border border-gray-100">
          <img
            src="/image/logo bulet.png"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* MAIN (TIDAK DIUBAH) */}
      <div className="relative z-10 w-full max-w-[1440px] min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT */}
        <div className="relative flex flex-col justify-center items-center lg:items-end pr-0 lg:pr-20">

          <div className="flex flex-col gap-6 z-20 lg:translate-x-24">

            {/* MASUK */}
            <Link href="/masuk">
              <button
                onClick={() => setActiveTab("masuk")}
                className={`transition-all duration-300 px-12 py-3 rounded-full text-xl font-bold min-w-[220px] text-center
                ${
                  activeTab === "masuk"
                    ? "bg-[#035A1C] text-white"
                    : "bg-white text-black border border-gray-200"
                }`}
              >
                Masuk
              </button>
            </Link>

            {/* DAFTAR */}
            <Link href="/daftar">
              <button
                onClick={() => setActiveTab("daftar")}
                className={`transition-all duration-300 px-12 py-3 rounded-full text-xl font-bold min-w-[220px] text-center
                ${
                  activeTab === "daftar"
                    ? "bg-[#035A1C] text-white"
                    : "bg-white text-black border border-gray-200"
                }`}
              >
                Daftar
              </button>
            </Link>

          </div>

          {/* Pohon */}
            <div className="absolute bottom-10 left-10 lg:left-20 w-[220px] h-[220px] lg:w-[360px] lg:h-[360px]">
                    <Image
                      src="/image/pohon.png"
                      alt="Pohon"
                      fill
                      className="object-contain"
                    />
                  </div>

        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-center justify-center px-6 lg:pl-20 lg:pr-10">

          {activeTab === "masuk" && (
            <div className="w-full max-w-[380px]">

              {/* ICON (TIDAK DIUBAH) */}
              <div className="flex flex-col items-center mb-8">

                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-14 h-14 text-[#065F27]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>

                <h1 className="text-white text-2xl font-bold uppercase tracking-widest">
                  Masuk
                </h1>

              </div>

              {/* ERROR */}
              {serverError && (
                <div className="mb-5 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-pulse">
                  {serverError}
                </div>
              )}

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5 text-white"
              >

                {/* EMAIL */}
                <div className="flex flex-col gap-1.5">

                  <label className="text-sm font-semibold tracking-wide">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Masukkan Email Anda"
                    className="w-full px-4 py-3.5 rounded-lg bg-[#033a18] bg-opacity-60 border border-[#0a4d24] focus:outline-none focus:ring-1 focus:ring-green-400 placeholder-gray-400 text-sm"
                    required
                  />

                </div>

                {/* PASSWORD */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold tracking-wide">
                      Kata Sandi
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Masukkan Password Anda"
                        className="w-full px-4 py-3.5 rounded-lg bg-[#033a18] bg-opacity-60 border border-[#0a4d24] focus:outline-none focus:ring-1 focus:ring-green-400 placeholder-gray-400 text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        className="absolute inset-y-0 right-3 flex items-center text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                {/* BUTTON */}
                <div className="pt-2">

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-white text-[#065F27] font-bold text-lg rounded-lg hover:bg-gray-100 transition active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? "Memproses..." : "Masuk"}
                  </button>

                </div>

              </form>

              {/* REGISTER */}
              <div className="mt-10 text-center text-white text-sm">
                Tidak Punya Akun?{" "}
                <Link
                  href="/daftar"
                  className="font-bold italic hover:underline ml-1"
                >
                  Daftar Disini
                </Link>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;