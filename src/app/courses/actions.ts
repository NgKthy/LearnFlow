"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod schemas for validation
const CourseInputSchema = z.object({
  title: z.string().min(1, "Tên khóa học là bắt buộc"),
  description: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).default("ACTIVE"),
});

const CourseStatusSchema = z.object({
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]),
});

/**
 * Action: Create a new course
 */
export async function createCourse(formData: {
  title: string;
  description?: string | null;
  status?: "ACTIVE" | "DRAFT" | "ARCHIVED";
}) {
  const validated = CourseInputSchema.parse(formData);

  const course = await prisma.course.create({
    data: {
      title: validated.title,
      description: validated.description ?? null,
      status: validated.status,
    },
  });

  revalidatePath("/courses");
  return { success: true, course };
}

/**
 * Action: Update an existing course details
 */
export async function updateCourse(
  courseId: string,
  formData: {
    title: string;
    description?: string | null;
    status?: "ACTIVE" | "DRAFT" | "ARCHIVED";
  }
) {
  if (!courseId) {
    throw new Error("Course ID is required");
  }

  const validated = CourseInputSchema.parse(formData);

  const course = await prisma.course.update({
    where: { id: courseId },
    data: {
      title: validated.title,
      description: validated.description ?? null,
      status: validated.status,
    },
  });

  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
  return { success: true, course };
}

/**
 * Action: Delete a course
 * Associated resources will have their courseId set to NULL (onDelete: SetNull)
 */
export async function deleteCourse(courseId: string) {
  if (!courseId) {
    throw new Error("Course ID is required");
  }

  await prisma.course.delete({
    where: { id: courseId },
  });

  revalidatePath("/courses");
  return { success: true };
}

/**
 * Action: Assign a Resource to a Course
 * Pass courseId = null to unassign resource (returns it to Inbox/Library)
 */
export async function assignResourceToCourse(resourceId: string, courseId: string | null) {
  if (!resourceId) {
    throw new Error("Resource ID is required");
  }

  // If courseId is provided, verify the course exists
  if (courseId) {
    const courseExists = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!courseExists) {
      throw new Error("Course not found");
    }
  }

  const resource = await prisma.resource.update({
    where: { id: resourceId },
    data: {
      courseId: courseId,
    },
  });

  revalidatePath("/courses");
  if (courseId) revalidatePath(`/courses/${courseId}`);
  revalidatePath("/library");
  revalidatePath(`/resource/${resourceId}`);

  return { success: true, resource };
}

/**
 * Action: Change status of an existing Course
 */
export async function updateCourseStatus(
  courseId: string,
  status: "ACTIVE" | "DRAFT" | "ARCHIVED"
) {
  if (!courseId) {
    throw new Error("Course ID is required");
  }

  const validated = CourseStatusSchema.parse({ status });

  const course = await prisma.course.update({
    where: { id: courseId },
    data: {
      status: validated.status,
    },
  });

  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
  return { success: true, course };
}

/**
 * Action: Update a Resource status (for Kanban drag-and-drop: TODO, IN_PROGRESS, DONE)
 */
export async function updateResourceStatus(resourceId: string, status: string) {
  if (!resourceId) {
    throw new Error("Resource ID is required");
  }

  const resource = await prisma.resource.update({
    where: { id: resourceId },
    data: {
      status,
    },
  });

  revalidatePath("/courses");
  if (resource.courseId) {
    revalidatePath(`/courses/${resource.courseId}`);
  }
  revalidatePath("/library");
  revalidatePath(`/resource/${resourceId}`);
  
  return { success: true, resource };
}
