import { prisma } from "@/lib/prisma";

import { ResourceCard } from "@/components/resource/ResourceCard";

export default async function LibraryPage() {

    const resources =
        await prisma.resource.findMany({

            include: {
                tags: true,
            },

            orderBy: {
                createdAt: "desc",
            },

        });

    return (

        <section className="space-y-8">

            <div>

                <h1 className="text-3xl font-bold">
                    📚 Thư viện
                </h1>

                <p className="text-muted-foreground">
                    Tất cả tài liệu đã lưu
                </p>

            </div>

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

        </section>

    );
}