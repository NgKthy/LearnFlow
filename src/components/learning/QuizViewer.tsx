"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { Lightbulb } from "lucide-react";

interface QuizQuestion {
    id: string;
    question: string;
    options: string;
    correctOptionIndex: number;
    explanation: string;
}

interface QuizViewerProps {
    quizQuestions: QuizQuestion[];
}

export function QuizViewer({
    quizQuestions,
}: QuizViewerProps) {
    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [selectedOption, setSelectedOption] =
        useState<number | null>(null);

    const [isSubmitted, setIsSubmitted] =
        useState(false);

    const [score, setScore] =
        useState(0);

    const [isFinished, setIsFinished] =
        useState(false);

    const isLastQuestion =
        currentIndex === quizQuestions.length - 1;

    const handleSubmit = () => {
        if (selectedOption === null) return;

        if (
            selectedOption ===
            currentQuestion.correctOptionIndex
        ) {
            setScore(prev => prev + 1);
        }

        setIsSubmitted(true);
    };

    const handleNext = () => {
        if (isLastQuestion) {
            setIsFinished(true);
            return;
        }

        setCurrentIndex(prev => prev + 1);

        setSelectedOption(null);

        setIsSubmitted(false);
    };

    const handleRetry = () => {
        setCurrentIndex(0);

        setScore(0);

        setIsFinished(false);

        setSelectedOption(null);

        setIsSubmitted(false);
    };

    const currentQuestion =
        quizQuestions[currentIndex];

    const parsedOptions = useMemo(() => {
        if (!currentQuestion) return [];
        try {
            return JSON.parse(
                currentQuestion.options
            ) as string[];
        } catch {
            return [];
        }
    }, [currentQuestion]);

    if (quizQuestions.length === 0) {
        return (
            <div className="rounded-xl border p-10 text-center text-muted-foreground">
                Chưa có câu hỏi Quiz.
            </div>
        );
    }
    if (isFinished) {

        const percentage =
            (score / quizQuestions.length) * 100;

        return (
            <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-2xl border bg-card p-10 text-center shadow">

                <div className="text-6xl">

                    🎉

                </div>

                <div className="space-y-2">

                    <h2 className="text-2xl font-bold">

                        Bạn đã hoàn thành bài trắc nghiệm!

                    </h2>

                    <p className="text-muted-foreground">

                        Điểm của bạn

                    </p>

                    <div className="text-4xl font-bold">

                        {score} / {quizQuestions.length}

                    </div>

                </div>

                <div className="text-lg">

                    {percentage === 100
                        ? "🏆 Tuyệt vời!"
                        : percentage >= 50
                            ? "👏 Làm tốt lắm!"
                            : "📚 Hãy xem lại phần Tóm tắt nhé!"}

                </div>

                <Button
                    onClick={handleRetry}
                >
                    Làm lại từ đầu
                </Button>

            </div>
        );

    }
    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6">

            {/* Progress */}

            <div className="text-sm text-muted-foreground">

                Câu {currentIndex + 1} /{" "}
                {quizQuestions.length}

            </div>

            {/* Question */}

            <div className="rounded-xl border bg-card p-6 shadow-sm">

                <h2 className="text-xl font-semibold leading-8">

                    {currentQuestion.question}

                </h2>

            </div>

            {/* Options */}

            <div className="space-y-3">

                {parsedOptions.map((option, index) => {

                    const isCorrect =
                        index === currentQuestion.correctOptionIndex;

                    const isWrongSelection =
                        index === selectedOption &&
                        !isCorrect;

                    let optionClass =
                        `
            w-full
            rounded-xl
            border
            p-4
            text-left
            transition-all
            duration-200
        `;

                    if (!isSubmitted) {
                        optionClass +=
                            selectedOption === index
                                ? " border-indigo-500 bg-indigo-500/10 text-indigo-400"
                                : " border-white/10 bg-slate-900/40 text-slate-300 hover:bg-slate-900/80 hover:border-white/20";

                    } else {

                        if (isCorrect) {

                            optionClass += " border-emerald-500/50 bg-emerald-500/10 text-emerald-400";

                        } else if (isWrongSelection) {

                            optionClass += " border-red-500/50 bg-red-500/10 text-red-400";

                        } else {

                            optionClass += " opacity-40 pointer-events-none";

                        }

                    }

                    return (

                        <button
                            key={index}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() =>
                                setSelectedOption(index)
                            }
                            className={cn(optionClass)}
                        >

                            <div className="flex gap-3">

                                <span className="font-semibold">

                                    {String.fromCharCode(
                                        65 + index
                                    )}
                                    .

                                </span>

                                <span>{option}</span>

                            </div>

                        </button>

                    );

                })}

            </div>

            {/* Explanation */}

            {isSubmitted && (
                <div
                    className="
                        rounded-xl
                        border
                        bg-muted/40
                        p-5
                        space-y-3
                    "
                >
                    <div className="flex items-center gap-2 font-semibold">

                        <Lightbulb className="h-5 w-5 text-yellow-500" />

                        Giải thích

                    </div>

                    <p className="leading-7 text-muted-foreground">

                        {currentQuestion.explanation}

                    </p>

                </div>
            )}

            {/* Footer */}

            <div className="flex justify-end">

                {!isSubmitted ? (

                    <Button
                        onClick={handleSubmit}
                        disabled={selectedOption === null}
                    >
                        Kiểm tra
                    </Button>

                ) : isLastQuestion ? (

                    <Button onClick={handleNext}>
                        Hoàn thành
                    </Button>

                ) : (

                    <Button onClick={handleNext}>
                        Câu tiếp theo
                    </Button>

                )}

            </div>

        </div>
    );
}