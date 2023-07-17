/*
  Warnings:

  - You are about to alter the column `createdAt` on the `thread` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `DateTime`.
  - You are about to alter the column `createdAt` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `DateTime`.

*/
-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_thread" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_thread" ("createdAt", "id", "title") SELECT coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "id", "title" FROM "thread";
DROP TABLE "thread";
ALTER TABLE "new_thread" RENAME TO "thread";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_thread_1" ON "thread"("id");
Pragma writable_schema=0;
CREATE TABLE "new_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "threadid" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT,
    CONSTRAINT "comments_threadid_fkey" FOREIGN KEY ("threadid") REFERENCES "thread" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_comments" ("author", "createdAt", "id", "text", "threadid") SELECT "author", coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "id", "text", "threadid" FROM "comments";
DROP TABLE "comments";
ALTER TABLE "new_comments" RENAME TO "comments";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_comments_1" ON "comments"("id");
Pragma writable_schema=0;
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
