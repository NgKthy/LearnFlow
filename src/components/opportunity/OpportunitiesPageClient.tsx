"use client";

import React, { useState } from "react";
import { OpportunityCard } from "./OpportunityCard";
import { OpportunityManager } from "./OpportunityManager";
import { Briefcase } from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  type: string;
  status: string;
}

interface OpportunitiesPageClientProps {
  opportunities: Opportunity[];
}

export function OpportunitiesPageClient({ opportunities }: OpportunitiesPageClientProps) {
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  const handleEdit = (opp: Opportunity) => {
    setEditingOpportunity(opp);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearEdit = () => {
    setEditingOpportunity(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Opportunities List */}
      <div className="lg:col-span-2 space-y-4">
        {opportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-xl">
            <Briefcase className="h-8 w-8 text-slate-300 mb-3" />
            <p className="text-slate-600 font-bold text-xs">Chưa có cơ hội học tập/việc làm nào</p>
            <p className="text-slate-500 text-[10px] font-semibold mt-0.5">
              Hãy dùng biểu mẫu bên cạnh để ghi chép và theo dõi trạng thái các vị trí tuyển dụng, học bổng bạn quan tâm.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opp) => (
              <OpportunityCard 
                key={opp.id} 
                opportunity={opp} 
                onEdit={() => handleEdit(opp)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Opportunity Creator/Editor Form */}
      <div className="lg:col-span-1">
        <OpportunityManager 
          editingOpportunity={editingOpportunity} 
          onClearEdit={handleClearEdit} 
        />
      </div>
    </div>
  );
}
