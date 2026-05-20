"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Clock3,
  LogOut,
  Pencil,
  Search,
  Settings,
  User,
  X,
  Upload,
} from "lucide-react";

export default function TopbarAdmin() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [openProfile, setOpenProfile] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    profile: "",
  });

  // =========================
  // GET PROFILE
  // =========================
  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setProfileData({
            username: data.username || "",
            email: data.email || "",
            password: "",
            role: data.role || "",
            profile: data.profile || "",
          });

          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getProfile();
  }, []);

  // =========================
  // UPLOAD FOTO
  // =========================
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setProfileData({
        ...profileData,
        profile: imageUrl,
      });
    }
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/auth/update-profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: profileData.username,
            email: profileData.email,
            password: profileData.password,
            profile: profileData.profile,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Profile berhasil diupdate");

        localStorage.setItem("user", JSON.stringify(data.user));

        setOpenEditModal(false);
      } else {
        setMessage(data.message || "Gagal update profile");
      }
    } catch (error) {
      console.log(error);
      setMessage("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/masuk";
  };

  return (
    <>
      {/* TOPBAR */}
      <div className="w-full bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">

        {/* SEARCH */}
        <div className="relative w-[42%]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Cari..."
            className="w-full bg-[#F3F4F8] rounded-[20px] py-4 pl-14 pr-4"
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">

          <Bell />
          <Clock3 />
          <div className="w-[1px] h-10 bg-gray-300" />

          {/* PROFILE */}
          <div className="relative">

            <div
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-3 cursor-pointer"
            >

              <div className="text-right">
                <h2 className="font-bold">
                  {profileData.username || "Loading..."}
                </h2>
                <p className="text-sm text-gray-500 capitalize">
                  {profileData.role}
                </p>
              </div>

              {profileData.profile ? (
                <img
                  src={profileData.profile}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User />
              )}

              <ChevronDown />
            </div>

            {/* DROPDOWN */}
            {openProfile && (
              <div className="absolute right-0 top-16 w-72 bg-white shadow-xl rounded-2xl p-3 z-50">

                {/* EDIT BUTTON */}
                <button
                  onClick={() => {
                    setOpenEditModal(true);
                    setOpenProfile(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-xl"
                >
                  <Pencil size={18} />
                  Edit Profile
                </button>

                {/* SETTINGS */}
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-xl">
                  <Settings size={18} />
                  Settings
                </button>

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 hover:bg-red-100 text-red-600 rounded-xl"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* MODAL EDIT */}
      {openEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white w-[420px] rounded-2xl p-6">

            <button onClick={() => setOpenEditModal(false)}>
              <X />
            </button>

            {/* FOTO */}
            <div className="flex flex-col items-center mb-4">

              {profileData.profile ? (
                <img
                  src={profileData.profile}
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <User size={40} />
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                <Upload size={16} />
                Upload Foto
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            {/* INPUT */}
            <input
              placeholder="Username"
              value={profileData.username}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  username: e.target.value,
                })
              }
              className="w-full border p-2 rounded mt-2"
            />

            <input
              placeholder="Email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  email: e.target.value,
                })
              }
              className="w-full border p-2 rounded mt-2"
            />

            <input
              type="password"
              placeholder="Password baru (opsional)"
              value={profileData.password}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  password: e.target.value,
                })
              }
              className="w-full border p-2 rounded mt-2"
            />

            <button
              onClick={handleUpdateProfile}
              className="w-full bg-green-600 text-white p-3 rounded mt-4"
            >
              {loading ? "Loading..." : "Simpan"}
            </button>

            {message && (
              <p className="text-center text-sm mt-2 text-green-600">
                {message}
              </p>
            )}

          </div>

        </div>
      )}
    </>
  );
}