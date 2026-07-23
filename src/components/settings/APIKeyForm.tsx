"use client";

import React, { useState, useTransition } from "react";
import { saveSettings } from "@/app/settings/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Key, Eye, EyeOff, Loader2, Save, Check } from "lucide-react";

interface APIKeyFormProps {
  initialGeminiApiKey: string;
}

export function APIKeyForm({ initialGeminiApiKey }: APIKeyFormProps) {
  const [isPending, startTransition] = useTransition();
  const [geminiApiKey, setGeminiApiKey] = useState(initialGeminiApiKey);
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("idle");
    setError(null);

    startTransition(async () => {
      try {
        const res = await saveSettings({
          GEMINI_API_KEY: geminiApiKey,
        });

        if (res.success) {
          setStatus("success");
          // Hide success status after 3 seconds
          setTimeout(() => setStatus("idle"), 3000);
        } else {
          setStatus("error");
          setError("Lưu cấu hình thất bại.");
        }
      } catch (err: any) {
        setStatus("error");
        setError(err.message || "Đã xảy ra lỗi.");
      }
    });
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-1.5">
          <Key className="h-4.5 w-4.5 text-[#0056D2]" />
          Cấu hình API Keys (AI Provider)
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Nhập khóa API Gemini để kích hoạt các tính năng phân tích văn bản, tóm tắt và sinh flashcards/quizzes.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === "success" && (
            <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
              <Check className="h-4 w-4" />
              Lưu cấu hình API Key thành công!
            </div>
          )}
          {status === "error" && error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="gemini_key" className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Gemini API Key *
            </label>
            <div className="relative">
              <input
                id="gemini_key"
                type={showKey ? "text" : "password"}
                placeholder="AIzaSy..."
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-3.5 pr-10 py-2 text-sm focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2]"
                required
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                tabIndex={-1}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              Khóa API của bạn được lưu an toàn trong cơ sở dữ liệu. Nếu không được đặt, hệ thống sẽ tự động sử dụng biến môi trường mặc định.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white shadow-md font-semibold text-xs py-2 px-4"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
