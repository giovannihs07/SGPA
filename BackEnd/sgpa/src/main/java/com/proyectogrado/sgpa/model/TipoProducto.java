package com.proyectogrado.sgpa.model;

import java.util.List;

public enum TipoProducto {
    
    // GENERACIÓN DE NUEVO CONOCIMIENTO
    
    ARTICULO_INVESTIGACION(
        SubcategoriaProducto.NUEVO_CONOCIMIENTO,
        List.of("doi", "revista", "volumen", "paginacion", "clasificacion") // clasificacion: A1-D
    ),
    NOTA_CIENTIFICA(
        SubcategoriaProducto.NUEVO_CONOCIMIENTO,
        List.of("doi", "revista", "volumen", "clasificacion")
    ),
    LIBRO_INVESTIGACION(
        SubcategoriaProducto.NUEVO_CONOCIMIENTO,
        List.of("isbn", "editorial", "edicion", "anioPublicacion")
    ),
    CAPITULO_LIBRO_INVESTIGACION(
        SubcategoriaProducto.NUEVO_CONOCIMIENTO,
        List.of("isbn", "tituloLibro", "editorial", "paginaInicio", "paginaFin")
    ),
    PATENTE_INVENCION(
        SubcategoriaProducto.NUEVO_CONOCIMIENTO,
        List.of("numeroPatente", "paisConcesion", "fechaSolicitud", "estadoPatente")
    ),
    PATENTE_MODELO_UTILIDAD(
        SubcategoriaProducto.NUEVO_CONOCIMIENTO,
        List.of("numeroPatente", "paisConcesion", "fechaSolicitud", "estadoPatente")
    ),
    VARIEDAD_VEGETAL(
        SubcategoriaProducto.NUEVO_CONOCIMIENTO,
        List.of("nombreVariedad", "especie", "entidadCertificadora", "fechaRegistro")
    ),
    NUEVA_RAZA_ANIMAL(
        SubcategoriaProducto.NUEVO_CONOCIMIENTO,
        List.of("nombreRaza", "especie", "entidadCertificadora", "fechaRegistro")
    ),
    POBLACION_MEJORADA_RAZAS_PECUARIAS(
        SubcategoriaProducto.NUEVO_CONOCIMIENTO,
        List.of("nombrePoblacion", "especie", "caracteristicaMejorada", "entidadCertificadora")
    ),
    OBRA_CREACION_EFIMERA(
        SubcategoriaProducto.NUEVO_CONOCIMIENTO,
        List.of("disciplina", "lugarPresentacion", "fechaPresentacion")
    ),
    OBRA_CREACION_PERMANENTE(
        SubcategoriaProducto.NUEVO_CONOCIMIENTO,
        List.of("disciplina", "lugarExposicion", "fechaCreacion", "tecnica")
    ),
    OBRA_CREACION_PROCESUAL(
        SubcategoriaProducto.NUEVO_CONOCIMIENTO,
        List.of("disciplina", "descripcionProceso", "fechaInicio", "fechaFin")
    ),

 
    // DESARROLLO TECNOLÓGICO E INNOVACIÓN

    DISENO_INDUSTRIAL(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("numeroRegistro", "entidadRegistradora", "fechaRegistro")
    ),
    ESQUEMA_CIRCUITO_INTEGRADO(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("numeroRegistro", "entidadRegistradora", "fechaRegistro")
    ),
    SOFTWARE(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("version", "lenguaje", "repositorio", "licencia", "numeroRegistro")
    ),
    PLANTA_PILOTO(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("entidadCertificadora", "fechaCertificacion", "capacidadProduccion")
    ),
    PROTOTIPO_INDUSTRIAL(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("entidadValidadora", "fechaValidacion", "sector")
    ),
    SIGNO_DISTINTIVO(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("tipoSigno", "numeroRegistro", "entidadRegistradora", "fechaRegistro")
    ),
    PRODUCTO_NUTRACEUTICO(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("registroSanitario", "entidadCertificadora", "fechaRegistro")
    ),
    COLECCION_CIENTIFICA(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("tipoColeccion", "numeroEspecimenes", "entidadDepositaria")
    ),
    NUEVO_REGISTRO_CIENTIFICO(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("taxon", "lugarDescubrimiento", "publicacionAsociada")
    ),
    SECRETO_EMPRESARIAL(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("sector", "descripcionGeneral", "fechaCreacion")
    ),
    SPIN_OFF(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("nombreEmpresa", "sectorEconomico", "anioFundacion", "nit")
    ),
    START_UP(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("nombreEmpresa", "sectorEconomico", "anioFundacion", "nit")
    ),
    EMPRESA_CREATIVA_CULTURAL(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("nombreEmpresa", "disciplina", "anioFundacion", "nit")
    ),
    INNOVACION_GESTION_EMPRESARIAL(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("nombreEmpresaBeneficiada", "descripcionInnovacion", "anioImplementacion")
    ),
    INNOVACION_PROCEDIMIENTOS_SERVICIOS(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("nombreEmpresaBeneficiada", "descripcionInnovacion", "anioImplementacion")
    ),
    NORMA_TECNICA(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("codigoNorma", "entidadEmisora", "anioEmision", "alcance")
    ),
    REGLAMENTO_TECNICO(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("codigoReglamento", "entidadEmisora", "anioEmision", "alcance")
    ),
    GUIA_PRACTICA_CLINICA(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("codigoGuia", "entidadEmisora", "anioEmision", "patologiaAsociada")
    ),
    PROTOCOLO_VIGILANCIA_EPIDEMIOLOGICA(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("codigoProtocolo", "entidadEmisora", "anioEmision", "enfermedadAsociada")
    ),
    ACTO_LEGISLATIVO(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("numeroActo", "organoEmisor", "anioEmision", "temaTratado")
    ),
    PROYECTO_LEY(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("numeroProyecto", "organoEmisor", "anioRadicacion", "temaTratado")
    ),
    CONCEPTO_TECNICO(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("entidadSolicitante", "temaTratado", "fechaEmision")
    ),
    ACUERDO_LICENCIA_OBRA_CREACION(
        SubcategoriaProducto.DESARROLLO_TECNOLOGICO,
        List.of("tituloObra", "licenciatario", "fechaAcuerdo", "tipoExplotacion")
    ),

