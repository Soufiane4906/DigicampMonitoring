package com.digicamp.monitoring.application.service;

import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

public interface FileStorageService {

    /**
     * Stocke un fichier et retourne le chemin relatif
     */
    String storeFile(MultipartFile file, String directory);

    /**
     * Stocke une image en base64 et retourne le chemin
     */
    String storeBase64Image(String base64Data, String fileName, String directory);

    /**
     * Supprime un fichier
     */
    void deleteFile(String filePath);

    /**
     * Charge un fichier
     */
    Path loadFile(String filePath);

    /**
     * Vérifie si le fichier est une image valide
     */
    boolean isValidImage(MultipartFile file);

    /**
     * Vérifie si le type MIME est autorisé
     */
    boolean isAllowedMimeType(String mimeType);
}
