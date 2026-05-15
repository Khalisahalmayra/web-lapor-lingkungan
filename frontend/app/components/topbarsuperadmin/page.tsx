"use client";

import { useRef, useState } from "react";

import {
  Bell,
  ChevronDown,
  Clock3,
  LogOut,
  Moon,
  Pencil,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";

export default function TopbarAdmin() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [openProfile, setOpenProfile] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);

  const [profileData, setProfileData] = useState({
    username: "Admin Super",
    email: "admin@gmail.com",
    password: "12345678",
    role: "Pusat Kendali Global",
    photo: "https://i.pravatar.cc/200?img=32",
  });

  // UPDATE FOTO
  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setProfileData({
        ...profileData,
        photo: imageUrl,
      });
    }
  };

  return (
    <>
      {/* TOPBAR */}
      <div className="w-full bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        {/* SEARCH */}
        <div className="relative w-[42%]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={22}
          />

          <input
            type="text"
            placeholder="Cari laporan, admin, atau kategori..."
            className="w-full bg-[#F3F4F8] border border-gray-200 rounded-[20px] py-4 pl-14 pr-4 text-[15px] text-gray-700 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          {/* ICON */}
          <div className="flex items-center gap-5 text-gray-600">
            {/* BELL */}
            <div className="relative cursor-pointer">
              <Bell size={24} strokeWidth={2} />

              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white" />
            </div>

            {/* CLOCK */}
            <Clock3
              size={24}
              strokeWidth={2}
              className="cursor-pointer"
            />

            {/* DARK MODE */}
            <Moon
              size={24}
              strokeWidth={2}
              className="cursor-pointer"
            />
          </div>

          {/* LINE */}
          <div className="w-[1px] h-12 bg-gray-300" />

          {/* PROFILE */}
          <div className="relative">
            <div
              onClick={() =>
                setOpenProfile(!openProfile)
              }
              className="flex items-center gap-3 cursor-pointer"
            >
              {/* TEXT */}
              <div className="text-right">
                <h2 className="text-[18px] font-bold text-black leading-none">
                  {profileData.username}
                </h2>

                <p className="text-[13px] text-gray-500 mt-1">
                  {profileData.role}
                </p>
              </div>

              {/* IMAGE */}
              <img
                src={profileData.photo}
                alt="profile"
                className="w-14 h-14 rounded-full object-cover border-[3px] border-[#0B6B2B]"
              />

              {/* ICON */}
              <ChevronDown
                size={22}
                className={`text-gray-500 transition ${
                  openProfile
                    ? "rotate-180"
                    : ""
                }`}
              />
            </div>

            {/* DROPDOWN */}
            {openProfile && (
              <div className="absolute right-0 top-20 w-[320px] bg-white rounded-[24px] shadow-2xl border border-gray-100 overflow-hidden z-50">
                {/* HEADER */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <img
                      src={profileData.photo}
                      alt="profile"
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#0B6B2B]"
                    />

                    <div>
                      <h2 className="text-[18px] font-bold text-gray-800">
                        {profileData.username}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        {profileData.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* MENU */}
                <div className="p-3 space-y-2">
                  {/* EDIT */}
                  <button
                    onClick={() => {
                      setOpenEditModal(true);
                      setOpenProfile(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-green-50 transition"
                  >
                    <div className="bg-green-100 p-2 rounded-xl">
                      <Pencil
                        size={18}
                        className="text-[#0B6B2B]"
                      />
                    </div>

                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800 text-sm">
                        Edit Profile
                      </h3>

                      <p className="text-xs text-gray-500">
                        Ubah data akun admin
                      </p>
                    </div>
                  </button>

                  {/* SETTINGS */}
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 transition">
                    <div className="bg-gray-100 p-2 rounded-xl">
                      <Settings
                        size={18}
                        className="text-gray-700"
                      />
                    </div>

                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800 text-sm">
                        Pengaturan
                      </h3>

                      <p className="text-xs text-gray-500">
                        Kelola akun
                      </p>
                    </div>
                  </button>

                  {/* LOGOUT */}
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 transition">
                    <div className="bg-red-100 p-2 rounded-xl">
                      <LogOut
                        size={18}
                        className="text-red-600"
                      />
                    </div>

                    <div className="text-left">
                      <h3 className="font-semibold text-red-600 text-sm">
                        Logout
                      </h3>

                      <p className="text-xs text-red-400">
                        Keluar akun
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL EDIT PROFILE */}
      {openEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] px-4">
          <div className="bg-white w-full max-w-xl rounded-[28px] p-7 relative">
            {/* CLOSE */}
            <button
              onClick={() =>
                setOpenEditModal(false)
              }
              className="absolute top-5 right-5 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-green-100 p-3 rounded-2xl">
                <User className="text-[#0B6B2B]" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#0B6B2B]">
                  Edit Profile
                </h2>

                <p className="text-gray-500 mt-1 text-sm">
                  Update informasi akun admin
                </p>
              </div>
            </div>

            {/* FOTO */}
            <div className="flex flex-col items-center mb-7">
              <img
                src={profileData.photo}
                alt="profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#0B6B2B]"
              />

              <button
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="mt-4 bg-[#0B6B2B] hover:bg-[#095424] text-white px-5 py-2.5 rounded-xl font-medium transition text-sm"
              >
                Update Foto Profile
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            {/* FORM */}
            <div className="space-y-5">
              {/* USERNAME */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Nama Pengguna
                </label>

                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      username: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Email
                </label>

                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      email: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Password
                </label>

                <input
                  type="password"
                  value={profileData.password}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      password: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-[#0B6B2B]"
                />
              </div>

              {/* BUTTON */}
              <button
                onClick={() =>
                  setOpenEditModal(false)
                }
                className="w-full bg-[#0B6B2B] hover:bg-[#095424] text-white py-4 rounded-2xl font-semibold transition mt-2"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}