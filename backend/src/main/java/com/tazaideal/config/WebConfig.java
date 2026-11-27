package com.tazaideal.config;

import com.tazaideal.service.AlmacenamientoService;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Publica las fotos subidas en /uploads/** (por ejemplo /uploads/productos/abc.jpg). */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AlmacenamientoService almacenamiento;

    public WebConfig(AlmacenamientoService almacenamiento) {
        this.almacenamiento = almacenamiento;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(AlmacenamientoService.PREFIJO_URL + "**")
                .addResourceLocations(almacenamiento.getBase().toUri().toString());
    }
}
