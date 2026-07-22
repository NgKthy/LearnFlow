import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
    try {
        console.log("Querying resources...");
        const res = await prisma.resource.findMany({
            take: 1,
        });
        console.log("Success! Resources queried:", res);
    } catch (err) {
        console.error("Failed to query resources:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
