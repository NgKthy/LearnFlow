"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PortfolioItemSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  resourceId: z.string().nullable().optional(),
});

export async function createPortfolioItem(data: any) {
  const validated = PortfolioItemSchema.parse(data);

  // Find max order
  const maxOrderItem = await prisma.portfolioItem.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const nextOrder = (maxOrderItem?.order ?? -1) + 1;

  const item = await prisma.portfolioItem.create({
    data: {
      title: validated.title,
      description: validated.description || null,
      isPublic: validated.isPublic,
      order: nextOrder,
      resourceId: validated.resourceId || null,
      userId: "default", // hardcoded default for single user LMS
    },
  });

  revalidatePath("/portfolio");
  return { success: true, item };
}

export async function updatePortfolioItem(id: string, data: any) {
  const validated = PortfolioItemSchema.parse(data);

  const item = await prisma.portfolioItem.update({
    where: { id },
    data: {
      title: validated.title,
      description: validated.description || null,
      isPublic: validated.isPublic,
      resourceId: validated.resourceId || null,
    },
  });

  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/default`);
  return { success: true, item };
}

export async function deletePortfolioItem(id: string) {
  await prisma.portfolioItem.delete({
    where: { id },
  });

  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/default`);
  return { success: true };
}

export async function togglePublicStatus(id: string, isPublic: boolean) {
  await prisma.portfolioItem.update({
    where: { id },
    data: { isPublic },
  });

  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/default`);
  return { success: true };
}

export async function reorderPortfolioItems(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.portfolioItem.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/default`);
  return { success: true };
}
