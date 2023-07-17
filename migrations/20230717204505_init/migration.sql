-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "threadid" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "author" INTEGER NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thread" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "author" INTEGER NOT NULL,

    CONSTRAINT "thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "picture" TEXT NOT NULL DEFAULT 'person.png',
    "email" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_comments_1" ON "comments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_thread_1" ON "thread"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "profile_id_key" ON "profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_userid_key" ON "profile"("userid");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_threadid_fkey" FOREIGN KEY ("threadid") REFERENCES "thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_fkey" FOREIGN KEY ("author") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread" ADD CONSTRAINT "thread_author_fkey" FOREIGN KEY ("author") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
