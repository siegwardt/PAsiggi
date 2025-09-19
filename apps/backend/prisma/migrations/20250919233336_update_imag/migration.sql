/*
  Warnings:

  - You are about to drop the column `url` on the `BundleImage` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Product` table. All the data in the column will be lost.
  - Added the required column `filename` to the `BundleImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."BundleImage" DROP COLUMN "url",
ADD COLUMN     "filename" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "imageUrl",
ADD COLUMN     "imageFilename" TEXT;

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "public"."Product"("slug");

-- CreateIndex
CREATE INDEX "Product_sku_idx" ON "public"."Product"("sku");
