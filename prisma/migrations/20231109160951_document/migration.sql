-- CreateTable
CREATE TABLE `Document` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelleDocument` VARCHAR(191) NOT NULL,
    `cheminDocument` VARCHAR(191) NOT NULL,
    `idEnfant` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_id_fkey` FOREIGN KEY (`id`) REFERENCES `Enfant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
