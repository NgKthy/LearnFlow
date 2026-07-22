"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Action: Assign an Inbox Resource to a Course
 * Updates courseId and changes status to "TODO" for Kanban visibility
 */
export async function assignInboxResource(resourceId: string, courseId: string) {
  if (!resourceId) {
    throw new Error("Resource ID is required");
  }
  if (!courseId) {
    throw new Error("Course ID is required");
  }

  // Verify course exists
  const courseExists = await prisma.course.findUnique({
    where: { id: courseId },
  });
  if (!courseExists) {
    throw new Error("Course not found");
  }

  // Update resource
  const resource = await prisma.resource.update({
    where: { id: resourceId },
    data: {
      courseId: courseId,
      status: "TODO", // Transition to TODO for Course Kanban columns
    },
  });

  revalidatePath("/inbox");
  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
  revalidatePath("/library");
  revalidatePath(`/resource/${resourceId}`);

  return { success: true, resource };
}

/**
 * Action: Delete/ignore a resource from Inbox
 */
export async function deleteInboxResource(resourceId: string) {
  if (!resourceId) {
    throw new Error("Resource ID is required");
  }

  await prisma.resource.delete({
    where: { id: resourceId },
  });

  revalidatePath("/inbox");
  revalidatePath("/library");

  return { success: true };
}
