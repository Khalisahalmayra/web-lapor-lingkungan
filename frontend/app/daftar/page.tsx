"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // HANDLE INPUT
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // HANDLE REGISTER
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setServerError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(
          data.message || "Register gagal"
        );
      }

      setSuccessMessage("Register berhasil!");

      // pindah ke login setelah 1 detik
      setTimeout(() => {
        router.push("/masuk");
      }, 1000);

    } catch (error: any) {
      setServerError(
        error.message || "Terjadi kesalahan koneksi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white overflow-hidden font-sans">

      {/* Background */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image
          src="/image/bg logres.png"
          alt="Background Curve"
          fill
          className="object-cover object-right lg:object-fill"
          priority
        />
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6 z-30">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center p-1 overflow-hidden border border-gray-100">
          <img
            src="/image/logo bulet.png"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Container */}
      <div className="relative z-10 w-full max-w-[1440px] min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative flex flex-col justify-center items-center lg:items-end pr-0 lg:pr-20">

          {/* Tabs */}
          <div className="flex flex-col gap-6 z-20 lg:translate-x-24">

            {/* Masuk */}
            <Link href="/masuk">
              <button
                className="transition-all duration-300 px-12 py-3 rounded-full text-xl font-bold min-w-[220px] text-center bg-white text-black border border-gray-200 hover:scale-105"
              >
                Masuk
              </button>
            </Link>

            {/* Daftar */}
            <Link href="/daftar">
              <button
                className="transition-all duration-300 px-12 py-3 rounded-full text-xl font-bold min-w-[220px] text-center bg-[#035A1C] text-white hover:scale-105"
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

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-center justify-center px-6 lg:pl-20 lg:pr-10">

          <div className="w-full max-w-[380px]">

            {/* Icon */}
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
                Daftar
              </h1>
            </div>

            {/* ERROR */}
            {serverError && (
              <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                {serverError}
              </div>
            )}

            {/* SUCCESS */}
            {successMessage && (
              <div className="mb-4 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 text-white"
            >

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold tracking-wide">
                  Nama Pengguna
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan Nama Anda"
                  className="w-full px-4 py-3.5 rounded-lg bg-[#033a18] bg-opacity-60 border border-[#0a4d24] focus:outline-none focus:ring-1 focus:ring-green-400 placeholder-gray-400 text-sm"
                  required
                />
              </div>

              {/* Email */}
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

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold tracking-wide">
                  Kata Sandi
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan Password Anda"
                  className="w-full px-4 py-3.5 rounded-lg bg-[#033a18] bg-opacity-60 border border-[#0a4d24] focus:outline-none focus:ring-1 focus:ring-green-400 placeholder-gray-400 text-sm"
                  required
                />
              </div>

              {/* Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-white text-[#065F27] font-bold text-lg rounded-lg hover:bg-gray-100 transition active:scale-[0.98] disabled:opacity-70"
                >
                  {loading
                    ? "Memproses..."
                    : "Daftar"}
                </button>
              </div>
            </form>

            {/* Bottom */}
            <div className="mt-10 text-center text-white text-sm">
              Sudah Punya Akun?

              <Link
                href="/masuk"
                className="font-bold italic hover:underline ml-1"
              >
                Masuk Disini
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;