"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  FolderOpen, 
  Brain, 
  GraduationCap, 
  Calendar, 
  Clock,
  Settings,
  Sparkles,
  X,
  Inbox,
  Tag,
  Route,
  Briefcase,
  Award
} from "lucide-react";

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Tổng quan",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Khóa học",
      href: "/courses",
      icon: FolderOpen,
    },
    {
      name: "Lộ trình",
      href: "/paths",
      icon: Route,
    },
    {
      name: "Thư viện",
      href: "/library",
      icon: BookOpen,
    },
    {
      name: "Hòm thư (Inbox)",
      href: "/inbox",
      icon: Inbox,
    },
    {
      name: "Quản lý nhãn",
      href: "/tags",
      icon: Tag,
    },
    {
      name: "Lịch học (Routine)",
      href: "/routine",
      icon: Calendar,
    },
    {
      name: "Flashcards",
      href: "/flashcards",
      icon: Brain,
    },
    {
      name: "Trắc nghiệm Quiz",
      href: "/quiz",
      icon: GraduationCap,
    },
    {
      name: "Lịch ôn tập",
      href: "/review",
      icon: Clock,
    },
    {
      name: "Portfolio",
      href: "/portfolio",
      icon: Award,
    },
    {
      name: "Cơ hội",
      href: "/opportunities",
      icon: Briefcase,
    },
    {
      name: "Cài đặt",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white h-screen sticky top-0 flex flex-col justify-between text-slate-700 shadow-sm shrink-0">
      {/* Brand Logo - Coursera Rebrand */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0056D2] text-white shadow-sm">
            <Sparkles className="h-4.5 w-4.5 fill-current" />
          </span>
          <span className="font-extrabold text-xl tracking-tight text-[#0056D2]">
            LearnFlow
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 md:hidden"
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links - Scrollable */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#EEF4FD] text-[#0056D2]"
                  : "hover:bg-slate-50 hover:text-slate-900 text-slate-600"
              }`}
            >
              {/* Active left indicator strip */}
              {isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#0056D2] rounded-r-md"></span>
              )}

              <Icon className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105 ${
                isActive ? "text-[#0056D2]" : "text-slate-500 group-hover:text-slate-600"
              }`} />

              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer Info */}
      <div className="p-4 border-t border-slate-100 text-center bg-slate-50/50 shrink-0">
        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          LearnFlow v1.1.0
        </span>
      </div>
    </aside>
  );
}