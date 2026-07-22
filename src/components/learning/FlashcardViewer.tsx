"use client";

import { useCallback, useEffect, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { reviewFlashcardAction } from "@/actions/review-flashcard";

import Link from "next/link";

interface Flashcard {
    id: string;
    question: string;
    answer: string;
    hint?: string | null;
}

export type ReviewQuality =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5;

interface Props {
    flashcards: Flashcard[];
}

export function FlashcardViewer({
    flashcards,
}: Props) {
    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [isFlipped, setIsFlipped] =
        useState(false);

    const [isReviewing, setIsReviewing] =
        useState(false);

    const [isFinished, setIsFinished] =
        useState(false);

    const handleReview = useCallback(
        async (quality: ReviewQuality) => {
            if (isReviewing) return;

            const currentCard =
                flashcards[currentIndex];

            if (!currentCard) return;

            setIsReviewing(true);

            try {
                const result =
                    await reviewFlashcardAction(
                        currentCard.id,
                        quality
                    );

                if (!result.success) {
                    throw new Error(
                        result.error ??
                        "Đánh giá Flashcard thất bại."
                    );
                }

                if (
                    currentIndex <
                    flashcards.length - 1
                ) {
                    setCurrentIndex(
                        prev => prev + 1
                    );

                    setIsFlipped(false);
                } else {
                    setIsFinished(true);
                }
            } catch (error) {
                console.error(
                    "[Flashcard Review]",
                    error
                );

                // Nếu sau này dùng sonner/toast:
                // toast.error("Không thể lưu kết quả ôn tập.");
            } finally {
                setIsReviewing(false);
            }
        },
        [
            currentIndex,
            flashcards,
            isReviewing,
        ]
    );
    const current =
        flashcards[currentIndex];

    const flipCard = useCallback(() => {
        setIsFlipped(prev => !prev);
    }, []);

    const goNext = useCallback(() => {
        if (
            currentIndex >=
            flashcards.length - 1
        )
            return;

        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
    }, [currentIndex, flashcards.length]);

    const goPrev = useCallback(() => {
        if (currentIndex <= 0) return;

        setCurrentIndex(prev => prev - 1);
        setIsFlipped(false);
    }, [currentIndex]);

    useEffect(() => {
        function handleKeyDown(
            e: KeyboardEvent
        ) {
            if (
                e.target instanceof
                HTMLInputElement ||
                e.target instanceof
                HTMLTextAreaElement
            ) {
                return;
            }

            switch (e.code) {
                case "Space":
                    e.preventDefault();

                    if (!isFlipped) {
                        setIsFlipped(true);
                    } else {
                        flipCard();
                    }

                    break;

                case "Digit1":
                    if (
                        isFlipped &&
                        !isReviewing
                    ) {
                        handleReview(1);
                    }
                    break;

                case "Digit2":
                    if (
                        isFlipped &&
                        !isReviewing
                    ) {
                        handleReview(3);
                    }
                    break;

                case "Digit3":
                    if (
                        isFlipped &&
                        !isReviewing
                    ) {
                        handleReview(4);
                    }
                    break;

                case "Digit4":
                    if (
                        isFlipped &&
                        !isReviewing
                    ) {
                        handleReview(5);
                    }
                    break;
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        flipCard,
        handleReview,
        isFlipped,
        isReviewing,
    ]);

    if (flashcards.length === 0) {
        return (
            <div className="rounded-xl border p-10 text-center text-muted-foreground">
                Chưa có Flashcards.
            </div>
        );
    }
    if (isFinished) {
        return (
            <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-2xl border bg-card p-10 text-center shadow">

                <div className="text-6xl">
                    🎉
                </div>

                <div className="space-y-2">

                    <h2 className="text-2xl font-bold">
                        Bạn đã ôn tập xong tất cả thẻ!
                    </h2>

                    <p className="text-muted-foreground">
                        Hãy quay lại thư viện hoặc tiếp tục học một tài liệu khác.
                    </p>

                </div>

                <Button asChild>
                    <Link href="/library">
                        Quay lại Thư viện
                    </Link>
                </Button>

            </div>
        );
    }
    return (
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">

            {/* Progress */}

            <div className="text-sm text-muted-foreground">

                {currentIndex + 1} /{" "}
                {flashcards.length}

            </div>

            {/* Card */}

            <div
                className="
                    perspective-1000
                    w-full
                    max-w-xl
                    cursor-pointer
                "
                onClick={flipCard}
            >

                <div
                    className={`
                        relative
                        h-80
                        w-full
                        transform-style-3d
                        transition-transform
                        duration-700
                        ${isFlipped
                            ? "rotate-y-180"
                            : ""
                        }
                    `}
                >

                    {/* Front */}

                    <div
                        className="
                            backface-hidden
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            bg-card
                            p-8
                            shadow-lg
                        "
                    >

                        <div className="space-y-6 text-center">

                            <p className="text-xl font-semibold leading-8">

                                {current.question}

                            </p>

                            <p className="text-sm text-muted-foreground">

                                Click hoặc nhấn
                                Space để xem đáp
                                án

                            </p>

                        </div>

                    </div>

                    {/* Back */}

                    <div
                        className="
                            backface-hidden
                            rotate-y-180
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            bg-primary
                            p-8
                            text-primary-foreground
                            shadow-lg
                        "
                    >

                        <div className="space-y-6 text-center">

                            <p className="text-lg leading-8">

                                {current.answer}

                            </p>

                            {current.hint && (
                                <div
                                    className="
                                        rounded-lg
                                        bg-white/10
                                        p-4
                                        text-sm
                                    "
                                >
                                    💡{" "}
                                    {
                                        current.hint
                                    }
                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </div>

            {/* Controls */}

            {!isFlipped ? (

                <div className="flex flex-col items-center gap-3">

                    <Button
                        size="lg"
                        onClick={flipCard}
                    >
                        Lật thẻ
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">

                        Bấm Space hoặc Click vào thẻ để lật.

                    </p>

                </div>

            ) : (

                <div className="grid w-full max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">

                    <Button
                        variant="destructive"
                        disabled={isReviewing}
                        onClick={() =>
                            handleReview(1)
                        }
                    >
                        🔴 Lại
                        <span className="ml-2 text-xs opacity-70">
                            (1)
                        </span>
                    </Button>

                    <Button
                        variant="secondary"
                        disabled={isReviewing}
                        onClick={() =>
                            handleReview(3)
                        }
                    >
                        🟠 Khó
                        <span className="ml-2 text-xs opacity-70">
                            (2)
                        </span>
                    </Button>

                    <Button
                        disabled={isReviewing}
                        onClick={() =>
                            handleReview(4)
                        }
                    >
                        🟢 Tốt
                        <span className="ml-2 text-xs opacity-70">
                            (3)
                        </span>
                    </Button>

                    <Button
                        variant="outline"
                        disabled={isReviewing}
                        onClick={() =>
                            handleReview(5)
                        }
                    >
                        🔵 Dễ
                        <span className="ml-2 text-xs opacity-70">
                            (4)
                        </span>
                    </Button>

                </div>

            )}

            <div className="text-center text-xs text-muted-foreground">

                {!isFlipped
                    ? "⌨️ Space để lật thẻ."
                    : "⌨️ 1: Lại • 2: Khó • 3: Tốt • 4: Dễ"}

            </div>

            {/* Help */}

            <div className="text-center text-xs text-muted-foreground">

                ⌨️ Space: Lật thẻ • ←:
                Trước • →: Tiếp theo

            </div>

        </div>
    );
}