/*
  Warnings:

  - A unique constraint covering the columns `[packageId,productId]` on the table `PackageItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_customerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EventDetails" DROP CONSTRAINT "EventDetails_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PackageItem" DROP CONSTRAINT "PackageItem_packageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "totalCents" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "CalendarEntry_date_idx" ON "public"."CalendarEntry"("date");

-- CreateIndex
CREATE INDEX "CalendarEntry_userId_idx" ON "public"."CalendarEntry"("userId");

-- CreateIndex
CREATE INDEX "CalendarEntry_orderId_idx" ON "public"."CalendarEntry"("orderId");

-- CreateIndex
CREATE INDEX "CartItem_productId_idx" ON "public"."CartItem"("productId");

-- CreateIndex
CREATE INDEX "CustomerProfile_addressId_idx" ON "public"."CustomerProfile"("addressId");

-- CreateIndex
CREATE INDEX "CustomerProfile_email_idx" ON "public"."CustomerProfile"("email");

-- CreateIndex
CREATE INDEX "Order_status_startDate_idx" ON "public"."Order"("status", "startDate");

-- CreateIndex
CREATE INDEX "Order_customerProfileId_idx" ON "public"."Order"("customerProfileId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "public"."OrderItem"("productId");

-- CreateIndex
CREATE INDEX "PackageItem_productId_idx" ON "public"."PackageItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "PackageItem_packageId_productId_key" ON "public"."PackageItem"("packageId", "productId");

-- CreateIndex
CREATE INDEX "Product_active_category_createdAt_idx" ON "public"."Product"("active", "category", "createdAt");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "public"."Product"("slug");

-- AddForeignKey
ALTER TABLE "public"."PackageItem" ADD CONSTRAINT "PackageItem_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "public"."CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventDetails" ADD CONSTRAINT "EventDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
