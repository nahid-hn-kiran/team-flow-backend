-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'PLANNING', 'COMPLETED');

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING';
