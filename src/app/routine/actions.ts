"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod schema for input validation
const RoutineInputSchema = z.object({
  title: z.string().min(1, "Tiêu đề lịch học là bắt buộc"),
  description: z.string().optional().nullable(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Định dạng giờ học không hợp lệ (HH:MM)"),
  dayOfWeek: z.array(z.string()).optional().nullable(),
  courseId: z.string().optional().nullable(),
  resourceId: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

/**
 * Action: Create a learning routine
 */
export async function createRoutine(formData: {
  title: string;
  description?: string | null;
  time: string;
  dayOfWeek?: string[] | null;
  courseId?: string | null;
  resourceId?: string | null;
  active?: boolean;
}) {
  const validated = RoutineInputSchema.parse(formData);

  // Convert array of days to comma-separated string for DB storage
  const dayOfWeekStr = validated.dayOfWeek && validated.dayOfWeek.length > 0 
    ? validated.dayOfWeek.join(",") 
    : null;

  const routine = await prisma.routine.create({
    data: {
      title: validated.title,
      description: validated.description ?? null,
      time: validated.time,
      dayOfWeek: dayOfWeekStr,
      courseId: validated.courseId ?? null,
      resourceId: validated.resourceId ?? null,
      active: validated.active,
    },
  });

  revalidatePath("/");
  revalidatePath("/routine");
  return { success: true, routine };
}

/**
 * Action: Update an existing learning routine
 */
export async function updateRoutine(
  routineId: string,
  formData: {
    title: string;
    description?: string | null;
    time: string;
    dayOfWeek?: string[] | null;
    courseId?: string | null;
    resourceId?: string | null;
    active?: boolean;
  }
) {
  if (!routineId) {
    throw new Error("Routine ID is required");
  }

  const validated = RoutineInputSchema.parse(formData);

  const dayOfWeekStr = validated.dayOfWeek && validated.dayOfWeek.length > 0 
    ? validated.dayOfWeek.join(",") 
    : null;

  const routine = await prisma.routine.update({
    where: { id: routineId },
    data: {
      title: validated.title,
      description: validated.description ?? null,
      time: validated.time,
      dayOfWeek: dayOfWeekStr,
      courseId: validated.courseId ?? null,
      resourceId: validated.resourceId ?? null,
      active: validated.active,
    },
  });

  revalidatePath("/");
  revalidatePath("/routine");
  return { success: true, routine };
}

/**
 * Action: Delete a routine
 */
export async function deleteRoutine(routineId: string) {
  if (!routineId) {
    throw new Error("Routine ID is required");
  }

  await prisma.routine.delete({
    where: { id: routineId },
  });

  revalidatePath("/");
  revalidatePath("/routine");
  return { success: true };
}

/**
 * Action: Toggle active status of a learning routine
 */
export async function toggleRoutineActive(routineId: string, active: boolean) {
  if (!routineId) {
    throw new Error("Routine ID is required");
  }

  const routine = await prisma.routine.update({
    where: { id: routineId },
    data: {
      active,
    },
  });

  revalidatePath("/");
  revalidatePath("/routine");
  return { success: true, routine };
}
