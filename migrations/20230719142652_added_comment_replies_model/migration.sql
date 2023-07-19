-- CreateTable
CREATE TABLE "commentReplies" (
    "id" SERIAL NOT NULL,
    "commentId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "author" INTEGER NOT NULL,

    CONSTRAINT "commentReplies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "commentReplies_id_key" ON "commentReplies"("id");

-- AddForeignKey
ALTER TABLE "commentReplies" ADD CONSTRAINT "commentReplies_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentReplies" ADD CONSTRAINT "commentReplies_author_fkey" FOREIGN KEY ("author") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
