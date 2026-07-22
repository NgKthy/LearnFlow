import { prisma } from "@/lib/prisma";
import { APIKeyForm } from "@/components/settings/APIKeyForm";
import { LinkScanner } from "@/components/settings/LinkScanner";
import { BackupManager } from "@/components/settings/BackupManager";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  // Fetch existing settings from DB
  const [
    geminiApiKeySetting,
    lastScanDateSetting,
    totalScannedSetting,
    brokenCountSetting,
    brokenLinksSetting
  ] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "GEMINI_API_KEY" } }),
    prisma.setting.findUnique({ where: { key: "LINK_SCAN_DATE" } }),
    prisma.setting.findUnique({ where: { key: "LINK_SCAN_TOTAL" } }),
    prisma.setting.findUnique({ where: { key: "LINK_SCAN_BROKEN" } }),
    prisma.setting.findUnique({ where: { key: "LINK_SCAN_RESULTS" } }),
  ]);

  const initialGeminiApiKey = geminiApiKeySetting?.value || "";
  const lastScanDate = lastScanDateSetting?.value || "";
  const totalScanned = parseInt(totalScannedSetting?.value || "0", 10);
  const brokenCount = parseInt(brokenCountSetting?.value || "0", 10);
  
  let brokenLinks = [];
  if (brokenLinksSetting?.value) {
    try {
      brokenLinks = JSON.parse(brokenLinksSetting.value);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <section className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="h-8 w-8 text-[#0056D2]" />
          Cài đặt hệ thống
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Quản lý khóa cấu hình nhà cung cấp AI, thiết lập kết nối và bảo trì hệ thống
        </p>
      </div>

      <div className="max-w-3xl space-y-8">
        <APIKeyForm initialGeminiApiKey={initialGeminiApiKey} />
        
        <LinkScanner
          lastScanDate={lastScanDate}
          totalScanned={totalScanned}
          brokenCount={brokenCount}
          brokenLinks={brokenLinks}
        />

        <BackupManager />
      </div>
    </section>
  );
}
