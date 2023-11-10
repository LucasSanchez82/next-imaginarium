/*
  Warnings:

  - Added the required column `idReferent` to the `Enfant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_id_fkey`;

-- AlterTable
ALTER TABLE `enfant` ADD COLUMN `idReferent` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Enfant` ADD CONSTRAINT `Enfant_idReferent_fkey` FOREIGN KEY (`idReferent`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_idEnfant_fkey` FOREIGN KEY (`idEnfant`) REFERENCES `Enfant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
