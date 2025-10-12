package com.digicamp.monitoring.presentation.controller;

import com.digicamp.monitoring.application.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileStorageService fileStorageService;

    /**
     * Upload un fichier image
     */
    @PostMapping("/upload/image")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "directory", defaultValue = "images") String directory) {
        
        log.info("Uploading image: {} to directory: {}", file.getOriginalFilename(), directory);
        
        String filePath = fileStorageService.storeFile(file, directory);
        
        Map<String, String> response = new HashMap<>();
        response.put("filePath", filePath);
        response.put("url", "/api/files/" + filePath);
        response.put("message", "File uploaded successfully");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Upload une image en Base64
     */
    @PostMapping("/upload/base64")
    public ResponseEntity<Map<String, String>> uploadBase64Image(
            @RequestBody Map<String, String> request) {
        
        String base64Data = request.get("base64Data");
        String fileName = request.get("fileName");
        String directory = request.getOrDefault("directory", "images");
        
        log.info("Uploading base64 image: {} to directory: {}", fileName, directory);
        
        String filePath = fileStorageService.storeBase64Image(base64Data, fileName, directory);
        
        Map<String, String> response = new HashMap<>();
        response.put("filePath", filePath);
        response.put("url", "/api/files/" + filePath);
        response.put("message", "Image uploaded successfully");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Récupérer un fichier
     */
    @GetMapping("/{directory}/{filename:.+}")
    public ResponseEntity<Resource> getFile(
            @PathVariable String directory,
            @PathVariable String filename) {
        
        try {
            String filePath = directory + "/" + filename;
            Path file = fileStorageService.loadFile(filePath);
            Resource resource = new UrlResource(file.toUri());
            
            if (resource.exists() || resource.isReadable()) {
                // Déterminer le type de contenu
                String contentType = determineContentType(filename);
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                log.error("File not found: {}", filePath);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error loading file", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Supprimer un fichier
     */
    @DeleteMapping("/{directory}/{filename:.+}")
    public ResponseEntity<Map<String, String>> deleteFile(
            @PathVariable String directory,
            @PathVariable String filename) {
        
        String filePath = directory + "/" + filename;
        fileStorageService.deleteFile(filePath);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "File deleted successfully");
        
        return ResponseEntity.ok(response);
    }

    private String determineContentType(String filename) {
        String extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
        return switch (extension) {
            case ".jpg", ".jpeg" -> "image/jpeg";
            case ".png" -> "image/png";
            case ".gif" -> "image/gif";
            case ".svg" -> "image/svg+xml";
            case ".webp" -> "image/webp";
            default -> "application/octet-stream";
        };
    }
}
