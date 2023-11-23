/*
  Warnings:

  - You are about to drop the `jour` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sequencejournee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `jour` DROP FOREIGN KEY `Jour_idEmploiDuTempsSemaine_fkey`;

-- DropForeignKey
ALTER TABLE `sequencejournee` DROP FOREIGN KEY `SequenceJournee_idJour_fkey`;

-- DropTable
DROP TABLE `jour`;

-- DropTable
DROP TABLE `sequencejournee`;

-- CreateTable
CREATE TABLE `EdtJour` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `idEmploiDuTempsSemaine` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EdtSequenceJournee` (
    `id` VARCHAR(191) NOT NULL,
    `heureDebut` DATETIME(3) NOT NULL,
    `heureFin` DATETIME(3) NOT NULL,
    `idJour` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EdtJour` ADD CONSTRAINT `EdtJour_idEmploiDuTempsSemaine_fkey` FOREIGN KEY (`idEmploiDuTempsSemaine`) REFERENCES `EmploiDuTempsSemaine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EdtSequenceJournee` ADD CONSTRAINT `EdtSequenceJournee_idJour_fkey` FOREIGN KEY (`idJour`) REFERENCES `EdtJour`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
