-- CreateIndex
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt");

-- CreateIndex
CREATE INDEX "Activity_action_idx" ON "Activity"("action");

-- CreateIndex
CREATE INDEX "Flashcard_resourceId_idx" ON "Flashcard"("resourceId");

-- CreateIndex
CREATE INDEX "QuizQuestion_resourceId_idx" ON "QuizQuestion"("resourceId");
