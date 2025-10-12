package com.digicamp.monitoring.infrastructure.service;

import com.digicamp.monitoring.application.service.FileStorageService;
import com.digicamp.monitoring.infrastructure.config.StorageProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private final StorageProperties storageProperties;
    private Path rootLocation;

    @PostConstruct
    public void init() {
        try {
            rootLocation = Paths.get(storageProperties.getLocation());
            Files.createDirectories(rootLocation);
            log.info("Storage location initialized: {}", rootLocation.toAbsolutePath());
        } catch (IOException e) {
            log.error("Could not initialize storage location", e);
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String directory) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file");
        }

        if (!isValidImage(file)) {
            throw new IllegalArgumentException("Invalid image file type");
        }

        try {
            // Créer le sous-répertoire si nécessaire
            Path directoryPath = rootLocation.resolve(directory);
            Files.createDirectories(directoryPath);

            // Générer un nom de fichier unique
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;

            // Stocker le fichier
            Path targetLocation = directoryPath.resolve(filename);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            // Retourner le chemin relatif
            return directory + "/" + filename;

        } catch (IOException e) {
            log.error("Failed to store file", e);
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Override
    public String storeBase64Image(String base64Data, String fileName, String directory) {
        if (base64Data == null || base64Data.isEmpty()) {
            throw new IllegalArgumentException("Base64 data cannot be empty");
        }

        try {
            // Extraire les données de l'image (supprimer le préfixe data:image/xxx;base64,)
            String base64Image = base64Data;
            String mimeType = "image/png";
            
            if (base64Data.contains(",")) {
                String[] parts = base64Data.split(",");
                if (parts.length == 2) {
                    // Extraire le type MIME
                    String dataPrefix = parts[0]; // data:image/png;base64
                    if (dataPrefix.contains(":") && dataPrefix.contains(";")) {
                        mimeType = dataPrefix.substring(dataPrefix.indexOf(":") + 1, dataPrefix.indexOf(";"));
                    }
                    base64Image = parts[1];
                }
            }

            // Vérifier le type MIME
            if (!isAllowedMimeType(mimeType)) {
                throw new IllegalArgumentException("Image type not allowed: " + mimeType);
            }

            // Décoder les données base64
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);

            // Créer le sous-répertoire
            Path directoryPath = rootLocation.resolve(directory);
            Files.createDirectories(directoryPath);

            // Générer un nom de fichier unique avec l'extension appropriée
            String extension = getExtensionFromMimeType(mimeType);
            String filename = (fileName != null && !fileName.isEmpty()) 
                ? StringUtils.cleanPath(fileName) + "_" + UUID.randomUUID().toString() + extension
                : UUID.randomUUID().toString() + extension;

            // Stocker le fichier
            Path targetLocation = directoryPath.resolve(filename);
            Files.write(targetLocation, imageBytes);

            // Retourner le chemin relatif
            return directory + "/" + filename;

        } catch (IOException e) {
            log.error("Failed to store base64 image", e);
            throw new RuntimeException("Failed to store base64 image", e);
        }
    }

    @Override
    public void deleteFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return;
        }

        try {
            Path file = rootLocation.resolve(filePath);
            Files.deleteIfExists(file);
            log.info("Deleted file: {}", filePath);
        } catch (IOException e) {
            log.error("Failed to delete file: {}", filePath, e);
        }
    }

    @Override
    public Path loadFile(String filePath) {
        return rootLocation.resolve(filePath);
    }

    @Override
    public boolean isValidImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        String contentType = file.getContentType();
        return isAllowedMimeType(contentType);
    }

    @Override
    public boolean isAllowedMimeType(String mimeType) {
        if (mimeType == null) {
            return false;
        }
        return Arrays.asList(storageProperties.getAllowedImageTypes()).contains(mimeType);
    }

    private String getExtensionFromMimeType(String mimeType) {
        return switch (mimeType) {
            case "image/jpeg", "image/jpg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/gif" -> ".gif";
            case "image/svg+xml" -> ".svg";
            case "image/webp" -> ".webp";
            default -> ".png";
        };
    }
}
