import { prisma } from "@/lib/prisma";

import type {
    Activity,
    IngestionLog,
    Resource,
} from "@prisma/client";

import type { MetadataDTO } from "@/bot/types";

/**
 * Persist an ingested resource and its related logs.
 *
 * This repository is responsible for writing data into the database.
 * Business logic (URL extraction, metadata scraping, platform detection)
 * should already be completed before calling this function.
 *
 * All database operations are wrapped inside an Interactive Transaction
 * to guarantee data consistency.
 */
export async function saveIngestedResource(
    dto: MetadataDTO,
    rawMessage: string
): Promise<{
    resource: Resource;
    ingestionLog: IngestionLog;
    activity: Activity;
}> {
    try {
        return await prisma.$transaction(async (tx) => {
            // --------------------------------------------------
            // Step 1
            // Create Resource
            // --------------------------------------------------

            const resource = await tx.resource.create({
                data: {
                    title: dto.title,
                    url: dto.url,
                    description: dto.description,
                    thumbnail: dto.thumbnail,
                    author: dto.author,

                    source: dto.platform,
                    type: dto.type,
                    status: "INBOX",
                },
            });

            // --------------------------------------------------
            // Step 2
            // Create Ingestion Log
            // --------------------------------------------------

            const ingestionLog =
                await tx.ingestionLog.create({
                    data: {
                        platform: dto.platform,

                        rawMessage,

                        extractedUrl: dto.url,

                        metadataFetched: true,

                        success: true,

                        resourceId: resource.id,
                    },
                });

            // --------------------------------------------------
            // Step 3
            // Create Activity Log
            // --------------------------------------------------

            const activity =
                await tx.activity.create({
                    data: {
                        action: "RESOURCE_INGESTED",

                        payload: JSON.stringify({
                            url: dto.url,
                            title: dto.title,
                        }),
                    },
                });

            // --------------------------------------------------
            // Return all created records
            // --------------------------------------------------

            return {
                resource,
                ingestionLog,
                activity,
            };
        });
    } catch (error) {
        console.error(
            "[ResourceRepository] Failed to save ingested resource.",
            {
                dto,
                rawMessage,
                error,
            }
        );

        throw error;
    }
}
