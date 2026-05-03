-- Drop the old pdfUrl column if it exists
ALTER TABLE "NewsPost" DROP COLUMN IF EXISTS "pdfUrl";
ALTER TABLE "NewsPost" DROP COLUMN IF EXISTS "youtubeEmbed";

-- Add new columns for attachments and YouTube embed
ALTER TABLE "NewsPost" ADD COLUMN "attachmentUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "NewsPost" ADD COLUMN "youtubeEmbeds" TEXT[] DEFAULT ARRAY[]::TEXT[];
