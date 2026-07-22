"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { updateResourceStatus } from "@/app/courses/actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Video, HelpCircle, CheckCircle2, ChevronRight, Play } from "lucide-react";
import Link from "next/link";

interface Resource {
  id: string;
  title: string;
  url: string;
  source: string;
  type: string;
  status: string;
}

interface Course {
  id: string;
  title: string;
}

interface KanbanBoardProps {
  course: Course;
  initialResources: Resource[];
}

const COLUMNS = [
  { id: "todo", title: "Cần học", statuses: ["TODO", "COMPLETED", "INBOX"], colorClass: "bg-slate-100 text-slate-700 border-slate-200" },
  { id: "in_progress", title: "Đang học", statuses: ["IN_PROGRESS"], colorClass: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "done", title: "Đã học xong", statuses: ["DONE"], colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200" }
];

export function KanbanBoard({ course, initialResources }: KanbanBoardProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setResources(initialResources);
  }, [initialResources]);

  if (!isMounted) return <div className="p-8 text-center text-slate-400">Đang tải bảng học tập...</div>;

  // Helper to map status to column id
  const getColIdByStatus = (status: string) => {
    if (status === "IN_PROGRESS") return "in_progress";
    if (status === "DONE") return "done";
    return "todo"; // Default To Do for COMPLETED, TODO, INBOX
  };

  // Helper to map column id to standard status value
  const getStatusByColId = (colId: string) => {
    if (colId === "in_progress") return "IN_PROGRESS";
    if (colId === "done") return "DONE";
    return "TODO";
  };

  // Group resources by column
  const columnsData = {
    todo: resources.filter(r => getColIdByStatus(r.status) === "todo"),
    in_progress: resources.filter(r => getColIdByStatus(r.status) === "in_progress"),
    done: resources.filter(r => getColIdByStatus(r.status) === "done")
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Check if dropped outside list or in the same spot
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColId = source.droppableId as "todo" | "in_progress" | "done";
    const destColId = destination.droppableId as "todo" | "in_progress" | "done";

    // Find dragged resource
    const draggedResource = resources.find(r => r.id === draggableId);
    if (!draggedResource) return;

    const nextStatus = getStatusByColId(destColId);

    // Optimistically update UI local state
    setResources(prev => 
      prev.map(r => r.id === draggableId ? { ...r, status: nextStatus } : r)
    );

    // Persist to Database via Server Action
    try {
      await updateResourceStatus(draggableId, nextStatus);
    } catch (err) {
      console.error("[KanbanBoard] Failed to update resource status:", err);
      // Rollback on failure
      setResources(initialResources);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const colResources = columnsData[col.id as "todo" | "in_progress" | "done"];

          return (
            <div key={col.id} className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 p-4 min-h-[500px]">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${col.id === "todo" ? "bg-slate-400" : col.id === "in_progress" ? "bg-[#0056D2]" : "bg-emerald-500"}`}></span>
                  {col.title}
                </h4>
                <span className="text-xs font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full">
                  {colResources.length}
                </span>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 flex flex-col gap-3 rounded-lg transition-colors p-1 ${
                      snapshot.isDraggingOver ? "bg-slate-100/50" : ""
                    }`}
                  >
                    {colResources.length === 0 ? (
                      <div className="h-28 flex items-center justify-center border border-dashed border-slate-200 rounded-lg text-xs text-slate-400 font-medium">
                        Kéo thả học liệu vào đây
                      </div>
                    ) : (
                      colResources.map((resource, index) => {
                        const Icon = resource.source === "YOUTUBE" ? Video : FileText;

                        return (
                          <Draggable key={resource.id} draggableId={resource.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={provided.draggableProps.style}
                                className={`bg-white p-4 rounded-lg border border-slate-200 shadow-sm transition-all hover:border-slate-300 ${
                                  snapshot.isDragging ? "shadow-md scale-[1.02] border-[#0056D2]" : ""
                                }`}
                              >
                                <div className="space-y-3">
                                  {/* Icon & Title */}
                                  <div className="flex items-start gap-2.5">
                                    <Icon className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${
                                      resource.source === "YOUTUBE" ? "text-red-500" : "text-[#0056D2]"
                                    }`} />
                                    <h5 className="font-semibold text-slate-900 text-xs line-clamp-2 leading-relaxed">
                                      {resource.title}
                                    </h5>
                                  </div>

                                  {/* Footer Action link */}
                                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                                      {resource.source}
                                    </span>
                                    <Link 
                                      href={`/resource/${resource.id}`}
                                      className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#0056D2] hover:underline"
                                    >
                                      Học ngay
                                      <ChevronRight className="h-3 w-3" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
