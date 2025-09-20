/*
  Warnings:

  - A unique constraint covering the columns `[User]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `User` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "User" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_User_key" ON "public"."Room"("User");
