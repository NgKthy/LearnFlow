"use client";

import { useState, useMemo } from "react";
import { Search, Sparkles, BookOpen, Clock, Brain, X, ArrowRight, Library, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizViewer } from "@/components/learning/QuizViewer";

interface QuizQuestion {
    id: string;
    question: string;
    options: string;
    correctOptionIndex: number;
    explanation: string;
}

interface Resource {
    id: string;
    title: string;
    quizQuestions: QuizQuestion[];
}

interface Props {
    resources: Resource[];
}

export default function QuizClient({ resources }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[] | null>(null);
    const [activeQuizTitle, setActiveQuizTitle] = useState("");

    // Filter resources that have quiz questions
    const resourcesWithQuizzes = useMemo(() => {
        return resources.filter(res => res.quizQuestions.length > 0);
    }, [resources]);

    // Search and filter resources with quizzes
    const filteredResources = useMemo(() => {
        return resourcesWithQuizzes.filter(res => 
            res.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [resourcesWithQuizzes, searchQuery]);

    // Overall stats
    const totalQuizzes = resourcesWithQuizzes.length;
    const totalQuestions = useMemo(() => {
        return resourcesWithQuizzes.reduce((sum, res) => sum + res.quizQuestions.length, 0);
    }, [resourcesWithQuizzes]);

    const startQuizSession = (questions: QuizQuestion[], title: string) => {
        setActiveQuizQuestions(questions);
        setActiveQuizTitle(title);
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header section with Stats */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/80 p-8 shadow-2xl backdrop-blur-md">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl"></div>
                <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl"></div>

                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
                                <HelpCircle className="h-5 w-5" />
                            </span>
                            <span className="text-sm font-semibold tracking-wider text-violet-400 uppercase">Interactive Quizzes</span>
                        </div>
                        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                            Khảo sát trắc nghiệm
                        </h1>
                        <p className="mt-2 text-slate-400 max-w-xl text-sm leading-relaxed">
                            Kiểm tra mức độ hiểu tài liệu của bạn qua các câu hỏi trắc nghiệm tự động tạo bởi trí tuệ nhân tạo (AI).
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Button 
                            onClick={() => {
                                // Study all quiz questions in a giant exam
                                const allQuestions = resourcesWithQuizzes.flatMap(r => r.quizQuestions);
                                if (allQuestions.length > 0) {
                                    startQuizSession(allQuestions, "Tất cả câu hỏi trắc nghiệm");
                                }
                            }}
                            disabled={totalQuestions === 0}
                            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-violet-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Thử thách tổng hợp ({totalQuestions} câu)
                        </Button>
                    </div>
                </div>

                {/* Stats row */}
                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-6 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                        <span className="text-xs text-slate-400 font-medium">Bộ trắc nghiệm</span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">{totalQuizzes}</span>
                            <span className="text-xs text-slate-500">tài liệu</span>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                        <span className="text-xs text-slate-400 font-medium">Tổng số câu hỏi</span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-violet-400">{totalQuestions}</span>
                            <span className="text-xs text-slate-500">câu hỏi</span>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                        <span className="text-xs text-slate-400 font-medium">Phương thức</span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-emerald-400">Tự động chấm điểm 🎯</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                    type="text"
                    placeholder="Tìm bộ trắc nghiệm theo tên tài liệu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/40 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                />
            </div>

            {/* Quiz Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResources.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-slate-900/20 p-12 text-center">
                        <span className="text-5xl">📭</span>
                        <h3 className="mt-4 text-lg font-bold text-white">Chưa có bài trắc nghiệm</h3>
                        <p className="mt-2 text-sm text-slate-400 max-w-sm">
                            Tải lên tài liệu của bạn để AI tự động trích xuất bài kiểm tra trắc nghiệm giúp củng cố kiến thức!
                        </p>
                        <Button asChild className="mt-6 rounded-xl bg-violet-600 hover:bg-violet-700 text-white">
                            <a href="/upload">Tải lên tài liệu</a>
                        </Button>
                    </div>
                ) : (
                    filteredResources.map(res => {
                        const count = res.quizQuestions.length;
                        return (
                            <div 
                                key={res.id} 
                                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-6 transition-all duration-300 hover:border-violet-500/30 hover:bg-slate-900/60 hover:shadow-xl hover:shadow-violet-500/5"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center rounded-md bg-violet-400/10 px-2 py-1 text-xs font-medium text-violet-400 ring-1 ring-inset ring-violet-400/20">
                                            Trắc nghiệm
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {count} câu hỏi
                                        </span>
                                    </div>

                                    <h3 className="line-clamp-2 text-lg font-bold text-white group-hover:text-violet-400 transition-colors duration-200">
                                        {res.title}
                                    </h3>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                                    <Button
                                        onClick={() => startQuizSession(res.quizQuestions, res.title)}
                                        className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-xs py-2"
                                    >
                                        Bắt đầu làm bài
                                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* QUIZ MODAL OVERLAY */}
            {activeQuizQuestions && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md animate-fade-in">
                    <div className="absolute right-4 top-4 z-50">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setActiveQuizQuestions(null)}
                            className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto px-4 py-8">
                        <div className="mb-6 text-center">
                            <h2 className="text-lg font-bold text-violet-400 uppercase tracking-widest">Đang làm bài trắc nghiệm</h2>
                            <p className="mt-1 text-2xl font-extrabold text-white line-clamp-1">{activeQuizTitle}</p>
                        </div>

                        {/* Embed QuizViewer */}
                        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 md:p-10 shadow-2xl backdrop-blur">
                            <QuizViewer quizQuestions={activeQuizQuestions} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
