/*
  Warnings:

  - The primary key for the `enfant` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_idEnfant_fkey`;

-- AlterTable
ALTER TABLE `document` MODIFY `idEnfant` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `enfant` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_idEnfant_fkey` FOREIGN KEY (`idEnfant`) REFERENCES `Enfant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
