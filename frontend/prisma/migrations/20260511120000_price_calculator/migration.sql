-- CreateTable
CREATE TABLE "PriceCalculatorSection" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PriceCalculatorSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceCalculatorItem" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "pdfLine" INTEGER,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT '',
    "price" DECIMAL(12,2),
    "isHeading" BOOLEAN NOT NULL DEFAULT false,
    "fillKey" TEXT,

    CONSTRAINT "PriceCalculatorItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceCalculatorSection_slug_key" ON "PriceCalculatorSection"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PriceCalculatorItem_fillKey_key" ON "PriceCalculatorItem"("fillKey");

-- CreateIndex
CREATE INDEX "PriceCalculatorItem_sectionId_sortOrder_idx" ON "PriceCalculatorItem"("sectionId", "sortOrder");

-- AddForeignKey
ALTER TABLE "PriceCalculatorItem" ADD CONSTRAINT "PriceCalculatorItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "PriceCalculatorSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
