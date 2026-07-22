"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadPdf } from "./actions";
import { Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [progressMessage, setProgressMessage] = useState("📂 Đang đọc và trích xuất nội dung văn bản từ file PDF...");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Smooth simulated status message transitions
    useEffect(() => {
        if (status !== "processing") return;

        const messages = [
            "📂 Đang đọc và trích xuất nội dung văn bản từ file PDF...",
            "🧠 AI đang đọc hiểu tài liệu và phân loại...",
            "📝 Đang tạo bản tóm tắt chi tiết và gắn thẻ kiến thức...",
            "🔥 AI đang sinh bộ Flashcards ôn tập thông minh...",
            "⚡ Đang thiết lập các câu hỏi trắc nghiệm tự động...",
            "💾 Đang hoàn thiện lưu trữ dữ liệu vào database PostgreSQL...",
        ];

        let index = 0;

        const interval = setInterval(() => {
            if (index < messages.length - 1) {
                index++;
                setProgressMessage(messages[index]);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [status]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
                setErrorMessage("");
            } else {
                setErrorMessage("Chỉ hỗ trợ file định dạng PDF.");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setErrorMessage("");
        }
    };

    const onButtonClick = () => {
        fileInputRef.current?.click();
    };

    async function handleSubmit() {
        if (!file) return;

        setStatus("processing");
        setErrorMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await uploadPdf(formData);
            if (response.success && response.resourceId) {
                setStatus("success");
                setTimeout(() => {
                    router.push(`/resource/${response.resourceId}`);
                }, 1000);
            } else {
                throw new Error("Không nhận được phản hồi hợp lệ từ máy chủ.");
            }
        } catch (error) {
            console.error("[Upload] Error uploading PDF:", error);
            setStatus("error");
            const msg = error instanceof Error ? error.message : "Đã xảy ra lỗi trong quá trình xử lý tài liệu.";
            setErrorMessage(msg);
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            {/* Header section */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                    Tải lên tài liệu học tập
                </h2>
                <p className="mt-2 text-muted-foreground">
                    Hệ thống sẽ tự động đọc văn bản, tóm tắt nội dung và sinh bộ câu hỏi ôn tập (Flashcards/Quiz) bằng AI.
                </p>
            </div>

            {/* Glassmorphic Card Container */}
            <div className="backdrop-blur-md bg-white/40 dark:bg-black/30 border border-white/20 dark:border-white/5 shadow-2xl rounded-3xl p-8 transition-all duration-300">
                
                {status === "idle" && (
                    <div className="space-y-6">
                        {/* Drag and Drop Area */}
                        <div
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            onClick={onButtonClick}
                            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] ${
                                dragActive
                                    ? "border-primary bg-primary/5 scale-[1.01]"
                                    : "border-border hover:border-muted-foreground hover:bg-muted/10"
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <div className="p-4 bg-primary/5 rounded-full mb-4">
                                <Upload className="h-8 w-8 text-primary" />
                            </div>

                            {file ? (
                                <div className="space-y-1">
                                    <p className="font-semibold text-foreground max-w-[350px] truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <p className="font-semibold text-foreground">
                                        Kéo thả file PDF vào đây
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        hoặc click để chọn file từ máy tính
                                    </p>
                                </div>
                            )}
                        </div>

                        {errorMessage && (
                            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={!file}
                            className="w-full h-11 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/95 transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
                        >
                            Tải lên & Phân tích bằng AI
                        </button>
                    </div>
                )}

                {status === "processing" && (
                    <div className="py-12 flex flex-col items-center justify-center space-y-6">
                        <div className="relative flex items-center justify-center">
                            <Loader2 className="h-14 w-14 text-primary animate-spin" />
                            <div className="absolute text-xs font-bold text-primary">AI</div>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-lg text-foreground">
                                Đang xử lý tài liệu...
                            </h3>
                            <p className="text-sm text-muted-foreground min-h-[20px] transition-all duration-300">
                                {progressMessage}
                            </p>
                        </div>
                    </div>
                )}

                {status === "success" && (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                        <div className="p-3 bg-green-500/10 rounded-full border border-green-500/20">
                            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-lg text-foreground">
                                Phân tích tài liệu thành công!
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Đang chuyển hướng bạn tới trang tài liệu...
                            </p>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6 py-6 text-center flex flex-col items-center">
                        <div className="p-3 bg-destructive/10 rounded-full border border-destructive/20 mb-2">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                        </div>
                        <div className="space-y-2 max-w-md">
                            <h3 className="font-bold text-lg text-foreground">
                                Gặp sự cố khi tải lên
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {errorMessage || "Đã xảy ra lỗi không xác định."}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setFile(null);
                                setStatus("idle");
                                setErrorMessage("");
                            }}
                            className="w-40 h-10 border border-input bg-background hover:bg-accent text-foreground font-medium rounded-xl transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}