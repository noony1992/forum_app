-- CreateTable
CREATE TABLE "comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "threadid" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" DECIMAL,
    "author" TEXT,
    CONSTRAINT "comments_threadid_fkey" FOREIGN KEY ("threadid") REFERENCES "thread" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "thread" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DECIMAL
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_comments_1" ON "comments"("id");
Pragma writable_schema=0;

-- CreateIndex
CREATE UNIQUE INDEX "comments_threadid_key" ON "comments"("threadid");

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_thread_1" ON "thread"("id");
Pragma writable_schema=0;
