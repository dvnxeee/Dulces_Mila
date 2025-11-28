package com.dulces_mila.proyecto_backend.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * Configuración de Recursos Estáticos (Imágenes)
     * Permite ver las fotos subidas en /uploads/
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String rutaAbsoluta = Paths.get(uploadDir).toAbsolutePath().toUri().toString();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(rutaAbsoluta);
    }

    /**
     * Configuración Global de CORS (NUEVO - Recomendado para JWT)
     * Esto reemplaza a los @CrossOrigin de los controladores.
     * Permite que el frontend envíe el Header 'Authorization'.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica a todas las URLs de la API
                .allowedOrigins("http://localhost:5173") // Permite solo a tu Frontend React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // Verbos permitidos
                .allowedHeaders("*") // Permite todos los headers
                .allowCredentials(true); // Permite credenciales/cookies si fuera necesario
    }
}