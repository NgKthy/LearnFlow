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
 * Action: Run the broken link scanner and persist summary metrics in DB
 */
export async function runLinkScanner() {
  const scanData = await scanBrokenLinks();

  // Save metrics in DB for display
  await prisma.$transaction([
    prisma.setting.upsert({
      where: { key: "LINK_SCAN_DATE" },
      update: { value: new Date().toISOString() },
      create: { key: "LINK_SCAN_DATE", value: new Date().toISOString() },
    }),
    prisma.setting.upsert({
      where: { key: "LINK_SCAN_TOTAL" },
      update: { value: scanData.scannedCount.toString() },
      create: { key: "LINK_SCAN_TOTAL", value: scanData.scannedCount.toString() },
    }),
    prisma.setting.upsert({
      where: { key: "LINK_SCAN_BROKEN" },
      update: { value: scanData.brokenCount.toString() },
      create: { key: "LINK_SCAN_BROKEN", value: scanData.brokenCount.toString() },
    }),
    prisma.setting.upsert({
      where: { key: "LINK_SCAN_RESULTS" },
      update: { value: JSON.stringify(scanData.results) },
      create: { key: "LINK_SCAN_RESULTS", value: JSON.stringify(scanData.results) },
    }),
  ]);

  revalidatePath("/settings");
  return { success: true, scanData };
}
