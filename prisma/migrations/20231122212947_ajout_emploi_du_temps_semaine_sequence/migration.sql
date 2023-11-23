-- CreateTable
CREATE TABLE `EmploiDuTempsSemaine` (
    `id` VARCHAR(191) NOT NULL,
    `semaine` INTEGER NOT NULL,
    `idEnfant` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jour` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `idEmploiDuTempsSemaine` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SequenceJournee` (
    `id` VARCHAR(191) NOT NULL,
    `heureDebut` DATETIME(3) NOT NULL,
    `heureFin` DATETIME(3) NOT NULL,
    `idJour` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmploiDuTempsSemaine` ADD CONSTRAINT `EmploiDuTempsSemaine_idEnfant_fkey` FOREIGN KEY (`idEnfant`) REFERENCES `Enfant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jour` ADD CONSTRAINT `Jour_idEmploiDuTempsSemaine_fkey` FOREIGN KEY (`idEmploiDuTempsSemaine`) REFERENCES `EmploiDuTempsSemaine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SequenceJournee` ADD CONSTRAINT `SequenceJournee_idJour_fkey` FOREIGN KEY (`idJour`) REFERENCES `Jour`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
