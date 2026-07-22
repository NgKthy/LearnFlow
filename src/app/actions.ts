"use server";

import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export interface ResourceChartData {
  date: string;
  count: number;
}

export interface CourseProgressData {
  name: string;
  progress: number;
  total: number;
  completed: number;
}

/**
 * Fetch resource counts grouped by date for the last 7 days
 */
export async function getDashboardChartData(): Promise<ResourceChartData[]> {
  const endDate = dayjs().endOf("day");
  const startDate = dayjs().subtract(6, "day").startOf("day");

  // Query resources created in the last 7 days
  const resources = await prisma.resource.findMany({
    where: {
      createdAt: {
        gte: startDate.toDate(),
        lte: endDate.toDate(),
      },
    },
    select: {
      createdAt: true,
    },
  });

  // Initialize map for last 7 days with count 0
  const dateMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const formattedDate = dayjs().subtract(i, "day").format("DD/MM");
    dateMap[formattedDate] = 0;
  }

  // Populate map with actual counts
  resources.forEach((resource) => {
    const formattedDate = dayjs(resource.createdAt).format("DD/MM");
    if (dateMap[formattedDate] !== undefined) {
      dateMap[formattedDate]++;
    }
  });

  // Convert to array format for Recharts
  return Object.entries(dateMap).map(([date, count]) => ({
    date,
    count,
  }));
}

/**
 * Fetch progress percentage for all active courses
 */
export async function getCourseProgressData(): Promise<CourseProgressData[]> {
  const courses = await prisma.course.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      resources: {
        select: {
          status: true,
        },
      },
    },
  });

  return courses.map((course) => {
    const total = course.resources.length;
    const completed = course.resources.filter((r) => r.status === "DONE").length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      name: course.title,
      progress,
      total,
      completed,
    };
  });
}
