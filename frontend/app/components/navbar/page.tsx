"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Bell,
  ChevronDown,
  UserCircle2,
  Trash2,
  LogOut,
  Pencil,
  Eye,
 EyeOff,
  CheckCircle,
} from "lucide-react";
import { getSession, signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const notifRef =
    useRef<HTMLDivElement>(null);

  const [openProfile, setOpenProfile] =
    useState(false);

  const [openNotif, setOpenNotif] =
    useState(false);

  // =========================
  // DATA USER
  // =========================
  const [user, setUser] =
    useState<any>(null);

  // =========================
  // FORM
  // =========================
  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  // edit password
  const [editPassword, setEditPassword] =
    useState(false);

  // show password
  const [showPassword, setShowPassword] =
    useState(false);

  // success toast
  const [successMessage, setSuccessMessage] =
    useState("");

  // =========================
  // NOTIFIKASI
  // =========================
  const [notifications, setNotifications] =
    useState<any[]>([]);

  // =========================
  // PROFILE IMAGE
  // =========================
  const [profileImage, setProfileImage] =
    useState("");
  const [profileFile, setProfileFile] =
    useState<File | null>(null);

  // =========================
  // GET USER
  // =========================
  useEffect(() => {
    async function getDataUser() {
      const session = await getSession();
      console.log("Session data in Navbar:", session);

      if (session && session.user) {
        setUser(session.user);
        setUsername(session.user.name || "");
        setEmail(session.user.email || "");
        setProfileImage(session.user.image || "");
      }

      if (session?.accessToken) {
        try {
          const response = await fetch(
            `${API_URL}/api/auth/profile`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          );

          if (response.ok) {
            const profileData = await response.json();
            setUser(profileData);
            setUsername(profileData.username || "");
            setEmail(profileData.email || "");
            setProfileImage(profileData.profile || profileData.image || "");
            sessionStorage.setItem(
              "user",
              JSON.stringify(profileData)
            );
          }
        } catch (error) {
          console.error("Failed to load profile:", error);
        }
      }
    }

    getDataUser();
  }, []);

  // =========================
  // GET NOTIFIKASI
  // =========================
  useEffect(() => {

    const savedNotif =
      sessionStorage.getItem(
        "notifications"
      );

    if (savedNotif) {

      setNotifications(
        JSON.parse(savedNotif)
      );
    }

  }, []);

  // =========================
  // AUTO REFRESH NOTIF
  // =========================
  useEffect(() => {

    const interval =
      setInterval(() => {

        const savedNotif =
          sessionStorage.getItem(
            "notifications"
          );

        if (savedNotif) {

          setNotifications(
            JSON.parse(savedNotif)
          );
        }

      }, 1000);

    return () =>
      clearInterval(interval);

  }, []);

  // =========================
  // CLOSE DROPDOWN
  // =========================
  useEffect(() => {

    const handleClickOutside = (
      event: MouseEvent
    ) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenProfile(false);
      }

      if (
        notifRef.current &&
        !notifRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenNotif(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  // =========================
  // UPLOAD FOTO
  // =========================
  const handleUploadFoto = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
    setProfileFile(file);
  };

  // =========================
  // DELETE FOTO
  // =========================
  const handleDeleteFoto = () => {

    setProfileImage("");
    setProfileFile(null);
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleUpdateProfile =
    async () => {

      try {

        const token =
          (await getSession())?.accessToken;

        if (!token) {

          setSuccessMessage(
            "Silakan login kembali"
          );

          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);

          return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append(
          "password",
          editPassword ? password : ""
        );
        if (profileFile) {
          formData.append("profile", profileFile);
        }

        const res = await fetch(
          `${API_URL}/api/auth/update-profile`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data =
          await res.json();

        if (!res.ok) {

          throw new Error(
            data.message ||
              "Gagal update profile"
          );
        }

        // update sessionStorage
        sessionStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setUser(data.user);
        setUsername(data.user.username || "");
        setEmail(data.user.email || "");
        
        // Build profile image URL
        let profileUrl = "";
        if (data.user.profile) {
          profileUrl = data.user.profile.startsWith('http')
            ? data.user.profile
            : `${API_URL}/uploads/${data.user.profile}`;
        } else if (data.user.image) {
          profileUrl = data.user.image.startsWith('http')
            ? data.user.image
            : `${API_URL}/uploads/${data.user.image}`;
        }
        setProfileImage(profileUrl);

        // reset password
        setEditPassword(false);

        setPassword("");

        // success toast
        setSuccessMessage(
          "Profile berhasil diupdate"
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);

      } catch (error: any) {

        console.log(error);

        setSuccessMessage(
          error.message ||
          "Terjadi kesalahan"
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    };

  // =========================
  // HAPUS NOTIF
  // =========================
  const handleDeleteNotif = (
    index: number
  ) => {

    const updatedNotif =
      notifications.filter(
        (_, i) => i !== index
      );

    setNotifications(updatedNotif);

    sessionStorage.setItem(
      "notifications",
      JSON.stringify(updatedNotif)
    );
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {

    sessionStorage.clear();
    signOut({
      callbackUrl: "/masuk",
    })
  };

  return (
    <>
      {/* SUCCESS TOAST */}
      {successMessage && (

        <div className="fixed top-6 right-6 z-[9999] bg-green-700 text-white px-6 py-4 rounded-2xl shadow-2xl">

          {successMessage}

        </div>

      )}

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

            <li>
              <Link
                href="/user/beranda"
                className={`text-[20px] font-bold ${
                  pathname ===
                  "/user/beranda"
                    ? "text-green-700"
                    : "text-black hover:text-green-700"
                }`}
              >
                Beranda
              </Link>
            </li>

            <li>
              <Link
                href="/user/lapor"
                className={`text-[20px] font-bold ${
                  pathname ===
                  "/user/lapor"
                    ? "text-green-700"
                    : "text-black hover:text-green-700"
                }`}
              >
                Lapor
              </Link>
            </li>

            <li>
              <Link
                href="/user/riwayat"
                className={`text-[20px] font-bold ${
                  pathname ===
                  "/user/riwayat"
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

          {/* ================= NOTIF ================= */}
          <div
            className="relative"
            ref={notifRef}
          >

            <div
              onClick={() =>
                setOpenNotif(!openNotif)
              }
              className="flex items-center gap-2 cursor-pointer relative"
            >

              <div className="w-[58px] h-[58px] rounded-full border-2 border-black flex items-center justify-center relative">

                <Bell className="w-7 h-7 text-black" />

                {notifications.length >
                  0 && (

                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">

                    {
                      notifications.length
                    }

                  </div>

                )}

              </div>

              <ChevronDown className="w-5 h-5 text-black" />

            </div>

            {/* DROPDOWN NOTIF */}
            {openNotif && (

              <div className="absolute right-0 top-20 w-[360px] bg-white rounded-3xl shadow-2xl border p-5 z-50">

                <h2 className="text-xl font-bold text-black mb-5">

                  Notifikasi

                </h2>

                {notifications.length ===
                0 ? (

                  <div className="text-gray-500 text-center py-10">

                    Belum ada notifikasi

                  </div>

                ) : (

                  <div className="space-y-4 max-h-[400px] overflow-y-auto">

                    {notifications.map(
                      (
                        notif,
                        index
                      ) => (

                        <div
                          key={index}
                          className="border rounded-2xl p-4 relative"
                        >

                          <div className="flex items-start gap-3">

                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">

                              <CheckCircle className="w-5 h-5 text-green-700" />

                            </div>

                            <div className="flex-1">

                              <p className="font-semibold text-black">

                                {
                                  notif.title
                                }

                              </p>

                              <p className="text-sm text-gray-500 mt-1">

                                {
                                  notif.message
                                }

                              </p>

                              <p className="text-xs text-gray-400 mt-2">

                                {
                                  notif.time
                                }

                              </p>

                            </div>

                            <button
                              onClick={() =>
                                handleDeleteNotif(
                                  index
                                )
                              }
                              className="text-red-500 hover:text-red-700"
                            >

                              <Trash2 className="w-4 h-4" />

                            </button>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

          </div>

          {/* ================= PROFILE ================= */}
          <div
            className="relative"
            ref={dropdownRef}
          >

            <div
              onClick={() =>
                setOpenProfile(
                  !openProfile
                )
              }
              className="flex items-center gap-2 cursor-pointer"
            >

              <div className="w-[58px] h-[58px] rounded-full border-2 border-black overflow-hidden flex items-center justify-center">

                {profileImage ? (

                  <img
                    src={profileImage.startsWith('http') ? profileImage : `${API_URL}/uploads/${profileImage}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />

                ) : (

                  <UserCircle2 className="w-9 h-9 text-black" />

                )}

              </div>

              <ChevronDown className="w-5 h-5 text-black" />

            </div>

            {/* ================= DROPDOWN ================= */}
            {openProfile && (

              <div className="absolute right-0 top-20 w-[340px] bg-white rounded-3xl shadow-2xl border p-5 z-50">

                {/* FOTO */}
                <div className="flex flex-col items-center border-b pb-5">

                  {profileImage ? (

                    <img
                      src={profileImage.startsWith('http') ? profileImage : `${API_URL}/uploads/${profileImage}`}
                      className="w-24 h-24 rounded-full object-cover border-4 border-green-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />

                  ) : (

                    <div className="w-24 h-24 rounded-full border-4 border-green-700 flex items-center justify-center">

                      <UserCircle2 className="w-14 h-14 text-black" />

                    </div>

                  )}

                  <div className="flex gap-3 mt-4">

                    {/* upload */}
                    <label className="px-4 py-2 bg-green-700 text-white rounded-xl cursor-pointer hover:bg-green-800 transition">

                      Upload

                      <input
                        type="file"
                        hidden
                        onChange={
                          handleUploadFoto
                        }
                      />

                    </label>

                    {/* delete */}
                    <button
                      onClick={
                        handleDeleteFoto
                      }
                      className="px-4 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition"
                    >

                      <Trash2 className="w-4 h-4 inline" />

                      {" "}Hapus

                    </button>

                  </div>

                </div>

                {/* ================= FORM ================= */}
                <div className="mt-6 space-y-5">

                  {/* USERNAME */}
                  <div>

                    <label className="block text-sm font-semibold text-black mb-2">

                      Nama Pengguna

                    </label>

                    <input
                      type="text"
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border rounded-xl text-black outline-none focus:border-green-700"
                      placeholder="Username"
                    />

                  </div>

                  {/* EMAIL */}
                  <div>

                    <label className="block text-sm font-semibold text-black mb-2">

                      Email

                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border rounded-xl text-black outline-none focus:border-green-700"
                      placeholder="Email"
                    />

                  </div>

                  {/* PASSWORD */}
                  <div>

                    <label className="block text-sm font-semibold text-black mb-2">

                      Kata Sandi

                    </label>

                    <div className="relative">

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={
                          editPassword
                            ? password
                            : "••••••••"
                        }
                        onChange={(e) =>
                          setPassword(
                            e.target.value
                          )
                        }
                        disabled={
                          !editPassword
                        }
                        className="w-full px-4 py-3 pr-24 border rounded-xl text-black outline-none disabled:bg-gray-100 focus:border-green-700"
                      />

                      {/* SHOW */}
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                      >

                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}

                      </button>

                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() =>
                          setEditPassword(
                            !editPassword
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                      >

                        <Pencil className="w-5 h-5" />

                      </button>

                    </div>

                  </div>

                  {/* UPDATE */}
                  <button
                    onClick={
                      handleUpdateProfile
                    }
                    className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold transition"
                  >
                    Update Profile
                  </button>

                  {/* LOGOUT */}
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition"
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
    </>
  );
}