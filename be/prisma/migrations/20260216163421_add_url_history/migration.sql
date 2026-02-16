-- CreateTable
CREATE TABLE "UrlHistory" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "title" TEXT,
    "thumbnail" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UrlHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UrlHistory_userId_createdAt_idx" ON "UrlHistory"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "UrlHistory_createdAt_idx" ON "UrlHistory"("createdAt" DESC);
