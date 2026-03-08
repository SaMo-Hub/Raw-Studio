-- CreateTable
CREATE TABLE "RawSportHomeItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageName" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RawSportGalleryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageName" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "RawSportHomeItem_type_idx" ON "RawSportHomeItem"("type");

-- CreateIndex
CREATE INDEX "RawSportHomeItem_isActive_idx" ON "RawSportHomeItem"("isActive");

-- CreateIndex
CREATE INDEX "RawSportHomeItem_displayOrder_idx" ON "RawSportHomeItem"("displayOrder");

-- CreateIndex
CREATE INDEX "RawSportGalleryItem_category_idx" ON "RawSportGalleryItem"("category");

-- CreateIndex
CREATE INDEX "RawSportGalleryItem_isActive_idx" ON "RawSportGalleryItem"("isActive");

-- CreateIndex
CREATE INDEX "RawSportGalleryItem_displayOrder_idx" ON "RawSportGalleryItem"("displayOrder");
