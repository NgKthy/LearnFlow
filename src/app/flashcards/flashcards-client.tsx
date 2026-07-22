"use client";

import { useState, useMemo } from "react";
import { Search, Sparkles, BookOpen, Clock, Brain, X, ArrowRight, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlashcardViewer } from "@/components/learning/FlashcardViewer";

interface Flashcard {
    id: string;
    question: string;
    answer: string;
    hint?: string | null;
    nextReview: Date | string;
}

interface Resource {
    id: string;
    title: string;
    flashcards: Flashcard[];
}

interface Props {
    resources: Resource[];
}

export default function FlashcardsClient({ resources }: Props) {
    const [activeTab, setActiveTab] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedResourceId, setSelectedResourceId] = useState<string>("all");
    const [studyingCards, setStudyingCards] = useState<Flashcard[] | null>(null);
    const [studyingTitle, setStudyingTitle] = useState("");

    // Calculate overall metrics
    const totalCards = useMemo(() => {
        return resources.reduce((sum, res) => sum + res.flashcards.length, 0);
    }, [resources]);

    const dueCards = useMemo(() => {
        const now = new Date();
        return resources.reduce((sum, res) => {
            return sum + res.flashcards.filter(c => new Date(c.nextReview) <= now).length;
        }, 0);
    }, [resources]);

    // Flat list of all flashcards with resource title info
    const allFlashcardsFlat = useMemo(() => {
        return resources.flatMap(res => 
            res.flashcards.map(card => ({
                ...card,
                resourceId: res.id,
                resourceTitle: res.title
            }))
        );
    }, [resources]);

    // Filtered flashcards for the "List" tab
    const filteredFlashcards = useMemo(() => {
        return allFlashcardsFlat.filter(card => {
            const matchesSearch = 
                card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.answer.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesResource = 
                selectedResourceId === "all" || card.resourceId === selectedResourceId;
            return matchesSearch && matchesResource;
        });
    }, [allFlashcardsFlat, searchQuery, selectedResourceId]);

    // Resources that have cards (for the grid view)
    const resourcesWithCards = useMemo(() => {
        return resources.filter(res => res.flashcards.length > 0);
    }, [resources]);

    // Start a study session
    const startStudySession = (cards: Flashcard[], title: string) => {
        setStudyingCards(cards);
        setStudyingTitle(title);
    };

    const handleStudyDue = () => {
        const now = new Date();
        const due = allFlashcardsFlat.filter(c => new Date(c.nextReview) <= now);
        if (due.length > 0) {
            startStudySession(due, "Thẻ đến hạn ôn tập");
        }
    };

    const handleStudyAll = () => {
        if (allFlashcardsFlat.length > 0) {
            startStudySession(allFlashcardsFlat, "Tất cả thẻ ghi nhớ");
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header section with Stats */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/80 p-8 shadow-2xl backdrop-blur-md">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"></div>
                <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"></div>

                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                                <Brain className="h-5 w-5" />
                            </span>
                            <span className="text-sm font-semibold tracking-wider text-indigo-400 uppercase">Flashcards</span>
                        </div>
                        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                            Thư viện học tập
                        </h1>
                        <p className="mt-2 text-slate-400 max-w-xl text-sm leading-relaxed">
                            Ôn tập kiến thức thông qua các bộ thẻ ghi nhớ tự động tạo từ tài liệu học tập của bạn bằng AI.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {dueCards > 0 && (
                            <Button 
                                onClick={handleStudyDue}
                                className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-orange-600 animate-pulse">
                                    {dueCards}
                                </span>
                                Ôn tập thẻ đến hạn
                            </Button>
                        )}
                        <Button 
                            variant="outline"
                            onClick={handleStudyAll}
                            disabled={totalCards === 0}
                            className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-slate-300 font-semibold"
                        >
                            Luyện tập tất cả ({totalCards})
                        </Button>
                    </div>
                </div>

                {/* Stats row */}
                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-6 sm:grid-cols-4">
                    <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                        <span className="text-xs text-slate-400 font-medium">Tổng số tài liệu</span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">{resourcesWithCards.length}</span>
                            <span className="text-xs text-slate-500">tài liệu</span>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                        <span className="text-xs text-slate-400 font-medium">Tổng số thẻ</span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-indigo-400">{totalCards}</span>
                            <span className="text-xs text-slate-500">thẻ</span>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                        <span className="text-xs text-slate-400 font-medium">Cần ôn tập ngay</span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className={`text-2xl font-bold ${dueCards > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                                {dueCards}
                            </span>
                            <span className="text-xs text-slate-500">thẻ</span>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                        <span className="text-xs text-slate-400 font-medium">Trạng thái</span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-emerald-400">
                                {dueCards === 0 && totalCards > 0 ? "Đã hoàn thành 🎉" : "Đang học tập 📚"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Tabs Navigation */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex rounded-xl bg-slate-900/60 p-1 border border-white/5 self-start">
                    <button
                        onClick={() => setActiveTab("grid")}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                            activeTab === "grid"
                                ? "bg-indigo-600 text-white shadow-md"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <Library className="h-4 w-4" />
                        Theo học trình
                    </button>
                    <button
                        onClick={() => setActiveTab("list")}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                            activeTab === "list"
                                ? "bg-indigo-600 text-white shadow-md"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <BookOpen className="h-4 w-4" />
                        Danh sách thẻ
                    </button>
                </div>
            </div>

            {/* TAB CONTENT: GRID BY RESOURCE */}
            {activeTab === "grid" && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {resourcesWithCards.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-slate-900/20 p-12 text-center">
                            <span className="text-5xl">📭</span>
                            <h3 className="mt-4 text-lg font-bold text-white">Chưa có Flashcards nào</h3>
                            <p className="mt-2 text-sm text-slate-400 max-w-sm">
                                Tải lên tài liệu PDF hoặc YouTube video đầu tiên của bạn để AI tự động tạo thẻ ghi nhớ học tập!
                            </p>
                            <Button asChild className="mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white">
                                <a href="/upload">Tải lên tài liệu</a>
                            </Button>
                        </div>
                    ) : (
                        resourcesWithCards.map(res => {
                            const total = res.flashcards.length;
                            const due = res.flashcards.filter(c => new Date(c.nextReview) <= new Date()).length;
                            return (
                                <div 
                                    key={res.id} 
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-6 transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-900/60 hover:shadow-xl hover:shadow-indigo-500/5"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/20">
                                                Tài liệu
                                            </span>
                                            {due > 0 && (
                                                <span className="inline-flex items-center rounded-md bg-amber-400/10 px-2 py-1 text-xs font-medium text-amber-400 ring-1 ring-inset ring-amber-400/20 animate-pulse">
                                                    {due} cần ôn
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="line-clamp-2 text-lg font-bold text-white group-hover:text-indigo-400 transition-colors duration-200">
                                            {res.title}
                                        </h3>

                                        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-sm">
                                            <div>
                                                <span className="text-xs text-slate-500 block">Tổng số thẻ</span>
                                                <span className="font-semibold text-slate-300">{total}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500 block">Tiến trình</span>
                                                <span className="font-semibold text-slate-300">
                                                    {total - due} / {total}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Simple Progress Bar */}
                                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
                                                style={{ width: `${((total - due) / total) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                                        <Button
                                            onClick={() => startStudySession(res.flashcards, res.title)}
                                            className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-2"
                                        >
                                            Luyện tập
                                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* TAB CONTENT: SEARCHABLE LIST */}
            {activeTab === "list" && (
                <div className="space-y-6">
                    {/* Filters bar */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-900/40 p-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo câu hỏi hoặc đáp án..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                            />
                        </div>
                        <div className="sm:w-64">
                            <select
                                value={selectedResourceId}
                                onChange={(e) => setSelectedResourceId(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-slate-950 py-2.5 px-3 text-sm text-slate-300 outline-none focus:border-indigo-500 transition-colors"
                            >
                                <option value="all">Tất cả tài liệu</option>
                                {resourcesWithCards.map(res => (
                                    <option key={res.id} value={res.id}>{res.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Accordion flashcards list */}
                    <div className="space-y-3">
                        {filteredFlashcards.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-slate-900/20 p-12 text-center">
                                <span className="text-4xl">🔍</span>
                                <h3 className="mt-4 text-md font-bold text-white">Không tìm thấy thẻ phù hợp</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Thử thay đổi từ khóa hoặc bộ lọc tài liệu.
                                </p>
                            </div>
                        ) : (
                            filteredFlashcards.map(card => (
                                <div 
                                    key={card.id}
                                    className="group rounded-xl border border-white/5 bg-slate-900/20 p-5 hover:border-white/10 hover:bg-slate-900/30 transition-all"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                                {card.resourceTitle}
                                            </span>
                                            <h4 className="text-base font-bold text-white leading-relaxed">
                                                {card.question}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-2 self-start">
                                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                                                <Clock className="h-3 w-3" />
                                                Hạn: {new Date(card.nextReview) <= new Date() ? "Đến hạn" : new Date(card.nextReview).toLocaleDateString("vi-VN")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Answer Dropdown (Hover/Click to Reveal) */}
                                    <div className="mt-4 border-t border-white/5 pt-4">
                                        <details className="group/details">
                                            <summary className="list-none flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-400 hover:text-white select-none outline-none">
                                                <span className="transition-transform group-open/details:rotate-90">▶</span>
                                                Hiện đáp án
                                            </summary>
                                            <div className="mt-3 pl-4 border-l-2 border-indigo-500/40 text-sm text-slate-300 leading-relaxed bg-slate-950/20 p-3 rounded-lg">
                                                {card.answer}
                                                {card.hint && (
                                                    <p className="mt-2 text-xs text-slate-400 italic">
                                                        💡 Gợi ý: {card.hint}
                                                    </p>
                                                )}
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* STUDY MODAL OVERLAY */}
            {studyingCards && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md animate-fade-in">
                    <div className="absolute right-4 top-4 z-50">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setStudyingCards(null)}
                            className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto px-4 py-8">
                        <div className="mb-6 text-center">
                            <h2 className="text-lg font-bold text-indigo-400 uppercase tracking-widest">Đang luyện tập</h2>
                            <p className="mt-1 text-2xl font-extrabold text-white line-clamp-1">{studyingTitle}</p>
                        </div>

                        {/* Embed FlashcardViewer */}
                        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 md:p-10 shadow-2xl backdrop-blur">
                            <FlashcardViewer flashcards={studyingCards} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
