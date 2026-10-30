-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EditSuggestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "newsId" TEXT NOT NULL,
    "proposedCategory" TEXT,
    "proposedIsIndigenous" BOOLEAN NOT NULL DEFAULT false,
    "proposedTitle" TEXT,
    "proposedText" TEXT,
    "proposedPhotoUrl" TEXT,
    "proposedDonationLink" TEXT,
    "proposedIncidentDate" DATETIME,
    "proposedSourcesJson" TEXT,
    "submitterNote" TEXT,
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EditSuggestion_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EditSuggestion" ("createdAt", "id", "newsId", "proposedCategory", "proposedDonationLink", "proposedIncidentDate", "proposedPhotoUrl", "proposedSourcesJson", "proposedText", "proposedTitle", "status", "submitterEmail", "submitterName", "submitterNote", "updatedAt") SELECT "createdAt", "id", "newsId", "proposedCategory", "proposedDonationLink", "proposedIncidentDate", "proposedPhotoUrl", "proposedSourcesJson", "proposedText", "proposedTitle", "status", "submitterEmail", "submitterName", "submitterNote", "updatedAt" FROM "EditSuggestion";
DROP TABLE "EditSuggestion";
ALTER TABLE "new_EditSuggestion" RENAME TO "EditSuggestion";
CREATE INDEX "EditSuggestion_status_idx" ON "EditSuggestion"("status");
CREATE TABLE "new_News" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "isIndigenous" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "donationLink" TEXT,
    "incidentDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "approvedAt" DATETIME
);
INSERT INTO "new_News" ("approvedAt", "category", "createdAt", "donationLink", "id", "incidentDate", "photoUrl", "status", "submitterEmail", "submitterName", "text", "title", "updatedAt") SELECT "approvedAt", "category", "createdAt", "donationLink", "id", "incidentDate", "photoUrl", "status", "submitterEmail", "submitterName", "text", "title", "updatedAt" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
CREATE INDEX "News_status_category_idx" ON "News"("status", "category");
CREATE INDEX "News_status_isIndigenous_idx" ON "News"("status", "isIndigenous");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
