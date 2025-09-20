/*
  Warnings:

  - A unique constraint covering the columns `[roomId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_roomId_key" ON "public"."User"("roomId");
