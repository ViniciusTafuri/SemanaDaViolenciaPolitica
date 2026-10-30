-- CreateEnum
CREATE TYPE "Category" AS ENUM ('MORTE', 'AGRESSAO', 'INTIMIDACAO_DESTRUICAO');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "isIndigenous" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "donationLink" TEXT,
    "incidentDate" TIMESTAMP(3),
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditSuggestion" (
    "id" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    "proposedCategory" "Category",
    "proposedIsIndigenous" BOOLEAN NOT NULL DEFAULT false,
    "proposedTitle" TEXT,
    "proposedText" TEXT,
    "proposedPhotoUrl" TEXT,
    "proposedDonationLink" TEXT,
    "proposedIncidentDate" TIMESTAMP(3),
    "proposedSourcesJson" TEXT,
    "submitterNote" TEXT,
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EditSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "News_status_category_idx" ON "News"("status", "category");

-- CreateIndex
CREATE INDEX "News_status_isIndigenous_idx" ON "News"("status", "isIndigenous");

-- CreateIndex
CREATE INDEX "Source_newsId_idx" ON "Source"("newsId");

-- CreateIndex
CREATE INDEX "EditSuggestion_status_idx" ON "EditSuggestion"("status");

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditSuggestion" ADD CONSTRAINT "EditSuggestion_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;
