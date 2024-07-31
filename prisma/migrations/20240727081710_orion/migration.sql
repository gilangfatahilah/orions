/*
  Warnings:

  - You are about to drop the column `Detail` on the `TransactionReport` table. All the data in the column will be lost.
  - You are about to drop the column `Outlet` on the `TransactionReport` table. All the data in the column will be lost.
  - Added the required column `detail` to the `TransactionReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransactionReport" DROP COLUMN "Detail",
DROP COLUMN "Outlet",
ADD COLUMN     "detail" TEXT NOT NULL,
ADD COLUMN     "outlet" TEXT;
