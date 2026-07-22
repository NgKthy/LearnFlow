"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between shadow-sm shrink-0">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 md:hidden focus:outline-none"
            aria-label="Mở menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          📚 Personal LMS
        </h1>
      </div>

      <span className="text-xs font-semibold text-slate-500 bg-slate-100 py-1 px-2.5 rounded-full">
        Học mỗi ngày
      </span>
    </header>
  );
}