    // APROPIACIÓN SOCIAL DEL CONOCIMIENTO
 
    APROPIACION_INTERES_SOCIAL(
        SubcategoriaProducto.APROPIACION_SOCIAL,
        List.of("comunidadBeneficiada", "problematicaAtendida", "fechaInicio", "fechaFin")
    ),
    APROPIACION_POLITICA_PUBLICA(
        SubcategoriaProducto.APROPIACION_SOCIAL,
        List.of("entidadPublica", "normativaAsociada", "fechaInicio", "fechaFin")
    ),
    APROPIACION_CADENAS_PRODUCTIVAS(
        SubcategoriaProducto.APROPIACION_SOCIAL,
        List.of("sectorProductivo", "empresasParticipantes", "fechaInicio", "fechaFin")
    ),
    APROPIACION_CENTRO_CIENCIA(
        SubcategoriaProducto.APROPIACION_SOCIAL,
        List.of("centroCiencia", "grupoInvestigacion", "fechaInicio", "fechaFin")
    ),

    // =========================================================
    // DIVULGACIÓN PÚBLICA DE LA CIENCIA
    // =========================================================

    EVENTO_CIENTIFICO(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("nombreEvento", "lugarEvento", "fechaEvento", "tipoParticipacion")
    ),
    PARTICIPACION_RED_CONOCIMIENTO(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("nombreRed", "rolParticipacion", "fechaIngreso")
    ),
    TALLER_CREACION(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("tematica", "lugarRealizacion", "fechaRealizacion", "numeroParticipantes")
    ),
    EVENTO_ARTISTICO_APROPIACION(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("nombreEvento", "disciplina", "lugarEvento", "fechaEvento")
    ),
    DOCUMENTO_TRABAJO(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("institucionPublicadora", "serieNumero", "anioPublicacion")
    ),
    NUEVA_SECUENCIA_GENETICA(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("codigoAcceso", "baseDatos", "organismo", "fechaDeposito")
    ),
    EDICION_REVISTA_LIBRO_DIVULGACION(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("issn", "volumen", "numero", "anioPublicacion")
    ),
    INFORME_FINAL_INVESTIGACION(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("entidadFinanciadora", "codigoProyecto", "anioEntrega")
    ),
    INFORME_TECNICO(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("entidadDestinataria", "temaTratado", "fechaEntrega")
    ),
    CONSULTORIA_CIENTIFICA_TECNOLOGICA(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("entidadContratante", "objetoConsultoria", "fechaInicio", "fechaFin")
    ),
    CONSULTORIA_ARTE_ARQUITECTURA_DISENO(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("entidadContratante", "objetoConsultoria", "fechaInicio", "fechaFin")
    ),
    CONTENIDO_MULTIFORMATO_DIVULGACION(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("formato", "plataformaPublicacion", "fechaPublicacion")
    ),
    PUBLICACION_EDITORIAL_NO_ESPECIALIZADA(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("medioPublicacion", "tematica", "fechaPublicacion")
    ),
    PRODUCCION_CONTENIDO_DIGITAL(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("formato", "plataformaPublicacion", "fechaPublicacion", "enlace")
    ),
    CONTENIDO_TRANSMEDIA(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("plataformasUtilizadas", "tematica", "fechaLanzamiento")
    ),
    DESARROLLO_WEB(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("urlSitio", "tecnologiasUsadas", "fechaLanzamiento")
    ),
    LIBRO_FORMACION(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("isbn", "editorial", "anioPublicacion", "publicoObjetivo")
    ),
    BOLETIN_DIVULGATIVO(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("issn", "numero", "anioPublicacion", "institucionPublicadora")
    ),
    LIBRO_DIVULGACION_COMPILACION(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("isbn", "editorial", "anioPublicacion")
    ),
    MANUAL_GUIA_ESPECIALIZADA(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("isbn", "editorial", "anioPublicacion", "publicoObjetivo")
    ),
    LIBRO_CREACION_PILOTO(
        SubcategoriaProducto.DIVULGACION_PUBLICA_CIENCIA,
        List.of("isbn", "editorial", "anioPublicacion", "disciplinaCreacion")
    ),
    
