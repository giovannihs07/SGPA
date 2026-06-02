package com.sgpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgpa.model.products.TipoProductoAtributo;

@Repository
public interface TipoProductoAtributoRepository extends JpaRepository<TipoProductoAtributo, Long> {
    List<TipoProductoAtributo> findByTipoProductoIdOrderByOrden(Long tipoProductoId);
    void deleteByTipoProductoId(Long tipoProductoId);
}
