"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  UploadCloud, 
  Brain, 
  GraduationCap, 
  Flame, 
  Settings,
  Sparkles
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Thư viện",
      href: "/library",
      icon: BookOpen,
    },
    {
      name: "Tải lên",
      href: "/upload",
      icon: UploadCloud,
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
      icon: Flame,
    },
    {
      name: "Cài đặt",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-slate-950 h-screen sticky top-0 flex flex-col justify-between text-slate-300">
      <div>
        {/* Brand Logo */}
        <div className="p-6 border-b border-white/5 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-4.5 w-4.5 fill-current" />
          </span>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            LearnFlow
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1.5 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                    : "hover:bg-white/5 hover:text-white text-slate-400"
                }`}
              >
                {/* Active strip indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/3 h-1/3 w-1 rounded-r-full bg-white"></span>
                )}

                <Icon className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                }`} />

                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer info */}
      <div className="p-4 border-t border-white/5 text-center">
        <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">
          LearnFlow v1.0.0
        </span>
      </div>
    </aside>
  );
}