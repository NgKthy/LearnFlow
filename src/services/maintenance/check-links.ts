import { prisma } from "@/lib/prisma";

export interface ScanResult {
  id: string;
  title: string;
  url: string;
  status: "OK" | "BROKEN";
  statusCode?: number | null;
  error?: string | null;
}

export async function scanBrokenLinks(): Promise<{
  scannedCount: number;
  brokenCount: number;
  results: ScanResult[];
}> {
  try {
    // Query all resources with a valid http/https url
    const resources = await prisma.resource.findMany({
      where: {
        url: {
          startsWith: "http",
        },
      },
      select: {
        id: true,
        title: true,
        url: true,
      },
    });

    const total = resources.length;

    // Initialize progress tracking in database
    await prisma.$transaction([
      prisma.setting.upsert({
        where: { key: "LINK_SCAN_STATUS" },
        update: { value: "SCANNING" },
        create: { key: "LINK_SCAN_STATUS", value: "SCANNING" },
      }),
      prisma.setting.upsert({
        where: { key: "LINK_SCAN_TOTAL" },
        update: { value: total.toString() },
        create: { key: "LINK_SCAN_TOTAL", value: total.toString() },
      }),
      prisma.setting.upsert({
        where: { key: "LINK_SCAN_PROCESSED" },
        update: { value: "0" },
        create: { key: "LINK_SCAN_PROCESSED", value: "0" },
      }),
      prisma.setting.upsert({
        where: { key: "LINK_SCAN_BROKEN" },
        update: { value: "0" },
        create: { key: "LINK_SCAN_BROKEN", value: "0" },
      }),
      prisma.setting.upsert({
        where: { key: "LINK_SCAN_PERCENTAGE" },
        update: { value: "0" },
        create: { key: "LINK_SCAN_PERCENTAGE", value: "0" },
      }),
      prisma.setting.upsert({
        where: { key: "LINK_SCAN_DATE" },
        update: { value: new Date().toISOString() },
        create: { key: "LINK_SCAN_DATE", value: new Date().toISOString() },
      }),
    ]);

    const results: ScanResult[] = [];
    let brokenCount = 0;
    let processedCount = 0;

    console.time("Broken Link Scan");
    console.log(`[LinkScanner] Starting scan of ${resources.length} resources...`);

    const batchSize = 5;
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < resources.length; i += batchSize) {
      const batch = resources.slice(i, i + batchSize);
      const batchIndex = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(resources.length / batchSize);
      
      console.log(
        `[LinkScanner] Scanning batch ${batchIndex}/${totalBatches} (Resources ${i + 1} to ${Math.min(
          i + batchSize,
          resources.length
        )})...`
      );

      const batchPromises = batch.map(async (resource) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

          // Try HEAD request first
          let response = await fetch(resource.url, {
            method: "HEAD",
            signal: controller.signal,
            headers: { 
              "User-Agent": "Mozilla/5.5 (compatible; LearnFlowLinkScanner/1.0)",
              "Accept": "*/*"
            },
          }).catch(async () => {
            // Fallback to GET if HEAD fails/is blocked
            const getController = new AbortController();
            const getTimeoutId = setTimeout(() => getController.abort(), 6000);
            return fetch(resource.url, {
              method: "GET",
              signal: getController.signal,
              headers: { 
                "User-Agent": "Mozilla/5.5 (compatible; LearnFlowLinkScanner/1.0)",
                "Accept": "*/*"
              },
            });
          });

          clearTimeout(timeoutId);

          const isBroken = !response.ok;
          
          const res: ScanResult = {
            id: resource.id,
            title: resource.title,
            url: resource.url,
            status: isBroken ? "BROKEN" : "OK",
            statusCode: response.status,
          };

          if (isBroken) {
            brokenCount++;
          }
          return res;

        } catch (err: any) {
          brokenCount++;
          return {
            id: resource.id,
            title: resource.title,
            url: resource.url,
            status: "BROKEN",
            error: err.name === "AbortError" 
              ? "Hết thời gian phản hồi (Timeout)" 
              : "Không thể kết nối (Connection Error)",
          } as ScanResult;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      processedCount += batch.length;

      // Update progress in DB after each batch
      const percentage = total > 0 ? Math.round((processedCount / total) * 100) : 0;
      await prisma.$transaction([
        prisma.setting.upsert({
          where: { key: "LINK_SCAN_PROCESSED" },
          update: { value: processedCount.toString() },
          create: { key: "LINK_SCAN_PROCESSED", value: processedCount.toString() },
        }),
        prisma.setting.upsert({
          where: { key: "LINK_SCAN_BROKEN" },
          update: { value: brokenCount.toString() },
          create: { key: "LINK_SCAN_BROKEN", value: brokenCount.toString() },
        }),
        prisma.setting.upsert({
          where: { key: "LINK_SCAN_PERCENTAGE" },
          update: { value: percentage.toString() },
          create: { key: "LINK_SCAN_PERCENTAGE", value: percentage.toString() },
        }),
      ]);

      // Apply delay of 1s between batches (except the last one)
      if (i + batchSize < resources.length) {
        await delay(1000);
      }
    }

    console.timeEnd("Broken Link Scan");
    const successCount = resources.length - brokenCount;
    console.log(
      `[Telemetry] Link Scanner Finished. Total: ${resources.length}, Success: ${successCount}, Broken: ${brokenCount}`
    );

    const finalResults = results.filter(r => r.status === "BROKEN");

    // Save final state as COMPLETED
    await prisma.$transaction([
      prisma.setting.upsert({
        where: { key: "LINK_SCAN_STATUS" },
        update: { value: "COMPLETED" },
        create: { key: "LINK_SCAN_STATUS", value: "COMPLETED" },
      }),
      prisma.setting.upsert({
        where: { key: "LINK_SCAN_RESULTS" },
        update: { value: JSON.stringify(finalResults) },
        create: { key: "LINK_SCAN_RESULTS", value: JSON.stringify(finalResults) },
      }),
    ]);

    return {
      scannedCount: resources.length,
      brokenCount,
      results: finalResults,
    };
  } catch (error) {
    console.error("[LinkScanner] Critical scanner failure", error);
    await prisma.setting.upsert({
      where: { key: "LINK_SCAN_STATUS" },
      update: { value: "FAILED" },
      create: { key: "LINK_SCAN_STATUS", value: "FAILED" },
    });
    throw error;
  }
}
