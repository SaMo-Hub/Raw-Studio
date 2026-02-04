-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "longDesc" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "videos" TEXT,
    "technologies" TEXT NOT NULL,
    "externalLink" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Project" ("createdAt", "displayOrder", "externalLink", "featured", "id", "images", "longDesc", "shortDesc", "slug", "technologies", "title", "updatedAt", "videos") SELECT "createdAt", "displayOrder", "externalLink", "featured", "id", "images", "longDesc", "shortDesc", "slug", "technologies", "title", "updatedAt", "videos" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE INDEX "Project_slug_idx" ON "Project"("slug");
CREATE INDEX "Project_featured_idx" ON "Project"("featured");
CREATE INDEX "Project_isActive_idx" ON "Project"("isActive");
CREATE INDEX "Project_displayOrder_idx" ON "Project"("displayOrder");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
