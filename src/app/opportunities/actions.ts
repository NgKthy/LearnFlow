"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const OpportunityInputSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(100, "Tiêu đề tối đa 100 ký tự"),
  description: z.string().optional(),
  url: z.string().url("Định dạng liên kết (URL) không hợp lệ").or(z.string().length(0)).optional(),
  type: z.enum(["JOB", "SCHOLARSHIP"]),
  status: z.enum(["OPEN", "APPLIED", "CLOSED"]),
});

export async function createOpportunity(data: {
  title: string;
  description?: string;
  url?: string;
  type: "JOB" | "SCHOLARSHIP";
  status: "OPEN" | "APPLIED" | "CLOSED";
}) {
  const validated = OpportunityInputSchema.parse(data);

  const opportunity = await prisma.opportunity.create({
    data: {
      title: validated.title,
      description: validated.description || null,
      url: validated.url || null,
      type: validated.type,
      status: validated.status,
    },
  });

  revalidatePath("/opportunities");
  return { success: true, opportunity };
}

export async function updateOpportunity(
  id: string,
  data: {
    title: string;
    description?: string;
    url?: string;
    type: "JOB" | "SCHOLARSHIP";
    status: "OPEN" | "APPLIED" | "CLOSED";
  }
) {
  if (!id) {
    throw new Error("Opportunity ID is required");
  }

  const validated = OpportunityInputSchema.parse(data);

  const opportunity = await prisma.opportunity.update({
    where: { id },
    data: {
      title: validated.title,
      description: validated.description || null,
      url: validated.url || null,
      type: validated.type,
      status: validated.status,
    },
  });

  revalidatePath("/opportunities");
  return { success: true, opportunity };
}

export async function deleteOpportunity(id: string) {
  if (!id) {
    throw new Error("Opportunity ID is required");
  }

  await prisma.opportunity.delete({
    where: { id },
  });

  revalidatePath("/opportunities");
  return { success: true };
}
