/*
  Warnings:

  - You are about to alter the column `author` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Made the column `author` on table `comments` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `author` to the `thread` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "threadid" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" INTEGER NOT NULL,
    CONSTRAINT "comments_threadid_fkey" FOREIGN KEY ("threadid") REFERENCES "thread" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_comments" ("author", "createdAt", "id", "text", "threadid") SELECT "author", "createdAt", "id", "text", "threadid" FROM "comments";
DROP TABLE "comments";
ALTER TABLE "new_comments" RENAME TO "comments";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_comments_1" ON "comments"("id");
Pragma writable_schema=0;
CREATE TABLE "new_thread" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" INTEGER NOT NULL,
    CONSTRAINT "thread_author_fkey" FOREIGN KEY ("author") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_thread" ("createdAt", "id", "title") SELECT "createdAt", "id", "title" FROM "thread";
DROP TABLE "thread";
ALTER TABLE "new_thread" RENAME TO "thread";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_thread_1" ON "thread"("id");
Pragma writable_schema=0;
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
