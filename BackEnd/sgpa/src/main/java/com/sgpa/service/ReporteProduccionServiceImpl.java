package com.sgpa.service;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.dto.response.DocenteResponse;
import com.sgpa.dto.response.FacultadResponse;
import com.sgpa.dto.response.ProgramaResponse;
import com.sgpa.dto.response.reporte.ReporteCoberturaDocenteResponse;
import com.sgpa.dto.response.reporte.ReporteConteoItemResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionFacultadResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionFiltrosEtiquetasResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionFiltrosResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionGraficosResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionMetaResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionOpcionesResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionProductoLineaResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionProgramaResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionResumenResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionDocentesResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionProductosResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionResponse;
import com.sgpa.dto.response.reporte.ReporteRankingDocenteResponse;
import com.sgpa.mapper.DocenteMapper;
import com.sgpa.mapper.FacultadMapper;
import com.sgpa.mapper.ProgramaMapper;
import com.sgpa.model.products.CategoriaProducto;
import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.SubcategoriaProducto;
import com.sgpa.model.products.TipoProducto;
import com.sgpa.model.users.Docente;
import com.sgpa.model.users.EstadoUsuario;
import com.sgpa.model.users.Persona;
import com.sgpa.repository.DocenteRepository;
import com.sgpa.repository.FacultadRepository;
import com.sgpa.repository.ProductoDocenteRepository;
import com.sgpa.repository.ProgramaRepository;

import lombok.RequiredArgsConstructor;

// Implementación del servicio de generación de reportes de producción docente
@Service
@RequiredArgsConstructor
public class ReporteProduccionServiceImpl implements ReporteProduccionService {

    private static final String ESTADO_TODOS = "TODOS";
    private static final String ESTADO_PUBLICADO = "PUBLICADO";
    private static final String ESTADO_SIN_PUBLICAR = "SIN_PUBLICAR";
    private static final String CATEGORIA_TODAS = "TODAS";
    private static final String SUBCATEGORIA_TODAS = "TODAS";
    private static final String FILTRO_TIPO_TODOS = "TODOS";
    private static final String CAMPO_FECHA_REGISTRO = "fechaRegistroSgpa";
    private static final String CAMPO_FECHA_PUBLICACION = "fechaPublicacionSgpa";
    private static final int DIAS_RECIENTES = 30;
    private static final int TOP_VISTA = 10;
    private static final String TIPO_EJECUTIVO = "EJECUTIVO";
    private static final String TIPO_PRODUCTOS = "PRODUCTOS";
    private static final String TIPO_DOCENTES = "DOCENTES";
    private static final String TITULO_EJECUTIVO = "Reporte ejecutivo — producción docente SGPA";
    private static final String TITULO_PRODUCTOS = "Inventario de productos — SGPA";
    private static final String TITULO_DOCENTES = "Ranking de docentes — SGPA";
    private static final String NOTA_ATRIBUCION = 
             "La facultad y el programa de cada producto se infieren de los programas académicos "
             + "asociados al docente autor, no de un campo propio del producto.";
    private static final String GUION = "—";

    private final ProductoDocenteRepository productoRepository;
    private final DocenteRepository docenteRepository;
    private final FacultadRepository facultadRepository;
    private final ProgramaRepository programaRepository;
    private final DocenteMapper docenteMapper;
    private final FacultadMapper facultadMapper;
    private final ProgramaMapper programaMapper;

    // Generar reporte ejecutivo de producción docente ------------------------------------------
    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ReporteProduccionResponse generarEjecutivo(
                String estado,
                String categoria,
                String subcategoria,
                String tipo,
                Long facultadId,
                Long programaId,
                LocalDate fechaDesde,
                LocalDate fechaHasta,
                String campoFecha,
                String busqueda) {

        ContextoReporte ctx = prepararContexto(
             estado, categoria, subcategoria, tipo, facultadId, programaId,
             fechaDesde, fechaHasta, campoFecha, busqueda);

        ReporteProduccionGraficosResponse graficos = ReporteProduccionGraficosResponse.builder()
            .porAnio(ctx.graficos().getPorAnio())
            .porCategoria(ctx.graficos().getPorCategoria())
            .porSubcategoria(ctx.graficos().getPorSubcategoria())
            .porTipo(ctx.graficos().getPorTipo())
            .productosRecientes(ctx.graficos().getProductosRecientes())
            .rankingDocentesTop(limitarRanking(ctx.rankingDocentes(), TOP_VISTA))
        .build();

        return ReporteProduccionResponse.builder()
            .meta(crearMeta(TIPO_EJECUTIVO, TITULO_EJECUTIVO, ctx.productosFiltrados().size()))
            .filtrosAplicados(ctx.filtrosAplicados())
            .filtrosEtiquetas(ctx.filtrosEtiquetas())
            .resumen(ctx.resumen())
            .cobertura(ctx.cobertura())
            .porFacultad(ctx.porFacultad())
            .porPrograma(ctx.porPrograma())
            .productos(List.of())
            .rankingDocentes(List.of())
            .graficos(graficos)
            .opciones(ctx.opciones())
        .build();
    }
    