    // FORMACIÓN DE RECURSO HUMANO 

    DIRECCION_TESIS_DOCTORADO(
        SubcategoriaProducto.FORMACION_RECURSO_HUMANO,
        List.of("nombreEstudiante", "universidad", "programa", "anioGraduacion")
    ),
    DIRECCION_TRABAJO_MAESTRIA(
        SubcategoriaProducto.FORMACION_RECURSO_HUMANO,
        List.of("nombreEstudiante", "universidad", "programa", "anioGraduacion")
    ),
    DIRECCION_TRABAJO_PREGRADO(
        SubcategoriaProducto.FORMACION_RECURSO_HUMANO,
        List.of("nombreEstudiante", "universidad", "programa", "anioGraduacion")
    ),
    PROYECTO_ID_I(
        SubcategoriaProducto.FORMACION_RECURSO_HUMANO,
        List.of("entidadFinanciadora", "codigoProyecto", "fechaInicio", "fechaFin")
    ),
    PROYECTO_EXTENSION_RSC(
        SubcategoriaProducto.FORMACION_RECURSO_HUMANO,
        List.of("entidadBeneficiada", "objetoProyecto", "fechaInicio", "fechaFin")
    ),
    APOYO_CREACION_PROGRAMAS_FORMACION(
        SubcategoriaProducto.FORMACION_RECURSO_HUMANO,
        List.of("nombrePrograma", "institucion", "anioCreacion")
    ),
    ASESORIA_PROGRAMA_ONDAS(
        SubcategoriaProducto.FORMACION_RECURSO_HUMANO,
        List.of("lineaTematica", "institucionEducativa", "anio")
    ),

    // ACADÉMICOS — MATERIAL DIDÁCTICO

    GUIA_LABORATORIO(
        SubcategoriaProducto.MATERIAL_DIDACTICO,
        List.of("asignatura", "programa", "numeroGuia")
    ),
    GUIA_CLASE(
        SubcategoriaProducto.MATERIAL_DIDACTICO,
        List.of("asignatura", "programa", "tema")
    ),
    PRESENTACION(
        SubcategoriaProducto.MATERIAL_DIDACTICO,
        List.of("asignatura", "programa", "tema", "numeroSlides")
    ),
    BANCO_PREGUNTAS(
        SubcategoriaProducto.MATERIAL_DIDACTICO,
        List.of("asignatura", "programa", "numeroPregunta")
    ),
    RECURSO_EDUCATIVO_DIGITAL(
        SubcategoriaProducto.MATERIAL_DIDACTICO,
        List.of("asignatura", "programa", "formatoRecurso", "enlace")
    ),

    // ACADÉMICOS — ACTIVIDAD DOCENTE

    CURSO_DICTADO(
        SubcategoriaProducto.ACTIVIDAD_DOCENTE,
        List.of("asignatura", "programa", "semestre", "numeroEstudiantes")
    ),
    ASIGNATURA_DISENADA(
        SubcategoriaProducto.ACTIVIDAD_DOCENTE,
        List.of("nombreAsignatura", "programa", "creditos", "anioDiseno")
    ),
    
    // ACADÉMICOS — GESTIÓN ACADÉMICA

    PARTICIPACION_COMITE(
        SubcategoriaProducto.GESTION_ACADEMICA,
        List.of("nombreComite", "rolParticipacion", "anio")
    ),
    COORDINACION_PROGRAMA(
        SubcategoriaProducto.GESTION_ACADEMICA,
        List.of("nombrePrograma", "fechaInicio", "fechaFin")
    ),
    EVALUACION_CURRICULAR(
        SubcategoriaProducto.GESTION_ACADEMICA,
        List.of("nombrePrograma", "tipoEvaluacion", "anio")
    ),

    // ACADÉMICOS — EXTENSIÓN

    CURSO_EDUCACION_CONTINUA(
        SubcategoriaProducto.EXTENSION,
        List.of("nombreCurso", "publicoObjetivo", "horas", "fechaRealizacion")
    ),
    CAPACITACION_EXTERNA(
        SubcategoriaProducto.EXTENSION,
        List.of("nombreCapacitacion", "entidadBeneficiada", "horas", "fechaRealizacion")
    ),
    DIPLOMADO(
        SubcategoriaProducto.EXTENSION,
        List.of("nombreDiplomado", "publicoObjetivo", "horas", "fechaInicio", "fechaFin")
    );

    private final SubcategoriaProducto subcategoria;
    private final List<String> atributosRequeridos;

    TipoProducto(SubcategoriaProducto subcategoria, List<String> atributosRequeridos) {
        this.subcategoria = subcategoria;
        this.atributosRequeridos = atributosRequeridos;
    }

    public SubcategoriaProducto getSubcategoria() { 
        return subcategoria; 
    }
    public List<String> getAtributosRequeridos() { 
        return atributosRequeridos; 
    }
}