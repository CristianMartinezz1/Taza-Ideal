package com.tazaideal.repository;

import com.tazaideal.model.Etiqueta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface EtiquetaRepository extends JpaRepository<Etiqueta, Long> {

    List<Etiqueta> findByNombreIn(Collection<String> nombres);

    List<Etiqueta> findAllByOrderByNombreAsc();
}
