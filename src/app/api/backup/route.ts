import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Query all relevant user databases in parallel
    const [
      courses,
      resources,
      routines,
      flashcards,
      activities,
      notes,
      tags,
      settings
    ] = await Promise.all([
      prisma.course.findMany(),
      prisma.resource.findMany(),
      prisma.routine.findMany(),
      prisma.flashcard.findMany(),
      prisma.activity.findMany(),
      prisma.note.findMany(),
      prisma.tag.findMany(),
      prisma.setting.findMany({
        where: {
          NOT: {
            key: "GEMINI_API_KEY", // Filter out sensitive credentials
          },
        },
      }),
    ]);

    const backupData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      data: {
        courses,
        resources,
        routines,
        flashcards,
        activities,
        notes,
        tags,
        settings,
      },
    };

    const fileName = `learnflow-backup-${new Date().toISOString().split("T")[0]}.json`;

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });

  } catch (error: any) {
    console.error("[BackupExport] Failed to create backup:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tạo bản sao lưu dữ liệu." },
      { status: 500 }
    );
  }
}
