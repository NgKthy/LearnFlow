"use client";

import React, { useState } from "react";
import { PathCard } from "./PathCard";
import { PathManager } from "./PathManager";
import { Route } from "lucide-react";

interface Resource {
  status: string;
}

interface Course {
  id: string;
  title: string;
  resources: Resource[];
}

interface PathData {
  id: string;
  title: string;
  description: string | null;
  courses: Course[];
}

interface CourseOption {
  id: string;
  title: string;
}

interface PathsPageClientProps {
  paths: PathData[];
  courses: CourseOption[];
}

export function PathsPageClient({ paths, courses }: PathsPageClientProps) {
  const [editingPath, setEditingPath] = useState<PathData | null>(null);

  const handleEdit = (path: PathData) => {
    setEditingPath(path);
    // Scroll window to top so user can see form easily
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearEdit = () => {
    setEditingPath(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* List of paths */}
      <div className="lg:col-span-2 space-y-4">
        {paths.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-xl">
            <Route className="h-8 w-8 text-slate-300 mb-3" />
            <p className="text-slate-600 font-bold text-xs">Chưa có lộ trình học tập nào được tạo</p>
            <p className="text-slate-400 text-[10px] font-semibold mt-0.5">
              Hãy dùng biểu mẫu bên cạnh để kết hợp các khóa học liên quan thành lộ trình chuyên sâu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paths.map((path) => (
              <PathCard 
                key={path.id} 
                path={path} 
                onEdit={() => handleEdit(path)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Path creator/editor panel */}
      <div className="lg:col-span-1">
        <PathManager 
          courses={courses} 
          editingPath={editingPath} 
          onClearEdit={handleClearEdit} 
        />
      </div>
    </div>
  );
}
