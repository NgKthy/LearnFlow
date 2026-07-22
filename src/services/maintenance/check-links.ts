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

  const results: ScanResult[] = [];
  let brokenCount = 0;

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

  return {
    scannedCount: resources.length,
    brokenCount,
    results: results.filter(r => r.status === "BROKEN"), // Return only broken ones
  };
}
