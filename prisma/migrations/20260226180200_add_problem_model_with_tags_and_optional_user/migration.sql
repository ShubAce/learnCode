/*
  Warnings:

  - You are about to drop the column `referenceSolution` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `referenceSolutions` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_userId_fkey";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "referenceSolution",
ADD COLUMN     "referenceSolutions" JSONB NOT NULL,
ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
