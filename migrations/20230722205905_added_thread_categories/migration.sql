-- CreateTable
CREATE TABLE "threadCategories" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "threadCategories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "threadCategories_id_key" ON "threadCategories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "threadCategories_category_key" ON "threadCategories"("category");
