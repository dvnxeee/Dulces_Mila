package com.dulces_mila.proyecto_backend.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

/**
 * Configuración para decirle a Spring que muestre
 * los archivos estáticos de la carpeta 'uploads'.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Traemos el valor de application.properties
    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        
        // Convertimos la ruta relativa (uploads/) a una ruta absoluta
        // (ej: file:///C:/.../proyecto_backend/uploads/)
        String rutaAbsoluta = Paths.get(uploadDir).toAbsolutePath().toUri().toString();

        // Le decimos a Spring:
        // Cuando alguien pida una URL que empiece con "/uploads/**"
        // (ej: /uploads/abc-123.jpg)
        // ...anda a buscar el archivo a la carpeta física:
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(rutaAbsoluta);
    }
}