-- CreateTable
CREATE TABLE "Routine" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "time" TEXT NOT NULL,
    "dayOfWeek" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT,
    "resourceId" TEXT,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Routine_courseId_idx" ON "Routine"("courseId");

-- CreateIndex
CREATE INDEX "Routine_resourceId_idx" ON "Routine"("resourceId");

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
