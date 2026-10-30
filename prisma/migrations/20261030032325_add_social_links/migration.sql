-- AlterTable
ALTER TABLE "EditSuggestion" ADD COLUMN     "proposedSocialLinksJson" TEXT;

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SocialLink_newsId_idx" ON "SocialLink"("newsId");

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;
