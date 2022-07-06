-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "TMDBid" TEXT NOT NULL,
    "listId" TEXT,
    CONSTRAINT "Movie_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_TMDBid_key" ON "Movie"("TMDBid");
