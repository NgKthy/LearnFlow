import Link from "next/link";
import { getPaginatedResources } from "@/repositories/resource";
import { Button } from "@/components/ui/button";
import { ResourceCard } from "@/components/resource/ResourceCard";
import { Pagination } from "@/components/library/Pagination";

interface PageProps {
    searchParams: Promise<{
        page?: string;
    }>;
}

export default async function LibraryPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const currentPage = parseInt(resolvedParams.page || "1", 10);
    
    const { resources, total, totalPages } = await getPaginatedResources(currentPage, 12);

    return (

        <section className="space-y-8">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        📚 Thư viện
                    </h1>

                    <p className="text-muted-foreground">
                        Tất cả tài liệu đã lưu
                    </p>

                </div>

                <Button render={<Link href="/upload" />}>
                    ➕ Thêm tài liệu
                </Button>

            </div>

            {resources.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-slate-50">
                    <p className="text-slate-600 font-medium">Chưa có tài liệu nào trong thư viện.</p>
                    <p className="mt-1 text-xs text-slate-500">Hãy thêm tài liệu để bắt đầu học tập.</p>
                </div>
            ) : (
                <>
                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            lg:grid-cols-3
                            gap-6
                        "
                    >

                        {resources.map(resource => (

                            <ResourceCard
                                key={resource.id}
                                resource={resource}
                            />

                        ))}

                    </div>

                    <div className="pt-4">
                        <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/library" />
                    </div>
                </>
            )}

        </section>

    );
}