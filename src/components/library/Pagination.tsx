import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    if (totalPages <= 1) return null;

    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;

    const prevUrl = `${baseUrl}?page=${currentPage - 1}`;
    const nextUrl = `${baseUrl}?page=${currentPage + 1}`;

    return (
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
            <div className="flex flex-1 justify-between sm:hidden">
                {hasPrev ? (
                    <Link
                        href={prevUrl}
                        className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Trước
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-400 cursor-not-allowed">
                        Trước
                    </span>
                )}
                {hasNext ? (
                    <Link
                        href={nextUrl}
                        className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Tiếp theo
                    </Link>
                ) : (
                    <span className="relative ml-3 inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-400 cursor-not-allowed">
                        Tiếp theo
                    </span>
                )}
            </div>
            
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-slate-700">
                        Hiển thị trang <span className="font-semibold">{currentPage}</span> trên tổng số{" "}
                        <span className="font-semibold">{totalPages}</span> trang
                    </p>
                </div>
                
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {hasPrev ? (
                            <Link
                                href={prevUrl}
                                className="relative inline-flex items-center rounded-l-md px-3 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 transition-colors"
                            >
                                <span className="sr-only">Trang trước</span>
                                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </Link>
                        ) : (
                            <span className="relative inline-flex items-center rounded-l-md px-3 py-2 text-slate-300 ring-1 ring-inset ring-slate-200 bg-slate-50 cursor-not-allowed">
                                <span className="sr-only">Trang trước</span>
                                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </span>
                        )}
                        
                        {/* Page Numbers Summary */}
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 focus:outline-none">
                            {currentPage} / {totalPages}
                        </span>

                        {hasNext ? (
                            <Link
                                href={nextUrl}
                                className="relative inline-flex items-center rounded-r-md px-3 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 transition-colors"
                            >
                                <span className="sr-only">Trang sau</span>
                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </Link>
                        ) : (
                            <span className="relative inline-flex items-center rounded-r-md px-3 py-2 text-slate-300 ring-1 ring-inset ring-slate-200 bg-slate-50 cursor-not-allowed">
                                <span className="sr-only">Trang sau</span>
                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </span>
                        )}
                    </nav>
                </div>
            </div>
        </div>
    );
}
