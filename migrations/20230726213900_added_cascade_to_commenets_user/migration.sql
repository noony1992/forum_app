-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_author_fkey";

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_fkey" FOREIGN KEY ("author") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
