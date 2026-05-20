"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // halaman yang ga perlu login
    const publicRoutes = ["/masuk", "/daftar", "/"];

    if (publicRoutes.includes(pathname)) return;

    // belum login
    if (!token || !user) {
      router.push("/masuk");
      return;
    }

    const parsedUser = JSON.parse(user);
    const role = parsedUser.role;
    console.log("User role:", role);

    // USER
    if (
      pathname.startsWith("/user") &&
      role !== "user"
    ) {
      router.push("/masuk");
    }

    // ADMIN
    if (
      pathname.startsWith("/admin") &&
      role !== "admin"
    ) {
      router.push("/masuk");
    }

    // SUPERADMIN
    if (
      pathname.startsWith("/superadmin") &&
      role !== "Superadmin"
    ) {
      router.push("/masuk");
    }
  }, [pathname, router]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}