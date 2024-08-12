/*
  Warnings:

  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Manager', 'Staff');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "joinedAt" TIMESTAMP(3),
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;
