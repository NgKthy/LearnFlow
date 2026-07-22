"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { retryProcessing } from "@/app/resource/actions";
import { RefreshCcw } from "lucide-react";

interface RetryButtonProps {
    resourceId: string;
}

export function RetryButton({ resourceId }: RetryButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleRetry = () => {
        startTransition(async () => {
            try {
                await retryProcessing(resourceId);
            } catch (error) {
                console.error("[RetryButton] Failed to request retry:", error);
                alert("Không thể gửi yêu cầu xử lý lại. Vui lòng thử lại sau.");
            }
        });
    };

    return (
        <Button
            onClick={handleRetry}
            disabled={isPending}
            className="w-full h-10 flex items-center justify-center gap-2"
        >
            <RefreshCcw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
            {isPending ? "Đang gửi yêu cầu xử lý..." : "Thử lại bằng AI"}
        </Button>
    );
}
