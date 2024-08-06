/*
  Warnings:

  - You are about to drop the `TransactionReport` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userName` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemDetail` to the `TransactionDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "outletDetail" TEXT,
ADD COLUMN     "supplierDetail" TEXT,
ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TransactionDetail" ADD COLUMN     "itemDetail" TEXT NOT NULL;

-- DropTable
DROP TABLE "TransactionReport";
