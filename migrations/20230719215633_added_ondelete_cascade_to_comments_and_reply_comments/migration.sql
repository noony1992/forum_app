-- DropForeignKey
ALTER TABLE "commentReplies" DROP CONSTRAINT "commentReplies_commentId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_threadid_fkey";

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_threadid_fkey" FOREIGN KEY ("threadid") REFERENCES "thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentReplies" ADD CONSTRAINT "commentReplies_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
