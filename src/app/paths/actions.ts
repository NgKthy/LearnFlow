"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PathInputSchema = z.object({
  title: z.string().min(1, "Tiêu đề lộ trình không được để trống").max(100, "Tiêu đề tối đa 100 ký tự"),
  description: z.string().optional(),
  courseIds: z.array(z.string()),
});

/**
 * Action: Create a learning Path
 */
export async function createPath(data: {
  title: string;
  description?: string;
  courseIds: string[];
}) {
  const validated = PathInputSchema.parse(data);

  const path = await prisma.$transaction(async (tx) => {
    // 1. Create the Path
    const newPath = await tx.path.create({
      data: {
        title: validated.title,
        description: validated.description,
      },
    });

    // 2. Link the courses
    if (validated.courseIds.length > 0) {
      await tx.course.updateMany({
        where: {
          id: { in: validated.courseIds },
        },
        data: {
          pathId: newPath.id,
        },
      });
    }

    return newPath;
  });

  revalidatePath("/paths");
  revalidatePath("/courses");
  return { success: true, path };
}

/**
 * Action: Update a learning Path
 */
export async function updatePath(
  pathId: string,
  data: {
    title: string;
    description?: string;
    courseIds: string[];
  }
) {
  if (!pathId) {
    throw new Error("Path ID is required");
  }

  const validated = PathInputSchema.parse(data);

  const path = await prisma.$transaction(async (tx) => {
    // 1. Update Path text fields
    const updatedPath = await tx.path.update({
      where: { id: pathId },
      data: {
        title: validated.title,
        description: validated.description,
      },
    });

    // 2. Clear old links to this path
    await tx.course.updateMany({
      where: { pathId },
      data: { pathId: null },
    });

    // 3. Connect new courses
    if (validated.courseIds.length > 0) {
      await tx.course.updateMany({
        where: {
          id: { in: validated.courseIds },
        },
        data: {
          pathId: updatedPath.id,
        },
      });
    }

    return updatedPath;
  });

  revalidatePath("/paths");
  revalidatePath("/courses");
  return { success: true, path };
}

/**
 * Action: Delete a learning Path
 */
export async function deletePath(pathId: string) {
  if (!pathId) {
    throw new Error("Path ID is required");
  }

  // Course.pathId is configured with onDelete: SetNull in schema.prisma,
  // so deleting the Path will automatically nullify the reference in courses.
  await prisma.path.delete({
    where: { id: pathId },
  });

  revalidatePath("/paths");
  revalidatePath("/courses");
  return { success: true };
}
