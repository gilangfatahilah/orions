/*
  Warnings:

  - You are about to drop the column `notifictionJson` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `notificationJson` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "notifictionJson",
ADD COLUMN     "notificationJson" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "colorScheme" TEXT;
