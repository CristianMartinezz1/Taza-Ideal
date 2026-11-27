package com.tazaideal.service;

import com.tazaideal.exception.ReglaNegocioException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Guarda las fotos de productos en una carpeta del servidor (app.uploads.dir).
 * En la base de datos solo se guarda la ruta publica, por ejemplo /uploads/productos/abc.jpg
 */
@Service
public class AlmacenamientoService {

    public static final String PREFIJO_URL = "/uploads/";
    static final long TAMANO_MAXIMO = 2 * 1024 * 1024; // 2 MB

    private static final Logger log = LoggerFactory.getLogger(AlmacenamientoService.class);

    private final Path base;

    public AlmacenamientoService(@Value("${app.uploads.dir:uploads}") String carpeta) {
        this.base = Path.of(carpeta).toAbsolutePath().normalize();
    }

    public Path getBase() {
        return base;
    }

    /** Valida que sea JPG o PNG de maximo 2 MB y la guarda con un nombre aleatorio. */
    public String guardarFotoProducto(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new ReglaNegocioException("Selecciona una imagen");
        }
        if (archivo.getSize() > TAMANO_MAXIMO) {
            throw new ReglaNegocioException("La imagen no puede pesar más de 2 MB");
        }
        String extension = extensionSegunContenido(archivo);
        Path carpeta = base.resolve("productos");
        Path destino = carpeta.resolve(UUID.randomUUID() + extension);
        try (InputStream in = archivo.getInputStream()) {
            Files.createDirectories(carpeta);
            Files.copy(in, destino, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new UncheckedIOException("No se pudo guardar la imagen", e);
        }
        return PREFIJO_URL + "productos/" + destino.getFileName();
    }

    /** Borra un archivo subido antes. Ignora rutas que no sean de /uploads (por ejemplo las fotos del frontend). */
    public void borrar(String url) {
        if (url == null || !url.startsWith(PREFIJO_URL)) {
            return;
        }
        Path archivo = base.resolve(url.substring(PREFIJO_URL.length())).normalize();
        if (!archivo.startsWith(base)) {
            return; // nunca borrar fuera de la carpeta de uploads
        }
        try {
            Files.deleteIfExists(archivo);
        } catch (IOException e) {
            log.warn("No se pudo borrar {}: {}", archivo, e.getMessage());
        }
    }

    /**
     * Revisa los primeros bytes del archivo (no solo el nombre ni el tipo que dice el navegador):
     * JPG empieza con FF D8 FF y PNG con 89 50 4E 47.
     */
    private String extensionSegunContenido(MultipartFile archivo) {
        byte[] inicio = new byte[4];
        int leidos;
        try (InputStream in = archivo.getInputStream()) {
            leidos = in.readNBytes(inicio, 0, 4);
        } catch (IOException e) {
            throw new UncheckedIOException("No se pudo leer la imagen", e);
        }
        if (leidos >= 3 && (inicio[0] & 0xFF) == 0xFF && (inicio[1] & 0xFF) == 0xD8 && (inicio[2] & 0xFF) == 0xFF) {
            return ".jpg";
        }
        if (leidos == 4 && (inicio[0] & 0xFF) == 0x89 && inicio[1] == 'P' && inicio[2] == 'N' && inicio[3] == 'G') {
            return ".png";
        }
        throw new ReglaNegocioException("La imagen debe ser JPG o PNG");
    }
}
