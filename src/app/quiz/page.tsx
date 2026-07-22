import { prisma } from "@/lib/prisma";
import QuizClient from "./quiz-client";

export const dynamic = "force-dynamic";

export default async function QuizPage() {
    // Fetch all resources containing at least one quiz question
    const resources = await prisma.resource.findMany({
        where: {
            quizQuestions: {
                some: {},
            },
        },
        include: {
            quizQuestions: {
                select: {
                    id: true,
                    question: true,
                    options: true,
                    correctOptionIndex: true,
                    explanation: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <QuizClient resources={resources} />
        </main>
    );
}
