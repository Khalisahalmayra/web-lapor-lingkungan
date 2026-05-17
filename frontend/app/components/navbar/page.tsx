"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [openProfile, setOpenProfile] = useState(false);

  // =========================
  // DATA USER
  // =========================
  const [user, setUser] = useState<any>(null);

  // =========================
  // FORM
  // =========================
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // =========================
  // PROFILE IMAGE
  // =========================
  const [profileImage, setProfileImage] = useState("");

  // =========================
  // GET USER LOCALSTORAGE (SAFE)
  // =========================
  useEffect(() => {
    const userData = localStorage.getItem("user");

    // cegah undefined / null / string rusak
    if (!userData || userData === "undefined") return;

    try {
      const parsedUser = JSON.parse(userData);

      if (!parsedUser) return;

      setUser(parsedUser);
      setUsername(parsedUser.username || "");
      setEmail(parsedUser.email || "");

      // backend kamu pakai "profile"
      setProfileImage(parsedUser.profile || parsedUser.foto_profile || "");
    } catch (error) {
      console.log("User localStorage error:", error);
      localStorage.removeItem("user");
    }
  }, []);

  // =========================
  // CLOSE DROPDOWN
  // =========================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =========================
  // UPLOAD FOTO
  // =========================
  const handleUploadFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setProfileImage(imageUrl);

    const updatedUser = {
      ...user,
      profile: imageUrl,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // =========================
  // DELETE FOTO
  // =========================
  const handleDeleteFoto = () => {
    setProfileImage("");

    const updatedUser = {
      ...user,
      profile: "",
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleUpdateProfile = () => {
    const updatedUser = {
      ...user,
      username,
      email,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    alert("Profile berhasil diupdate");
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-8 py-4 grid grid-cols-3 items-center relative z-50">

      {/* ================= LOGO ================= */}
      <div className="flex items-center justify-start">
        <Link href="/">
          <img
            src="/image/logo panjang.png"
            alt="Logo"
            className="w-[250px] object-contain"
          />
        </Link>
      </div>

      {/* ================= MENU ================= */}
      <div className="flex justify-center">
        <ul className="hidden lg:flex items-center gap-16">

          <li className="relative">
            <Link
              href="/user/beranda"
              className={`text-[20px] font-bold ${
                pathname === "/user/beranda"
                  ? "text-green-700"
                  : "text-black hover:text-green-700"
              }`}
            >
              Beranda
            </Link>
          </li>

          <li className="relative">
            <Link
              href="/user/lapor"
              className={`text-[20px] font-bold ${
                pathname === "/user/lapor"
                  ? "text-green-700"
                  : "text-black hover:text-green-700"
              }`}
            >
              Lapor
            </Link>
          </li>

          <li className="relative">
            <Link
              href="/user/riwayat"
              className={`text-[20px] font-bold ${
                pathname === "/user/riwayat"
                  ? "text-green-700"
                  : "text-black hover:text-green-700"
              }`}
            >
              Riwayat
            </Link>
          </li>

        </ul>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-5 justify-end">

        {/* NOTIF */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-[58px] h-[58px] rounded-full border-2 border-black flex items-center justify-center">
            <Bell className="w-7 h-7" />
          </div>
          <ChevronDown className="w-5 h-5" />
        </div>

        {/* PROFILE */}
        <div className="relative" ref={dropdownRef}>

          <div
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-[58px] h-[58px] rounded-full border-2 border-black overflow-hidden flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle2 className="w-9 h-9" />
              )}
            </div>

            <ChevronDown className="w-5 h-5" />
          </div>

          {/* DROPDOWN */}
          {openProfile && (
            <div className="absolute right-0 top-20 w-[320px] bg-white rounded-3xl shadow-2xl border p-5">

              {/* PROFILE */}
              <div className="flex flex-col items-center border-b pb-5">

                {profileImage ? (
                  <img
                    src={profileImage}
                    className="w-24 h-24 rounded-full object-cover border-4 border-green-700"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-green-700 flex items-center justify-center">
                    <UserCircle2 className="w-14 h-14" />
                  </div>
                )}

                <div className="flex gap-3 mt-4">

                  <label className="px-4 py-2 bg-green-700 text-white rounded-xl cursor-pointer">
                    Upload
                    <input type="file" hidden onChange={handleUploadFoto} />
                  </label>

                  <button
                    onClick={handleDeleteFoto}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4 inline" /> Hapus
                  </button>

                </div>
              </div>

              {/* FORM */}
              <div className="mt-6 space-y-5">

                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl"
                  placeholder="Username"
                />

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl"
                  placeholder="Email"
                />

                <button
                  onClick={handleUpdateProfile}
                  className="w-full bg-green-700 text-white py-3 rounded-xl"
                >
                  Update Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                >
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