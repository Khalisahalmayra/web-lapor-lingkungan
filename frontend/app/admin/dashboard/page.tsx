"use client";

import SidebarAdmin from "../../components/sidebaradmin/page";

export default function DashboardAdminPage() {
  return (
    <main className="flex min-h-screen bg-[#f5f5f5]">
      
      {/* SIDEBAR */}
      <SidebarAdmin />

      {/* CONTENT */}
      <section className="flex-1 p-8">
        
        {/* HEADER */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          
          <h1 className="text-4xl font-bold text-[#0B6B2B]">
            Dashboard Admin
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Selamat datang di halaman dashboard admin.
          </p>
        </div>

        {/* CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          
          {/* CARD 1 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            
            <h2 className="text-gray-500 font-medium">
              Total Laporan
            </h2>

            <p className="text-4xl font-bold text-[#0B6B2B] mt-4">
              120
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            
            <h2 className="text-gray-500 font-medium">
              Laporan Diproses
            </h2>

            <p className="text-4xl font-bold text-yellow-500 mt-4">
              35
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            
            <h2 className="text-gray-500 font-medium">
              Laporan Selesai
            </h2>

            <p className="text-4xl font-bold text-green-600 mt-4">
              85
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}