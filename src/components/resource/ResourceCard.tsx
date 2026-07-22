import Link from "next/link";

import { Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import {
    Button,
} from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import type { Resource, Tag } from "@prisma/client";

interface ResourceWithTags extends Resource {
    tags: Tag[];
}

interface Props {
    resource: ResourceWithTags;
}

export function ResourceCard({
    resource,
}: Props) {

    return (
        <Card className="flex flex-col">

            <CardHeader>

                <div className="flex justify-between gap-3">

                    <CardTitle className="line-clamp-2">
                        {resource.title}
                    </CardTitle>

                    <Badge>
                        {resource.source}
                    </Badge>

                </div>

            </CardHeader>

            <CardContent className="flex-1">

                <div className="flex flex-wrap gap-2 mb-4">

                    {resource.tags.map((tag: Tag) => (
                        <Badge
                            key={tag.id}
                            variant="secondary"
                        >
                            {tag.name}
                        </Badge>
                    ))}

                </div>

                <p className="text-sm text-muted-foreground line-clamp-4">
                    {resource.summary ??
                        "Chưa có tóm tắt."}
                </p>

            </CardContent>

            <CardFooter className="flex items-center justify-between">

                <div className="text-sm flex gap-3">

                    <span>
                        {resource.difficulty}
                    </span>

                    <span className="flex items-center gap-1">

                        <Clock3 className="w-4 h-4" />

                        {resource.estimatedReadingTime ??
                            0}
                        m

                    </span>

                </div>

                <Button render={<Link href={`/resource/${resource.id}`} />}>
                    Học ngay
                </Button>

            </CardFooter>

        </Card>
    );
}