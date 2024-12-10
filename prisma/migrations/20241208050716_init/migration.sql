-- CreateEnum
CREATE TYPE "status_enum" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "roles_enum" AS ENUM ('ADMIN', 'USER', 'PATIENT', 'DOCTOR');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(80) NOT NULL,
    "password" VARCHAR(180),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "confirmed_at" TIMESTAMPTZ(3),
    "status" "status_enum" NOT NULL DEFAULT 'PENDING',
    "roles" "roles_enum"[] DEFAULT ARRAY['PATIENT']::"roles_enum"[],

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_user_email" ON "user"("email");
