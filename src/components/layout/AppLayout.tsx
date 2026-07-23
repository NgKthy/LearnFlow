"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { usePathname } from "next/navigation";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Detect public portfolio view (e.g., /portfolio/default or /portfolio/some-user-id)
  // excluding the admin portfolio page itself (/portfolio)
  const isPublicPortfolio = pathname ? /^\/portfolio\/[^/]+$/.test(pathname) : false;

  if (isPublicPortfolio) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-slate-800">
      {/* Sidebar - Desktop relative, Mobile absolute overlay */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out shrink-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <button 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-40 bg-slate-900/30 md:hidden cursor-default focus:outline-none"
          aria-label="Đóng menu"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
