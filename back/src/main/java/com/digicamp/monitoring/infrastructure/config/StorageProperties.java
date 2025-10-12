package com.digicamp.monitoring.infrastructure.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.storage")
@Getter
@Setter
public class StorageProperties {

    /**
     * Répertoire de stockage des fichiers uploadés
     */
    private String location = "uploads";

    /**
     * Taille maximale des fichiers (en MB)
     */
    private long maxFileSize = 5;

    /**
     * Types MIME autorisés pour les images
     */
    private String[] allowedImageTypes = {
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/svg+xml",
            "image/webp"
    };
}
