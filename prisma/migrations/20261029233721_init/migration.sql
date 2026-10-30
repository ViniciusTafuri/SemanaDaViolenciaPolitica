-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "donationLink" TEXT,
    "incidentDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "moderatorNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "approvedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    CONSTRAINT "Source_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EditSuggestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "newsId" TEXT NOT NULL,
    "proposedCategory" TEXT,
    "proposedTitle" TEXT,
    "proposedText" TEXT,
    "proposedPhotoUrl" TEXT,
    "proposedDonationLink" TEXT,
    "proposedIncidentDate" DATETIME,
    "proposedSourcesJson" TEXT,
    "removeDonationLink" BOOLEAN NOT NULL DEFAULT false,
    "submitterNote" TEXT,
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "moderatorNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EditSuggestion_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "News_status_category_idx" ON "News"("status", "category");

-- CreateIndex
CREATE INDEX "Source_newsId_idx" ON "Source"("newsId");

-- CreateIndex
CREATE INDEX "EditSuggestion_status_idx" ON "EditSuggestion"("status");
