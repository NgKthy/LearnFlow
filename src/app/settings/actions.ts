"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { scanBrokenLinks } from "@/services/maintenance/check-links";

const SettingsInputSchema = z.record(z.string(), z.string());

/**
 * Action: Save system settings in the database (API Keys, etc.)
 */
export async function saveSettings(settings: Record<string, string>) {
  const validated = SettingsInputSchema.parse(settings);

  // Perform upsert transactions for each key-value pair
  await prisma.$transaction(
    Object.entries(validated).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: value.trim() },
        create: { key, value: value.trim() },
      })
    )
  );

  revalidatePath("/settings");
  return { success: true };
}

/**
 * Action: Start the broken link scanner asynchronously in the background
 */
export async function runLinkScanner() {
  // Check if already running
  const currentStatus = await prisma.setting.findUnique({
    where: { key: "LINK_SCAN_STATUS" },
  });

  if (currentStatus?.value === "SCANNING") {
    return { success: false, error: "Tiến trình quét đang được thực hiện." };
  }

  // Start the link scanner asynchronously (do not await it)
  scanBrokenLinks()
    .then(() => {
      // Revalidate settings path once complete so user sees final statistics
      revalidatePath("/settings");
    })
    .catch((err) => {
      console.error("[Background LinkScanner Error]", err);
    });

  return { success: true };
}

/**
 * Action: Get current Link Scanner progress state
 */
export async function getLinkScannerProgress() {
  const [
    statusSetting,
    totalSetting,
    processedSetting,
    brokenSetting,
    percentageSetting,
    resultsSetting,
  ] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "LINK_SCAN_STATUS" } }),
    prisma.setting.findUnique({ where: { key: "LINK_SCAN_TOTAL" } }),
    prisma.setting.findUnique({ where: { key: "LINK_SCAN_PROCESSED" } }),
    prisma.setting.findUnique({ where: { key: "LINK_SCAN_BROKEN" } }),
    prisma.setting.findUnique({ where: { key: "LINK_SCAN_PERCENTAGE" } }),
    prisma.setting.findUnique({ where: { key: "LINK_SCAN_RESULTS" } }),
  ]);

  let brokenLinks = [];
  if (resultsSetting?.value) {
    try {
      brokenLinks = JSON.parse(resultsSetting.value);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    status: statusSetting?.value || "IDLE",
    total: parseInt(totalSetting?.value || "0", 10),
    processed: parseInt(processedSetting?.value || "0", 10),
    failed: parseInt(brokenSetting?.value || "0", 10),
    percentage: parseInt(percentageSetting?.value || "0", 10),
    brokenLinks,
  };
}
