"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const TagInputSchema = z.object({
  name: z.string().min(1, "Tên tag không được để trống").max(50, "Tên tag tối đa 50 ký tự"),
});

/**
 * Action: Create a new Tag
 */
export async function createTag(name: string) {
  const validated = TagInputSchema.parse({ name: name.trim() });

  const existing = await prisma.tag.findUnique({
    where: { name: validated.name },
  });

  if (existing) {
    throw new Error("Tag này đã tồn tại.");
  }

  const tag = await prisma.tag.create({
    data: {
      name: validated.name,
    },
  });

  revalidatePath("/tags");
  revalidatePath("/library");
  return { success: true, tag };
}

/**
 * Action: Update Tag name
 */
export async function updateTag(tagId: string, name: string) {
  if (!tagId) {
    throw new Error("Tag ID is required");
  }

  const validated = TagInputSchema.parse({ name: name.trim() });

  const existing = await prisma.tag.findUnique({
    where: { name: validated.name },
  });

  if (existing && existing.id !== tagId) {
    throw new Error("Tên tag đã trùng với một tag khác.");
  }

  const tag = await prisma.tag.update({
    where: { id: tagId },
    data: {
      name: validated.name,
    },
  });

  revalidatePath("/tags");
  revalidatePath("/library");
  return { success: true, tag };
}

/**
 * Action: Delete a Tag
 */
export async function deleteTag(tagId: string) {
  if (!tagId) {
    throw new Error("Tag ID is required");
  }

  await prisma.tag.delete({
    where: { id: tagId },
  });

  revalidatePath("/tags");
  revalidatePath("/library");
  return { success: true };
}

/**
 * Action: Merge source tag into target tag
 * Moves all resources of sourceTag to targetTag, then deletes sourceTag.
 */
export async function mergeTags(sourceTagId: string, targetTagId: string) {
  if (!sourceTagId || !targetTagId) {
    throw new Error("Both source and target tag IDs are required");
  }
  if (sourceTagId === targetTagId) {
    throw new Error("Không thể gộp hai tag trùng nhau.");
  }

  // Verify tags exist
  const [sourceTag, targetTag] = await Promise.all([
    prisma.tag.findUnique({ where: { id: sourceTagId }, include: { resources: true } }),
    prisma.tag.findUnique({ where: { id: targetTagId } }),
  ]);

  if (!sourceTag || !targetTag) {
    throw new Error("Một hoặc cả hai tag không tồn tại.");
  }

  // Transaction to update resources and delete source tag
  await prisma.$transaction(async (tx) => {
    // Connect all resources of sourceTag to targetTag
    for (const resource of sourceTag.resources) {
      await tx.resource.update({
        where: { id: resource.id },
        data: {
          tags: {
            connect: { id: targetTagId },
            disconnect: { id: sourceTagId },
          },
        },
      });
    }

    // Delete the source tag
    await tx.tag.delete({
      where: { id: sourceTagId },
    });
  });

  revalidatePath("/tags");
  revalidatePath("/library");
  return { success: true };
}
