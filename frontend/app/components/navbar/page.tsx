"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Bell,
  ChevronDown,
  UserCircle2,
  Pencil,
  Trash2,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const [openProfile, setOpenProfile] = useState(false);

  // simulasi profile image
  const [profileImage, setProfileImage] = useState("");

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-8 py-4 grid grid-cols-3 items-center relative z-50">
      
      {/* ================= LOGO ================= */}
      <div className="flex items-center justify-start">
        <Link href="/">
          <div className="cursor-pointer">
            <img
              src="/image/logo panjang.png"
              alt="Logo"
              className="w-[250px] object-contain"
            />
          </div>
        </Link>
      </div>

      {/* ================= MENU ================= */}
      <div className="flex justify-center">
        <ul className="hidden lg:flex items-center gap-16">

          {/* BERANDA */}
          <li className="relative">
            <Link
              href="/user/beranda"
              className={`text-[20px] font-bold transition ${
                pathname === "/user/beranda"
                  ? "text-green-700"
                  : "text-black hover:text-green-700"
              }`}
            >
              Beranda
            </Link>

            {pathname === "/user/beranda" && (
              <div className="absolute left-0 right-0 -bottom-4 mx-auto w-full h-[5px] bg-green-700 rounded-full"></div>
            )}
          </li>

          {/* LAPOR */}
          <li className="relative">
            <Link
              href="/user/lapor"
              className={`text-[20px] font-bold transition ${
                pathname === "/user/lapor"
                  ? "text-green-700"
                  : "text-black hover:text-green-700"
              }`}
            >
              Lapor
            </Link>

            {pathname === "/user/lapor" && (
              <div className="absolute left-0 right-0 -bottom-4 mx-auto w-full h-[5px] bg-green-700 rounded-full"></div>
            )}
          </li>

          {/* RIWAYAT */}
          <li className="relative">
            <Link
              href="/user/riwayat"
              className={`text-[20px] font-bold transition ${
                pathname === "/user/riwayat"
                  ? "text-green-700"
                  : "text-black hover:text-green-700"
              }`}
            >
              Riwayat
            </Link>

            {pathname === "/user/riwayat" && (
              <div className="absolute left-0 right-0 -bottom-4 mx-auto w-full h-[5px] bg-green-700 rounded-full"></div>
            )}
          </li>
        </ul>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-5 justify-end">
        
        {/* NOTIFICATION */}
        <div className="flex items-center gap-2 cursor-pointer">
          
          <div className="w-[58px] h-[58px] rounded-full border-2 border-black bg-white flex items-center justify-center hover:scale-105 transition">
            <Bell className="w-7 h-7 text-black" />
          </div>

          <ChevronDown className="text-black w-5 h-5" />
        </div>

        {/* PROFILE */}
        <div className="relative">

          {/* BUTTON PROFILE */}
          <div
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-2 cursor-pointer"
          >
            
            <div className="w-[58px] h-[58px] rounded-full border-[2px] border-black bg-white flex items-center justify-center hover:scale-105 transition overflow-hidden">
              
              {/* kalau ada foto */}
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle2 className="w-9 h-9 text-black" />
              )}
            </div>

            <ChevronDown className="text-black w-5 h-5" />
          </div>

          {/* ================= DROPDOWN PROFILE ================= */}
          {openProfile && (
            <div className="absolute right-0 top-20 w-[320px] bg-white rounded-3xl shadow-2xl border border-gray-200 p-5">

              {/* HEADER */}
              <div className="flex flex-col items-center border-b pb-5">

                <div className="relative">

                  {/* FOTO PROFILE */}
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-green-700"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-green-700 bg-gray-100 flex items-center justify-center">
                      <UserCircle2 className="w-14 h-14 text-gray-500" />
                    </div>
                  )}

                  {/* EDIT PHOTO */}
                  <button className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white hover:scale-105 transition">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 mt-4">

                  <button className="px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition">
                    Upload Foto
                  </button>

                  <button className="px-4 py-2 border border-red-500 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </button>
                </div>
              </div>

              {/* ================= FORM PROFILE ================= */}
              <div className="mt-6 space-y-5">

                {/* NAMA */}
                <div>
                  <label className="text-sm font-bold text-gray-700">
                    Nama Pengguna
                  </label>

                  <div className="mt-2 flex items-center gap-2">
                    
                    <input
                      type="text"
                      defaultValue="Ayra Studiess"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700 text-sm"
                    />

                    <button className="p-3 rounded-xl bg-green-700 text-white hover:bg-green-800 transition">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-sm font-bold text-gray-700">
                    Email
                  </label>

                  <div className="mt-2 flex items-center gap-2">
                    
                    <input
                      type="email"
                      defaultValue="ayra@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700 text-sm"
                    />

                    <button className="p-3 rounded-xl bg-green-700 text-white hover:bg-green-800 transition">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-sm font-bold text-gray-700">
                    Password
                  </label>

                  <div className="mt-2 flex items-center gap-2">
                    
                    <input
                      type="password"
                      defaultValue="12345678"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700 text-sm"
                    />

                    <button className="p-3 rounded-xl bg-green-700 text-white hover:bg-green-800 transition">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* LOGOUT */}
                <button className="w-full mt-3 py-3 rounded-2xl bg-red-500 text-white font-bold flex items-center justify-center gap-3 hover:bg-red-600 transition">
                  
                  <LogOut className="w-5 h-5" />

                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}