    // Generar reporte de productos ----------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ReporteProduccionProductosResponse generarProductos(
                String estado,
                String categoria,
                String subcategoria,
                String tipo,
                Long facultadId,
                Long programaId,
                LocalDate fechaDesde,
                LocalDate fechaHasta,
                String campoFecha,
                String busqueda) {

        ContextoReporte ctx = prepararContexto(
             estado, categoria, subcategoria, tipo, facultadId, programaId,
             fechaDesde, fechaHasta, campoFecha, busqueda);

        return ReporteProduccionProductosResponse.builder()
             .meta(crearMeta(TIPO_PRODUCTOS, TITULO_PRODUCTOS, ctx.productosFiltrados().size()))
             .filtrosAplicados(ctx.filtrosAplicados())
             .filtrosEtiquetas(ctx.filtrosEtiquetas())
             .productos(ctx.productosFiltrados())
             .total(ctx.productosFiltrados().size())
        .build();
    }

    // Generar reporte de docentes ----------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ReporteProduccionDocentesResponse generarDocentes(
                String estado,
                String categoria,
                String subcategoria,
                String tipo,
                Long facultadId,
                Long programaId,
                LocalDate fechaDesde,
                LocalDate fechaHasta,
                String campoFecha,
                String busqueda) {

        ContextoReporte ctx = prepararContexto(
             estado, categoria, subcategoria, tipo, facultadId, programaId,
             fechaDesde, fechaHasta, campoFecha, busqueda);

        return ReporteProduccionDocentesResponse.builder()
             .meta(crearMeta(TIPO_DOCENTES, TITULO_DOCENTES, ctx.productosFiltrados().size()))
             .filtrosAplicados(ctx.filtrosAplicados())
             .filtrosEtiquetas(ctx.filtrosEtiquetas())
             .rankingDocentes(ctx.rankingDocentes())
             .total(ctx.rankingDocentes().size())
             .build();
    }

    // Crear metadatos del reporte con información de:
    //  tipo, título, total de productos filtrados y fecha de generación --------------------------
    private ReporteProduccionMetaResponse crearMeta(String tipo, String titulo, int total) {
        return ReporteProduccionMetaResponse.builder()
             .generadoEn(OffsetDateTime.now(ZoneOffset.systemDefault()))
             .tipo(tipo)
             .titulo(titulo)
             .totalProductosFiltrados(total)
             .diasRecientes(DIAS_RECIENTES)
             .notaAtribucion(NOTA_ATRIBUCION)
             .build();
    }
    
    // Limitar el ranking de docentes a un número máximo de elementos, según el parámetro 'limite'
    // Esto se utiliza para mostrar solo los docentes con mayor producción en el reporte ejecutivo
    // El ranking completo se puede obtener en el reporte de docentes 
    private List<ReporteRankingDocenteResponse> limitarRanking(
        List<ReporteRankingDocenteResponse> ranking,
        int limite) {
        return ranking.stream().limit(limite).toList();
    }

    // Preparar el contexto del reporte, aplicando filtros y construyendo la información necesaria 
    // para generar los reportes 
    // Esto incluye la lista de productos filtrados, el resumen, la cobertura, 
    // los agrupamientos por facultad y programa, 
    // el ranking de docentes, los gráficos y las opciones disponibles
    private ContextoReporte prepararContexto(
                String estado,
                String categoria,
                String subcategoria,
                String tipo,
                Long facultadId,
                Long programaId,
                LocalDate fechaDesde,
                LocalDate fechaHasta,
                String campoFecha,
                String busqueda) {

        String estadoNorm = normalizar(estado, ESTADO_TODOS);
        String categoriaNorm = normalizar(categoria, CATEGORIA_TODAS);
        String subcategoriaNorm = normalizar(subcategoria, SUBCATEGORIA_TODAS);
        String tipoNorm = normalizar(tipo, FILTRO_TIPO_TODOS);
        String campoFechaNorm = normalizarCampoFecha(campoFecha);
        String busquedaNorm = busqueda != null ? busqueda.trim() : "";

        List<DocenteResponse> docentes = docenteMapper.toDTOList(docenteRepository.findAll());
        Map<Long, DocenteAtribucion> atribuciones = construirAtribuciones(docentes);

        List<ReporteProduccionProductoLineaResponse> productosEnriquecidos =
             productoRepository.findAllForReporte().stream()
                .map(p -> toLinea(p, atribuciones))
                .toList();
                
        ReporteProduccionFiltrosResponse filtrosAplicados = ReporteProduccionFiltrosResponse.builder()
            .estado(estadoNorm)
            .categoria(categoriaNorm)
            .subcategoria(subcategoriaNorm)
            .tipo(tipoNorm)
            .facultadId(facultadId)
            .programaId(programaId)
            .fechaDesde(fechaDesde)
            .fechaHasta(fechaHasta)
            .campoFecha(campoFechaNorm)
            .busqueda(busquedaNorm)
            .build();

        List<ReporteProduccionProductoLineaResponse> productosFiltrados = productosEnriquecidos.stream()
                .filter(p -> coincideFiltros(p, filtrosAplicados))
                .toList();

        List<FacultadResponse> facultades = facultadMapper.toDTOList(facultadRepository.findAll());
        List<ProgramaResponse> programas = programaMapper.toDTOList(programaRepository.findAll());

        // Si se filtra por programa sin facultad, el alcance se limita a ese programa y su facultad
        Long facultadAlcanceId = facultadId != null
                ? facultadId
                : programas.stream()
                    .filter(p -> Objects.equals(p.getId(), programaId))
                    .map(ProgramaResponse::getFacultadId)
                    .findFirst()
                    .orElse(null);

        List<FacultadResponse> facultadesAlcance = facultadAlcanceId == null
                ? facultades
                : facultades.stream().filter(f -> Objects.equals(f.getId(), facultadAlcanceId)).toList();

        List<ProgramaResponse> programasAlcance = programas.stream()
                .filter(p -> facultadId == null || Objects.equals(p.getFacultadId(), facultadId))
                .filter(p -> programaId == null || Objects.equals(p.getId(), programaId))
                .toList();

        // La cobertura solo considera docentes con usuario activo; la atribución de productos usa todos
        List<DocenteResponse> docentesActivos = docentes.stream()
                .filter(d -> EstadoUsuario.ACTIVO.name().equals(d.getEstado()))
                .toList();
        List<DocenteResponse> docentesAlcance = docentesEnAlcance(docentesActivos, facultadId, programaId);

        ReporteProduccionResumenResponse resumen = calcularResumen(productosFiltrados);
        ReporteCoberturaDocenteResponse cobertura = calcularCobertura(docentesAlcance, productosFiltrados);
        List<ReporteProduccionFacultadResponse> porFacultad =
                agruparPorFacultad(productosFiltrados, facultadesAlcance, docentesActivos);
        List<ReporteProduccionProgramaResponse> porPrograma =
                agruparPorPrograma(productosFiltrados, programasAlcance, docentesActivos);
        List<ReporteRankingDocenteResponse> rankingDocentes = agruparPorDocente(productosFiltrados);

        ReporteProduccionFiltrosEtiquetasResponse filtrosEtiquetas = construirEtiquetasFiltros(
                filtrosAplicados, facultades, programas);

        ReporteProduccionGraficosResponse graficos = ReporteProduccionGraficosResponse.builder()
                .porAnio(agruparPorAnio(productosFiltrados, campoFechaNorm))
                .porCategoria(agruparConteo(productosFiltrados, ReporteProduccionProductoLineaResponse::getCategoria))
                .porSubcategoria(agruparConteo(productosFiltrados, ReporteProduccionProductoLineaResponse::getSubcategoria))
                .porTipo(agruparPorTipoConEstado(productosFiltrados))
                .productosRecientes(productosRecientes(productosFiltrados))
                .build();

        ReporteProduccionOpcionesResponse opciones = ReporteProduccionOpcionesResponse.builder()
                .categoriasDisponibles(categoriasDisponibles(productosEnriquecidos))
                .subcategoriasDisponibles(subcategoriasDisponibles(productosEnriquecidos, categoriaNorm))
                .tiposDisponibles(tiposDisponibles(productosEnriquecidos, categoriaNorm, subcategoriaNorm))
                .build();

        return new ContextoReporte(
             filtrosAplicados,
             filtrosEtiquetas,
             productosFiltrados,
             resumen,
             cobertura,
             porFacultad,
             porPrograma,
             rankingDocentes,
             graficos,
             opciones);
    }

    // Normalizar un valor de cadena, devolviendo un valor por defecto si es nulo o vacío --------
    private String normalizar(String valor, String defecto) {
        if (valor == null || valor.isBlank()) return defecto;
        return valor.trim();
    }

    // Normalizar el campo de fecha para los filtros, devolviendo un valor por defecto si es nulo o inválido
    private String normalizarCampoFecha(String campoFecha) {
        if (CAMPO_FECHA_PUBLICACION.equals(campoFecha)) {
            return CAMPO_FECHA_PUBLICACION;
        }
        return CAMPO_FECHA_REGISTRO;
    }

    // Construir un mapa de atribuciones de docentes, que incluye las facultades y programas asociados a cada docente
    // Esto se utiliza para enriquecer la información de los productos con los datos de los docentes
    private Map<Long, DocenteAtribucion> construirAtribuciones(List<DocenteResponse> docentes) {
        Map<Long, DocenteAtribucion> mapa = new HashMap<>();
        for (DocenteResponse docente : docentes) {
            Set<Long> facultadIds = new HashSet<>();
            Set<String> facultadNombres = new HashSet<>();
            Set<Long> programaIds = new HashSet<>();
            List<String> programaNombres = new ArrayList<>();

            if (docente.getProgramas() != null) {
                for (ProgramaResponse programa : docente.getProgramas()) {
                    if (programa.getFacultadId() != null) {
                        facultadIds.add(programa.getFacultadId());
                    }
                    if (programa.getFacultadNombre() != null && !programa.getFacultadNombre().isBlank()) {
                        facultadNombres.add(programa.getFacultadNombre());
                    }
                    if (programa.getId() != null) {
                        programaIds.add(programa.getId());
                    }
                    if (programa.getNombre() != null && !programa.getNombre().isBlank()) {
                        programaNombres.add(programa.getNombre());
                    }
                }
            }

            String facultadesLabel = facultadNombres.isEmpty()
                    ? GUION
                    : String.join(", ", facultadNombres);
            String programasLabel = programaNombres.isEmpty()
                    ? GUION
                    : String.join(", ", programaNombres);

            mapa.put(docente.getId(), new DocenteAtribucion(
                    new ArrayList<>(facultadIds),
                    new ArrayList<>(facultadNombres),
                    new ArrayList<>(programaIds),
                    programaNombres,
                    facultadesLabel,
                    programasLabel));
        }
        return mapa;
    }

    // Convertir una entidad ProductoDocente en un DTO ReporteProduccionProductoLineaResponse, 
    // enriqueciendo la información con los datos del docente y sus atribuciones
    // Esto se utiliza para construir la lista de productos en el reporte, 
    // incluyendo información sobre el docente, la facultad y el programa.
    private ReporteProduccionProductoLineaResponse toLinea(
            ProductoDocente producto,
            Map<Long, DocenteAtribucion> atribuciones) {

        Docente docente = producto.getDocente();
        Long docenteId = docente != null ? docente.getId() : null;
        DocenteAtribucion atribucion = docenteId != null
                ? atribuciones.getOrDefault(docenteId, DocenteAtribucion.vacia())
                : DocenteAtribucion.vacia();

        String docenteNombre = null;
        String docenteApellido = null;
        String docenteCodigo = null;
        if (docente != null) {
            docenteCodigo = docente.getCodigoDocente();
            Persona persona = docente.getPersona();
            if (persona != null) {
                docenteNombre = persona.getNombre();
                docenteApellido = persona.getApellido();
            }
        }

        TipoProducto tipo = producto.getTipoProducto();
        SubcategoriaProducto subcategoria = tipo != null ? tipo.getSubcategoria() : null;
        CategoriaProducto categoria = subcategoria != null ? subcategoria.getCategoria() : null;

        return ReporteProduccionProductoLineaResponse.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .docenteId(docenteId)
                .docenteNombre(docenteNombre)
                .docenteApellido(docenteApellido)
                .docenteCodigo(docenteCodigo)
                .facultadIds(atribucion.facultadIds())
                .facultadNombres(atribucion.facultadNombres())
                .programaIds(atribucion.programaIds())
                .programaNombres(atribucion.programaNombres())
                .facultadesLabel(atribucion.facultadesLabel())
                .programasLabel(atribucion.programasLabel())
                .categoria(categoria != null ? categoria.getNombre() : null)
                .subcategoria(subcategoria != null ? subcategoria.getNombre() : null)
                .tipo(tipo != null ? tipo.getNombre() : null)
                .publicado(Boolean.TRUE.equals(producto.getPublicado()))
                .fechaRegistroSgpa(producto.getFechaRegistroSgpa())
                .fechaPublicacionSgpa(producto.getFechaPublicacionSgpa())
                .build();
    }

    // Verificar si un producto coincide con los filtros aplicados, incluyendo estado, categoría, 
    // subcategoría, tipo, facultad, programa, rango de fechas y búsqueda de texto
    private boolean coincideFiltros(
            ReporteProduccionProductoLineaResponse producto,
            ReporteProduccionFiltrosResponse filtros) {

        if (!coincideEstado(producto, filtros.getEstado())) return false;
        if (!CATEGORIA_TODAS.equals(filtros.getCategoria())
                && !Objects.equals(filtros.getCategoria(), producto.getCategoria())) {
            return false;
        }
        if (!SUBCATEGORIA_TODAS.equals(filtros.getSubcategoria())
                && !Objects.equals(filtros.getSubcategoria(), producto.getSubcategoria())) {
            return false;
        }
        if (!FILTRO_TIPO_TODOS.equals(filtros.getTipo())
                && !Objects.equals(filtros.getTipo(), producto.getTipo())) {
            return false;
        }
        if (filtros.getFacultadId() != null
                && !contieneId(producto.getFacultadIds(), filtros.getFacultadId())) {
            return false;
        }
        if (filtros.getProgramaId() != null
                && !contieneId(producto.getProgramaIds(), filtros.getProgramaId())) {
            return false;
        }
        if (!coincideRangoFecha(producto, filtros)) return false;
        if (!coincideBusqueda(producto, filtros.getBusqueda())) return false;
        return true;
    }

    // Verificar si un producto coincide con el estado especificado en los filtros
    // Se filtra si el estado es "PUBLICADO", "SIN_PUBLICAR" o "TODOS"
    private boolean coincideEstado(ReporteProduccionProductoLineaResponse producto, String estado) {
        return switch (estado) {
            case ESTADO_PUBLICADO -> Boolean.TRUE.equals(producto.getPublicado());
            case ESTADO_SIN_PUBLICAR -> !Boolean.TRUE.equals(producto.getPublicado());
            default -> true;
        };
    }

    // Verificar si una lista de IDs contiene un valor específico, manejando nulos y listas vacías
    // Se filtra los productos según la facultad o programa seleccionado en los filtros
    private boolean contieneId(List<Long> ids, Long valor) {
        if (ids == null || ids.isEmpty()) return false;
        return ids.stream().anyMatch(id -> Objects.equals(id, valor));
    }

    // Verificar si un producto coincide con el rango de fechas especificado en los filtros,
    // dependiendo del campo de fecha seleccionado (fecha de registro o fecha de publicación)
    private boolean coincideRangoFecha(
            ReporteProduccionProductoLineaResponse producto,
            ReporteProduccionFiltrosResponse filtros) {

        if (filtros.getFechaDesde() == null && filtros.getFechaHasta() == null) {
            return true;
        }

        LocalDate fecha = CAMPO_FECHA_PUBLICACION.equals(filtros.getCampoFecha())
                ? producto.getFechaPublicacionSgpa()
                : producto.getFechaRegistroSgpa();

        if (fecha == null) return false;
        if (filtros.getFechaDesde() != null && fecha.isBefore(filtros.getFechaDesde())) return false;
        if (filtros.getFechaHasta() != null && fecha.isAfter(filtros.getFechaHasta())) return false;
        return true;
    }

    // Verificar si un producto coincide con la búsqueda de texto especificada en los filtros,
    // buscando en el nombre, descripción, nombre y apellido del docente, código del docente,
    // facultades y programas asociados al producto.
    private boolean coincideBusqueda(ReporteProduccionProductoLineaResponse producto, String busqueda) {
        if (busqueda == null || busqueda.isBlank()) return true;
        String q = busqueda.toLowerCase();
        return contiene(producto.getNombre(), q)
                || contiene(producto.getDescripcion(), q)
                || contiene(nombreDocente(producto), q)
                || contiene(producto.getDocenteCodigo(), q)
                || contiene(producto.getFacultadesLabel(), q)
                || contiene(producto.getProgramasLabel(), q);
    }

    // Verificar si un valor de cadena contiene una subcadena específica, 
    // ignorando mayúsculas y minúsculas
    private boolean contiene(String valor, String q) {
        return valor != null && valor.toLowerCase().contains(q);
    }

    // Obtener el nombre completo del docente asociado a un producto, combinando nombre y apellido
    private String nombreDocente(ReporteProduccionProductoLineaResponse producto) {
        String nombre = producto.getDocenteNombre();
        String apellido = producto.getDocenteApellido();
        if (nombre == null && apellido == null) return "Sin docente";
        if (nombre == null) return apellido;
        if (apellido == null) return nombre;
        return nombre + " " + apellido;
    }

    // Filtrar los docentes que están en el alcance de la facultad y programa especificados
    private List<DocenteResponse> docentesEnAlcance( 
        List<DocenteResponse> docentes, 
        Long facultadId, 
        Long programaId) {

        // Sin filtro institucional, todos los docentes están en alcance (incluso sin programa asignado)
        if (facultadId == null && programaId == null) return docentes;

        return docentes.stream()
                .filter(d -> {
                    if (d.getProgramas() == null || d.getProgramas().isEmpty()) return false;
                    Set<Long> facultadIds = d.getProgramas().stream()
                            .map(ProgramaResponse::getFacultadId)
                            .filter(Objects::nonNull)
                            .collect(Collectors.toSet());
                    Set<Long> programaIds = d.getProgramas().stream()
                            .map(ProgramaResponse::getId)
                            .filter(Objects::nonNull)
                            .collect(Collectors.toSet());

                    if (facultadId != null && facultadIds.stream().noneMatch(id -> Objects.equals(id, facultadId))) {
                        return false;
                    }
                    if (programaId != null && programaIds.stream().noneMatch(id -> Objects.equals(id, programaId))) {
                        return false;
                    }
                    return true;
                })
                .toList();
    }

    // Verificar si un producto es considerado "reciente" según la fecha de registro o publicación,
    // dependiendo del campo de fecha seleccionado en los filtros, y comparando con el límite de días recientes
    private ReporteProduccionResumenResponse calcularResumen(
            List<ReporteProduccionProductoLineaResponse> productos) {

        Set<Long> docentes = productos.stream()
                .map(ReporteProduccionProductoLineaResponse::getDocenteId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        int publicados = (int) productos.stream()
                .filter(p -> Boolean.TRUE.equals(p.getPublicado()))
                .count();

        return ReporteProduccionResumenResponse.builder()
                .total(productos.size())
                .publicados(publicados)
                .sinPublicar(productos.size() - publicados)
                .recientes((int) productos.stream().filter(p -> esReciente(p.getFechaRegistroSgpa())).count())
                .docentesActivos(docentes.size())
                .build();
    }

    // Verificar si una fecha es considerada "reciente" según el límite de días recientes 
    // definido en la constante DIAS_RECIENTES
    private boolean esReciente(LocalDate fecha) {
        if (fecha == null) return false;
        LocalDate limite = LocalDate.now().minusDays(DIAS_RECIENTES);
        return !fecha.isBefore(limite);
    }

    // Calcular la cobertura de producción docente, determinando cuántos docentes tienen productos asociados
    private ReporteCoberturaDocenteResponse calcularCobertura(
            List<DocenteResponse> docentesAlcance,
            List<ReporteProduccionProductoLineaResponse> productos) {

        Set<Long> conProduccion = productos.stream()
                .map(ReporteProduccionProductoLineaResponse::getDocenteId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        int total = docentesAlcance.size();
        int activos = (int) docentesAlcance.stream()
                .filter(d -> conProduccion.contains(d.getId()))
                .count();
        int sinProduccion = Math.max(0, total - activos);
        int porcentaje = total > 0 ? Math.round((activos * 100f) / total) : 0;

        return ReporteCoberturaDocenteResponse.builder()
                .totalDocentes(total)
                .docentesConProduccion(activos)
                .docentesSinProduccion(sinProduccion)
                .porcentajeCobertura(porcentaje)
                .build();
    }

    // Acumular la información de producción docente para una unidad (facultad o programa),
    // calculando el total de productos, publicados, sin publicar, recientes, docentes con producción
    // y el porcentaje de cobertura de docentes
    private ProduccionUnidad acumularUnidad(
            List<ReporteProduccionProductoLineaResponse> productos,
            List<DocenteResponse> docentesUnidad) {

        Set<Long> docenteIdsProduccion = productos.stream()
                .map(ReporteProduccionProductoLineaResponse::getDocenteId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        int docentesConProd = (int) docentesUnidad.stream()
                .filter(d -> docenteIdsProduccion.contains(d.getId()))
                .count();
        int totalDocentes = docentesUnidad.size();
        int publicados = (int) productos.stream()
                .filter(p -> Boolean.TRUE.equals(p.getPublicado()))
                .count();

        return new ProduccionUnidad(
                productos.size(),
                publicados,
                productos.size() - publicados,
                (int) productos.stream().filter(p -> esReciente(p.getFechaRegistroSgpa())).count(),
                docentesConProd,
                totalDocentes,
                totalDocentes > 0 ? Math.round((docentesConProd * 100f) / totalDocentes) : 0);
    }

    // Agrupar los productos por facultad, acumulando la información de producción docente para cada facultad
    private List<ReporteProduccionFacultadResponse> agruparPorFacultad(
            List<ReporteProduccionProductoLineaResponse> productos,
            List<FacultadResponse> facultades,
            List<DocenteResponse> docentes) {

        return facultades.stream()
                .map(f -> {
                    List<ReporteProduccionProductoLineaResponse> prods = productos.stream()
                            .filter(p -> contieneId(p.getFacultadIds(), f.getId()))
                            .toList();
                    List<DocenteResponse> docentesFacultad = docentes.stream()
                            .filter(d -> d.getProgramas() != null && d.getProgramas().stream()
                                    .anyMatch(p -> Objects.equals(p.getFacultadId(), f.getId())))
                            .toList();
                    ProduccionUnidad u = acumularUnidad(prods, docentesFacultad);
                    return ReporteProduccionFacultadResponse.builder()
                            .facultadId(f.getId())
                            .nombre(f.getNombre())
                            .codigo(f.getCodigo() != null ? f.getCodigo() : GUION)
                            .total(u.total())
                            .publicados(u.publicados())
                            .sinPublicar(u.sinPublicar())
                            .recientes(u.recientes())
                            .docentesConProduccion(u.docentesConProduccion())
                            .totalDocentes(u.totalDocentes())
                            .porcentajeCobertura(u.porcentajeCobertura())
                            .build();
                })
                .sorted(Comparator.comparingInt(ReporteProduccionFacultadResponse::getTotal).reversed())
                .toList();
    }

    // Agrupar los productos por programa, acumulando la información de producción docente para cada programa
    private List<ReporteProduccionProgramaResponse> agruparPorPrograma(
            List<ReporteProduccionProductoLineaResponse> productos,
            List<ProgramaResponse> programas,
            List<DocenteResponse> docentes) {

        return programas.stream()
                .map(prog -> {
                    List<ReporteProduccionProductoLineaResponse> prods = productos.stream()
                            .filter(p -> contieneId(p.getProgramaIds(), prog.getId()))
                            .toList();
                    List<DocenteResponse> docentesPrograma = docentes.stream()
                            .filter(d -> d.getProgramas() != null && d.getProgramas().stream()
                                    .anyMatch(p -> Objects.equals(p.getId(), prog.getId())))
                            .toList();
                    ProduccionUnidad u = acumularUnidad(prods, docentesPrograma);
                    return ReporteProduccionProgramaResponse.builder()
                            .programaId(prog.getId())
                            .nombre(prog.getNombre())
                            .codigo(prog.getCodigo() != null ? prog.getCodigo() : GUION)
                            .facultadNombre(prog.getFacultadNombre() != null ? prog.getFacultadNombre() : GUION)
                            .nivel(prog.getNivel() != null ? prog.getNivel() : GUION)
                            .total(u.total())
                            .publicados(u.publicados())
                            .sinPublicar(u.sinPublicar())
                            .recientes(u.recientes())
                            .docentesConProduccion(u.docentesConProduccion())
                            .totalDocentes(u.totalDocentes())
                            .porcentajeCobertura(u.porcentajeCobertura())
                            .build();
                })
                .sorted(Comparator.comparingInt(ReporteProduccionProgramaResponse::getTotal).reversed())
                .toList();
    }

    // Agrupar los productos por docente, acumulando la información de producción docente para cada docente
    private List<ReporteRankingDocenteResponse> agruparPorDocente(
            List<ReporteProduccionProductoLineaResponse> productos) {

        Map<Long, ReporteRankingDocenteResponse> mapa = new LinkedHashMap<>();

        for (ReporteProduccionProductoLineaResponse producto : productos) {
            Long docenteId = producto.getDocenteId() != null ? producto.getDocenteId() : -1L;
            ReporteRankingDocenteResponse entry = mapa.computeIfAbsent(docenteId, id ->
                    ReporteRankingDocenteResponse.builder()
                            .docenteId(producto.getDocenteId())
                            .nombre(nombreDocente(producto))
                            .codigo(producto.getDocenteCodigo() != null ? producto.getDocenteCodigo() : GUION)
                            .facultades(producto.getFacultadesLabel())
                            .programas(producto.getProgramasLabel())
                            .total(0)
                            .publicados(0)
                            .sinPublicar(0)
                            .recientes(0)
                            .build());

            entry.setTotal(entry.getTotal() + 1);
            if (Boolean.TRUE.equals(producto.getPublicado())) {
                entry.setPublicados(entry.getPublicados() + 1);
            } else {
                entry.setSinPublicar(entry.getSinPublicar() + 1);
            }
            if (esReciente(producto.getFechaRegistroSgpa())) {
                entry.setRecientes(entry.getRecientes() + 1);
            }
        }

        return mapa.values().stream()
                .sorted(Comparator.comparingInt(ReporteRankingDocenteResponse::getTotal).reversed())
                .toList();
    }

    // Agrupar los productos por año, según el campo de fecha especificado (fecha de registro o fecha de publicación)
    // Se utiliza para generar el gráfico de producción por año en el reporte ejecutivo
    private List<ReporteConteoItemResponse> agruparPorAnio(
            List<ReporteProduccionProductoLineaResponse> productos,
            String campoFecha) {

        Map<Integer, Integer> mapa = new HashMap<>();
        for (ReporteProduccionProductoLineaResponse producto : productos) {
            LocalDate fecha = CAMPO_FECHA_PUBLICACION.equals(campoFecha)
                    ? producto.getFechaPublicacionSgpa()
                    : producto.getFechaRegistroSgpa();
            if (fecha == null) continue;
            int anio = fecha.getYear();
            mapa.put(anio, mapa.getOrDefault(anio, 0) + 1);
        }

        return mapa.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> ReporteConteoItemResponse.builder()
                        .key(String.valueOf(e.getKey()))
                        .count(e.getValue())
                        .build())
                .toList();
    }

    // Agrupar los productos por tipo, acumulando la información de producción docente para cada tipo
    private List<ReporteConteoItemResponse> agruparPorTipoConEstado(
            List<ReporteProduccionProductoLineaResponse> productos) {

        Map<String, int[]> mapa = new HashMap<>();
        for (ReporteProduccionProductoLineaResponse producto : productos) {
            String key = producto.getTipo();
            if (key == null || key.isBlank()) key = "SIN_DATOS";
            int[] acum = mapa.computeIfAbsent(key, k -> new int[3]);
            acum[0] += 1;
            if (Boolean.TRUE.equals(producto.getPublicado())) {
                acum[1] += 1;
            } else {
                acum[2] += 1;
            }
        }

        return mapa.entrySet().stream()
                .sorted((a, b) -> Integer.compare(b.getValue()[0], a.getValue()[0]))
                .map(e -> ReporteConteoItemResponse.builder()
                        .key(e.getKey())
                        .count(e.getValue()[0])
                        .publicados(e.getValue()[1])
                        .sinPublicar(e.getValue()[2])
                        .build())
                .toList();
    }

    // Agrupar los productos por una clave específica, utilizando una función para obtener la clave de cada producto
    // Se utiliza para generar los gráficos de conteo por categoría, subcategoría y tipo en el reporte ejecutivo
    private List<ReporteConteoItemResponse> agruparConteo(
            List<ReporteProduccionProductoLineaResponse> productos,
            java.util.function.Function<ReporteProduccionProductoLineaResponse, String> keyFn) {

        Map<String, Integer> mapa = new HashMap<>();
        for (ReporteProduccionProductoLineaResponse producto : productos) {
            String key = keyFn.apply(producto);
            if (key == null || key.isBlank()) key = "SIN_DATOS";
            mapa.put(key, mapa.getOrDefault(key, 0) + 1);
        }

        return mapa.entrySet().stream()
                .sorted((a, b) -> Integer.compare(b.getValue(), a.getValue()))
                .map(e -> ReporteConteoItemResponse.builder()
                        .key(e.getKey())
                        .count(e.getValue())
                        .build())
                .toList();
    }

    // Obtener los productos más recientes según la fecha de registro en SGPA, limitando el resultado a un máximo de 10 productos
    private List<ReporteProduccionProductoLineaResponse> productosRecientes(
            List<ReporteProduccionProductoLineaResponse> productos) {

        return productos.stream()
                .sorted(Comparator.comparing(
                        ReporteProduccionProductoLineaResponse::getFechaRegistroSgpa,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(10)
                .toList();
    }

    // Obtener la lista de categorías disponibles en los productos, eliminando duplicados y ordenando alfabéticamente
    // Se utiliza para generar las opciones de filtro de categoría en el reporte ejecutivo
    private List<String> categoriasDisponibles(List<ReporteProduccionProductoLineaResponse> productos) {
        return productos.stream()
                .map(ReporteProduccionProductoLineaResponse::getCategoria)
                .filter(Objects::nonNull)
                .filter(s -> !s.isBlank())
                .distinct()
                .sorted()
                .toList();
    }

    // Obtener la lista de subcategorías disponibles en los productos, filtrando por categoría si se especifica,
    // eliminando duplicados y ordenando alfabéticamente
    private List<String> subcategoriasDisponibles(
            List<ReporteProduccionProductoLineaResponse> productos,
            String categoriaFiltro) {

        return productos.stream()
                .filter(p -> CATEGORIA_TODAS.equals(categoriaFiltro)
                        || Objects.equals(categoriaFiltro, p.getCategoria()))
                .map(ReporteProduccionProductoLineaResponse::getSubcategoria)
                .filter(Objects::nonNull)
                .filter(s -> !s.isBlank())
                .distinct()
                .sorted()
                .toList();
    }

    // Obtener la lista de tipos disponibles en los productos, filtrando por categoría y subcategoría si se especifica,
    // eliminando duplicados y ordenando alfabéticamente
    private List<String> tiposDisponibles(
                List<ReporteProduccionProductoLineaResponse> productos,
                String categoriaFiltro,
                String subcategoriaFiltro) {

        return productos.stream()
                .filter(p -> CATEGORIA_TODAS.equals(categoriaFiltro)
                        || Objects.equals(categoriaFiltro, p.getCategoria()))
                .filter(p -> SUBCATEGORIA_TODAS.equals(subcategoriaFiltro)
                        || Objects.equals(subcategoriaFiltro, p.getSubcategoria()))
                .map(ReporteProduccionProductoLineaResponse::getTipo)
                .filter(Objects::nonNull)
                .filter(s -> !s.isBlank())
                .distinct()
                .sorted()
                .toList();
    }

    // Construir las etiquetas de los filtros aplicados, generando una representación legible de los valores seleccionados
    private ReporteProduccionFiltrosEtiquetasResponse construirEtiquetasFiltros(
            ReporteProduccionFiltrosResponse filtros,
            List<FacultadResponse> facultades,
            List<ProgramaResponse> programas) {

        String facultadLabel = filtros.getFacultadId() == null
                ? "Todas"
                : facultades.stream()
                        .filter(f -> Objects.equals(f.getId(), filtros.getFacultadId()))
                        .map(FacultadResponse::getNombre)
                        .findFirst()
                        .orElse(String.valueOf(filtros.getFacultadId()));

        String programaLabel = filtros.getProgramaId() == null
                ? "Todos"
                : programas.stream()
                        .filter(p -> Objects.equals(p.getId(), filtros.getProgramaId()))
                        .map(ProgramaResponse::getNombre)
                        .findFirst()
                        .orElse(String.valueOf(filtros.getProgramaId()));

        String fechaLabel;
        if (filtros.getFechaDesde() == null && filtros.getFechaHasta() == null) {
            fechaLabel = "Todas";
        } else {
            String desde = filtros.getFechaDesde() != null ? filtros.getFechaDesde().toString() : "…";
            String hasta = filtros.getFechaHasta() != null ? filtros.getFechaHasta().toString() : "…";
            String campo = CAMPO_FECHA_PUBLICACION.equals(filtros.getCampoFecha())
                    ? "publicado en SGPA"
                    : "registrado en SGPA";
            fechaLabel = desde + " — " + hasta + " (" + campo + ")";
        }

        return ReporteProduccionFiltrosEtiquetasResponse.builder()
                .estado(etiquetaEstado(filtros.getEstado()))
                .categoria(CATEGORIA_TODAS.equals(filtros.getCategoria())
                        ? "Todas" : filtros.getCategoria())
                .subcategoria(SUBCATEGORIA_TODAS.equals(filtros.getSubcategoria())
                        ? "Todas" : filtros.getSubcategoria())
                .tipo(FILTRO_TIPO_TODOS.equals(filtros.getTipo())
                        ? "Todos" : filtros.getTipo())
                .facultad(facultadLabel)
                .programa(programaLabel)
                .fecha(fechaLabel)
                .busqueda(filtros.getBusqueda() != null && !filtros.getBusqueda().isBlank()
                        ? filtros.getBusqueda() : GUION)
                .build();
    }

    // Construir las opciones de filtros disponibles, incluyendo categorías, subcategorías, tipos, facultades y programas
    // Se utiliza para generar los menús desplegables de filtros en el reporte ejecutivo
    private String etiquetaEstado(String estado) {
        return switch (estado) {
            case ESTADO_PUBLICADO -> "Publicados";
            case ESTADO_SIN_PUBLICAR -> "Sin publicar";
            default -> "Todos";
        };
    }

    private record ContextoReporte(
            ReporteProduccionFiltrosResponse filtrosAplicados,
            ReporteProduccionFiltrosEtiquetasResponse filtrosEtiquetas,
            List<ReporteProduccionProductoLineaResponse> productosFiltrados,
            ReporteProduccionResumenResponse resumen,
            ReporteCoberturaDocenteResponse cobertura,
            List<ReporteProduccionFacultadResponse> porFacultad,
            List<ReporteProduccionProgramaResponse> porPrograma,
            List<ReporteRankingDocenteResponse> rankingDocentes,
            ReporteProduccionGraficosResponse graficos,
            ReporteProduccionOpcionesResponse opciones) {
    }

    private record DocenteAtribucion(
            List<Long> facultadIds,
            List<String> facultadNombres,
            List<Long> programaIds,
            List<String> programaNombres,
            String facultadesLabel,
            String programasLabel) {

        static DocenteAtribucion vacia() {
            return new DocenteAtribucion(List.of(), List.of(), List.of(), List.of(), GUION, GUION);
        }
    }

    private record ProduccionUnidad(
            int total,
            int publicados,
            int sinPublicar,
            int recientes,
            int docentesConProduccion,
            int totalDocentes,
            int porcentajeCobertura) {
    }
}
