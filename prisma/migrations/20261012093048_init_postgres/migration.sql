-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "casts" TEXT[],
    "trailerUrl" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'English',
    "releaseStatus" TEXT NOT NULL DEFAULT 'Released',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theatre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "pincode" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theatre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieTheatre" (
    "movieId" TEXT NOT NULL,
    "theatreId" TEXT NOT NULL,

    CONSTRAINT "MovieTheatre_pkey" PRIMARY KEY ("movieId","theatreId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_name_key" ON "Movie"("name");

-- CreateIndex
CREATE INDEX "Theatre_city_idx" ON "Theatre"("city");

-- CreateIndex
CREATE INDEX "Theatre_pincode_idx" ON "Theatre"("pincode");

-- CreateIndex
CREATE INDEX "MovieTheatre_theatreId_idx" ON "MovieTheatre"("theatreId");

-- AddForeignKey
ALTER TABLE "MovieTheatre" ADD CONSTRAINT "MovieTheatre_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieTheatre" ADD CONSTRAINT "MovieTheatre_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "Theatre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
