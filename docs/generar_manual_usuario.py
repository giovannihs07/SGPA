# -*- coding: utf-8 -*-
"""Genera el borrador del Manual de Usuario SGPA en formato Word."""

from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os

OUTPUT = os.path.join(os.path.dirname(__file__), "Manual_de_Usuario_SGPA.docx")


def set_cell_shading(cell, fill="D9E2F3"):
    shading = OxmlElement("w:shd")
    shading.set(qn("w:fill"), fill)
    cell._tc.get_or_add_tcPr().append(shading)


def add_heading(doc, text, level=1):
    return doc.add_heading(text, level=level)


def add_para(doc, text, bold=False, italic=False):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.bold = bold
    run.italic = italic
    run.font.size = Pt(11)
    run.font.name = "Calibri"
    return p


def add_bullet(doc, text, level=0):
    style = "List Bullet" if level == 0 else "List Bullet 2"
    p = doc.add_paragraph(text, style=style)
    for run in p.runs:
        run.font.size = Pt(11)
        run.font.name = "Calibri"
    return p


def add_numbered(doc, text):
    p = doc.add_paragraph(text, style="List Number")
    for run in p.runs:
        run.font.size = Pt(11)
        run.font.name = "Calibri"
    return p


def add_table(doc, headers, rows):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = h
        set_cell_shading(hdr[i])
        for p in hdr[i].paragraphs:
            for run in p.runs:
                run.bold = True
                run.font.size = Pt(10)
    for ri, row in enumerate(rows):
        cells = table.rows[ri + 1].cells
        for ci, val in enumerate(row):
            cells[ci].text = str(val)
            for p in cells[ci].paragraphs:
                for run in p.runs:
                    run.font.size = Pt(10)
    doc.add_paragraph()
    return table


def add_note(doc, text):
    p = doc.add_paragraph()
    run = p.add_run("Nota: ")
    run.bold = True
    run.font.size = Pt(10)
    run2 = p.add_run(text)
    run2.italic = True
    run2.font.size = Pt(10)


def build_document():
    doc = Document()

    # Márgenes
    for section in doc.sections:
        section.top_margin = Cm(2.5)
        section.bottom_margin = Cm(2.5)
        section.left_margin = Cm(3)
        section.right_margin = Cm(2.5)

    # --- Portada ---
    for _ in range(6):
        doc.add_paragraph()
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = title.add_run("MANUAL DE USUARIO")
    r.bold = True
    r.font.size = Pt(24)
    r.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    subtitle = doc.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r2 = subtitle.add_run("Sistema de Gestión de Producción Académica (SGPA)")
    r2.font.size = Pt(16)
    r2.bold = True

    doc.add_paragraph()
    inst = doc.add_paragraph()
    inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r3 = inst.add_run("Universidad de Cartagena")
    r3.font.size = Pt(14)

    doc.add_paragraph()
    ver = doc.add_paragraph()
    ver.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r4 = ver.add_run("Versión 1.0 — Borrador\nJunio 2026")
    r4.font.size = Pt(12)
    r4.italic = True

    doc.add_page_break()

    # --- Índice manual ---
    add_heading(doc, "Índice", 1)
    toc_items = [
        "1. Introducción",
        "2. Requisitos y acceso al sistema",
        "3. Guía del docente",
        "4. Guía del administrador y docente administrativo",
        "5. Guía del superadministrador",
        "6. Portal público",
        "7. Mi perfil",
        "8. Estados de producto y publicación",
        "9. Preguntas frecuentes",
        "10. Anexos",
    ]
    for item in toc_items:
        add_para(doc, item)
    doc.add_page_break()

    # --- 1. Introducción ---
    add_heading(doc, "1. Introducción", 1)

    add_heading(doc, "1.1 Propósito del documento", 2)
    add_para(
        doc,
        "El presente manual describe el uso del Sistema de Gestión de Producción Académica "
        "(SGPA) de la Universidad de Cartagena. Está dirigido a docentes, personal "
        "administrativo, superadministradores y visitantes del portal público. Su objetivo "
        "es facilitar el registro, consulta y reporte de la producción académica institucional."
    )

    add_heading(doc, "1.2 ¿Qué es SGPA?", 2)
    add_para(
        doc,
        "SGPA es el sistema institucional que permite a los docentes registrar, organizar, "
        "publicar y reportar su producción académica: artículos, libros, proyectos, productos "
        "formativos y demás evidencias vinculadas a su labor investigativa y académica. "
        "Además, ofrece herramientas de consulta y reportes para la gestión institucional."
    )

    add_heading(doc, "1.3 Alcance del sistema", 2)
    add_bullet(doc, "Registro y gestión de productos académicos por parte de los docentes.")
    add_bullet(doc, "Publicación voluntaria de productos en el portal público institucional.")
    add_bullet(doc, "Generación de reportes personales e institucionales de producción.")
    add_bullet(doc, "Administración de usuarios y moderación de productos publicados.")
    add_bullet(doc, "Configuración del sistema y auditoría de acciones sensibles (superadministrador).")

    add_heading(doc, "1.4 Roles de usuario", 2)
    add_table(
        doc,
        ["Rol", "Descripción"],
        [
            ["Docente", "Registra y gestiona su propia producción académica."],
            ["Docente administrativo", "Combina funciones de docente con gestión institucional de usuarios y productos."],
            ["Administrativo", "Supervisa usuarios, productos publicados y reportes institucionales."],
            ["Superadministrador", "Administra la configuración global, auditoría y reportes del sistema."],
            ["Visitante", "Consulta el catálogo público sin necesidad de iniciar sesión."],
        ],
    )

    # --- 2. Requisitos y acceso ---
    add_heading(doc, "2. Requisitos y acceso al sistema", 1)

    add_heading(doc, "2.1 Requisitos técnicos", 2)
    add_bullet(doc, "Navegador web actualizado (Chrome, Firefox, Edge o Safari).")
    add_bullet(doc, "Conexión a Internet estable.")
    add_bullet(doc, "Correo electrónico institucional con dominio @unicartagena.edu.co.")

    add_heading(doc, "2.2 Acceso al sistema", 2)
    add_para(doc, "La dirección del portal público es la página principal del sistema. Desde allí puede acceder al catálogo o iniciar sesión en el área privada.")
    add_bullet(doc, "Portal público: /portal/public")
    add_bullet(doc, "Inicio de sesión: /login")

    add_heading(doc, "2.3 Iniciar sesión", 2)
    add_para(doc, "Para ingresar al sistema:")
    add_numbered(doc, "Abra la página de inicio de sesión.")
    add_numbered(doc, "Ingrese su correo electrónico institucional (@unicartagena.edu.co).")
    add_numbered(doc, "Ingrese su contraseña.")
    add_numbered(doc, "Haga clic en el botón Ingresar.")
    add_para(doc, "Tras un inicio de sesión exitoso, el sistema redirige automáticamente al panel correspondiente según su rol:")
    add_bullet(doc, "Superadministrador → Panel de Super Admin")
    add_bullet(doc, "Docente administrativo → Panel combinado docente-admin")
    add_bullet(doc, "Administrativo → Panel Administrativo")
    add_bullet(doc, "Docente → Panel del Docente")

    add_heading(doc, "2.4 Crear cuenta (registro)", 2)
    add_para(
        doc,
        "Los usuarios nuevos pueden registrarse mediante un asistente de tres pasos. "
        "Los campos marcados con asterisco (*) son obligatorios."
    )

    add_heading(doc, "Paso 1 — Perfil", 3)
    add_bullet(doc, "Seleccione el tipo de usuario: Docente y/o Administrativo.")
    add_bullet(doc, "Complete los datos personales: Nombres, Apellidos, Cédula y Teléfono.")
    add_bullet(doc, "Haga clic en Siguiente.")

    add_heading(doc, "Paso 2 — Rol", 3)
    add_para(doc, "Si seleccionó Docente, complete:")
    add_bullet(doc, "Código docente, tipo de contrato (Docente de planta, Docente ocasional o Catedrático).")
    add_bullet(doc, "Facultad y programa académico (puede añadir varios con el botón Añadir programa).")
    add_bullet(doc, "Títulos académicos (puede añadir varios con el botón Añadir título).")
    add_para(doc, "Si seleccionó Administrativo, complete:")
    add_bullet(doc, "Cargo (Administrativo, Contratista, Directivo, Técnico o Auxiliar administrativo).")
    add_bullet(doc, "Dependencia institucional.")
    add_bullet(doc, "Haga clic en Siguiente.")

    add_heading(doc, "Paso 3 — Acceso", 3)
    add_bullet(doc, "Correo electrónico institucional.")
    add_bullet(doc, "Contraseña y confirmación de contraseña (deben coincidir).")
    add_bullet(doc, "Haga clic en Crear cuenta.")
    add_para(doc, "Al finalizar, el sistema confirma la creación de la cuenta y redirige al inicio de sesión.")

    add_heading(doc, "2.5 Recuperar contraseña", 2)
    add_numbered(doc, "En la pantalla de inicio de sesión, haga clic en Olvidaste tu contraseña.")
    add_numbered(doc, "Ingrese su correo institucional y haga clic en Enviar código.")
    add_numbered(doc, "Revise su bandeja de entrada: recibirá un código de 6 dígitos (válido por 30 minutos).")
    add_numbered(doc, "En la pantalla Nueva contraseña, ingrese el código, la nueva contraseña y su confirmación.")
    add_numbered(doc, "Haga clic en Guardar contraseña.")

    # --- 3. Guía del docente ---
    add_heading(doc, "3. Guía del docente", 1)

    add_heading(doc, "3.1 Panel del docente (Dashboard)", 2)
    add_para(
        doc,
        "Al ingresar, el docente accede a un resumen de su producción académica. "
        "El panel muestra indicadores (KPIs) de total de productos, publicados, sin publicar "
        "y nuevos en los últimos 30 días."
    )
    add_bullet(doc, "Productos recientes registrados.")
    add_bullet(doc, "Distribución por categoría.")
    add_bullet(doc, "Alertas si aún no ha registrado producción o tiene productos sin publicar.")
    add_bullet(doc, "Botón Actualizar para refrescar los datos.")

    add_heading(doc, "3.2 Registrar un producto académico", 2)
    add_para(
        doc,
        "Desde el menú lateral, seleccione Registrar producto. El formulario se organiza "
        "en secciones en una sola pantalla:"
    )

    add_heading(doc, "Sección: Información general", 3)
    add_bullet(doc, "Nombre del producto (*): título o nombre del producto académico.")
    add_bullet(doc, "Descripción (*): resumen del alcance y relevancia del producto.")

    add_heading(doc, "Sección: Clasificación del producto", 3)
    add_para(doc, "Seleccione en cascada los siguientes campos obligatorios:")
    add_numbered(doc, "Categoría (por ejemplo: Investigativo o Académico).")
    add_numbered(doc, "Subcategoría (depende de la categoría seleccionada).")
    add_numbered(doc, "Tipo de producto (depende de la subcategoría seleccionada).")
    add_note(doc, "Al cambiar un nivel superior, los niveles inferiores se reinician automáticamente.")

    add_heading(doc, "Sección: Atributos específicos", 3)
    add_para(
        doc,
        "Según el tipo de producto elegido, aparecerán campos adicionales (texto, número, "
        "fecha, casilla de verificación o lista desplegable). Complete todos los campos "
        "marcados como obligatorios."
    )

    add_heading(doc, "Sección: Archivos adjuntos", 3)
    add_bullet(doc, "El archivo Principal es obligatorio.")
    add_bullet(doc, "Formatos permitidos: PDF, Word, Excel, PowerPoint, ZIP, RAR y 7Z.")
    add_bullet(doc, "Tamaño máximo por archivo: 10 MB.")
    add_bullet(doc, "Máximo 5 archivos por producto.")
    add_bullet(doc, "Roles de archivo: Principal, Anexo, Evidencia u Otro.")
    add_para(doc, "Haga clic en Registrar producto. El producto quedará en estado Sin publicar.")

    add_heading(doc, "3.3 Mis productos", 2)
    add_para(
        doc,
        "En esta sección el docente consulta, filtra y gestiona todos sus productos registrados."
    )

    add_heading(doc, "Filtros disponibles", 3)
    add_bullet(doc, "Búsqueda por nombre o descripción.")
    add_bullet(doc, "Estado: Todos, Publicado o Sin publicar.")
    add_bullet(doc, "Categoría y tipo de producto.")

    add_heading(doc, "Acciones por producto", 3)
    add_table(
        doc,
        ["Acción", "Descripción"],
        [
            ["Ver", "Abre el detalle completo del producto."],
            ["Editar", "Permite modificar el producto (solo si está Sin publicar)."],
            ["Publicar / Despublicar", "Controla la visibilidad del producto en el portal."],
            ["Descargar", "Descarga el archivo principal del producto."],
            ["Eliminar", "Elimina el producto (solo si está Sin publicar)."],
        ],
    )

    add_heading(doc, "3.4 Editar un producto", 2)
    add_para(
        doc,
        "Para editar un producto, acceda a Mis productos y haga clic en el icono Editar. "
        "Si el producto está publicado, la edición estará bloqueada. Debe despublicarlo "
        "primero desde Mis productos."
    )

    add_heading(doc, "3.5 Mis reportes", 2)
    add_para(
        doc,
        "Esta sección permite consultar estadísticas y el detalle de la producción académica "
        "personal del docente."
    )
    add_bullet(doc, "Filtros: búsqueda, estado, categoría, subcategoría y rango de fechas (registrado o publicado en SGPA).")
    add_bullet(doc, "Indicadores, tablas y gráficos por categoría, subcategoría, tipo y estado.")
    add_bullet(doc, "Tabla de detalle con todos los productos filtrados.")
    add_bullet(doc, "Exportación a Excel y PDF mediante los botones Exportar Excel y Exportar PDF.")

    # --- 4. Admin ---
    add_heading(doc, "4. Guía del administrador y docente administrativo", 1)

    add_heading(doc, "4.1 Docente administrativo", 2)
    add_para(
        doc,
        "El perfil de docente administrativo combina las funciones del docente con la gestión "
        "institucional. Su menú incluye:"
    )
    add_bullet(doc, "Mi producción: Dashboard, Registrar producto, Mis productos.")
    add_bullet(doc, "Gestión institucional: Usuarios, Todos los productos.")
    add_bullet(doc, "Reportes: Mis reportes y Reportes institucionales.")

    add_heading(doc, "4.2 Panel administrativo", 2)
    add_para(
        doc,
        "El administrativo accede a un panel con indicadores operativos y accesos rápidos "
        "a Gestionar usuarios, Productos publicados y Reportes de producción."
    )

    add_heading(doc, "4.3 Gestión de usuarios", 2)
    add_para(doc, "Desde Usuarios, el administrador puede:")
    add_bullet(doc, "Buscar usuarios por nombre o cédula.")
    add_bullet(doc, "Filtrar por estado (Activo, Inactivo, Pendiente, Rechazado) y perfil.")
    add_bullet(doc, "Activar o desactivar cuentas de usuario.")
    add_bullet(doc, "Cambiar roles asignados (Docente, Administrativo).")
    add_note(
        doc,
        "El administrador no puede ver ni modificar cuentas de Superadministrador. "
        "Solo el superadministrador puede asignar el rol Super Admin."
    )

    add_heading(doc, "4.4 Todos los productos", 2)
    add_para(
        doc,
        "Muestra la producción académica publicada por los docentes. El administrador puede "
        "consultar, ver detalle, publicar/despublicar, descargar y eliminar productos. "
        "La columna Docente identifica al autor de cada producto."
    )

    add_heading(doc, "4.5 Reportes institucionales", 2)
    add_para(
        doc,
        "Genera indicadores de producción y cobertura docente para procesos de "
        "autoevaluación y acreditación."
    )
    add_bullet(doc, "Filtros: búsqueda, estado, facultad, programa, categoría, subcategoría y rango de fechas.")
    add_bullet(doc, "Presets de periodo: Últimos 4 años, Últimos 6 años, Año en curso.")
    add_bullet(doc, "KPIs, cobertura docente, ranking y gráficos de distribución.")
    add_bullet(doc, "Exportación: Reporte ejecutivo, Inventario de productos y Ranking de docentes (Excel y PDF).")

    # --- 5. SuperAdmin ---
    add_heading(doc, "5. Guía del superadministrador", 1)

    add_heading(doc, "5.1 Panel de Super Admin", 2)
    add_para(
        doc,
        "El superadministrador dispone de acceso completo al sistema, incluyendo "
        "configuración, auditoría y reportes globales."
    )

    add_heading(doc, "5.2 Gestión de usuarios", 2)
    add_para(
        doc,
        "Similar a la gestión del administrador, pero con visibilidad de todas las cuentas, "
        "incluidas las de otros superadministradores (marcadas como Protegido en acciones "
        "no permitidas). Puede asignar el rol Super Admin."
    )

    add_heading(doc, "5.3 Reportes del sistema", 2)
    add_bullet(doc, "Adopción del sistema: usuarios por rol y estado.")
    add_bullet(doc, "Producción global por año, categoría y estado.")
    add_bullet(doc, "Resumen de auditoría.")
    add_bullet(doc, "Exportación a Excel y PDF del reporte completo del sistema.")

    add_heading(doc, "5.4 Logs de auditoría", 2)
    add_para(doc, "Registro de acciones sensibles realizadas en el sistema.")
    add_bullet(doc, "Filtros: búsqueda, módulo (Autenticación, Usuarios, Productos, Configuración, Sistema), resultado (Exitoso, Fallido, Crítico) y rango de fechas.")
    add_bullet(doc, "Consulta del detalle de cada evento en un modal.")

    add_heading(doc, "5.5 Configuración del sistema", 2)
    add_para(doc, "Pestañas disponibles:")
    add_bullet(doc, "Institución: datos generales de la universidad.")
    add_bullet(doc, "Facultades: creación y edición de facultades.")
    add_bullet(doc, "Programas: programas académicos asociados a facultades.")
    add_bullet(doc, "Productos: taxonomía de categorías, subcategorías y tipos de producto.")
    add_note(
        doc,
        "La taxonomía de productos debe configurarse antes de que los docentes puedan "
        "registrar producción. Puede cargarse una configuración predeterminada o crearse manualmente."
    )

    # --- 6. Portal público ---
    add_heading(doc, "6. Portal público", 1)

    add_heading(doc, "6.1 Acceso", 2)
    add_para(
        doc,
        "El portal público no requiere inicio de sesión. Muestra únicamente los productos "
        "que los docentes han publicado voluntariamente y los archivos marcados como de acceso público."
    )

    add_heading(doc, "6.2 Explorar el catálogo", 2)
    add_bullet(doc, "Búsqueda por nombre, descripción o docente desde la página principal.")
    add_bullet(doc, "Filtros por categoría (Investigativo, Académico).")
    add_bullet(doc, "Más filtros: facultad, programa, subcategoría, tipo y rango de fechas.")
    add_bullet(doc, "Vista en tarjetas con paginación.")
    add_bullet(doc, "Acciones: Ver detalle y Descargar (solo archivos públicos).")

    add_heading(doc, "6.3 Detalle de producto", 2)
    add_para(
        doc,
        "Al seleccionar un producto se muestra su información completa: clasificación, "
        "atributos, docente responsable y archivos disponibles. Los archivos PDF públicos "
        "pueden visualizarse en el visor integrado."
    )

    add_heading(doc, "6.4 Sección Acerca de", 2)
    add_para(
        doc,
        "Describe el propósito del portal, qué información incluye y qué queda fuera del "
        "alcance público (productos sin publicar, archivos restringidos, datos administrativos internos)."
    )

    # --- 7. Mi perfil ---
    add_heading(doc, "7. Mi perfil", 1)
    add_para(doc, "Accesible desde el menú de usuario → Mi perfil. Permite consultar y actualizar la información personal.")

    add_heading(doc, "7.1 Información de la cuenta (solo lectura)", 2)
    add_bullet(doc, "Correo institucional, cédula, rol y estado de la cuenta.")
    add_note(doc, "El correo, la cédula y los roles solo pueden modificarse por un administrador.")

    add_heading(doc, "7.2 Datos personales", 2)
    add_bullet(doc, "Nombre, apellido y teléfono (opcional). Botón: Guardar cambios.")

    add_heading(doc, "7.3 Perfil docente o administrativo", 2)
    add_para(doc, "Según el rol del usuario, puede actualizar:")
    add_bullet(doc, "Docente: tipo de contrato, programas académicos y títulos.")
    add_bullet(doc, "Administrativo: cargo y dependencia.")

    add_heading(doc, "7.4 Seguridad", 2)
    add_bullet(doc, "Cambio de contraseña: contraseña actual, nueva contraseña (mín. 8 caracteres) y confirmación.")

    # --- 8. Estados ---
    add_heading(doc, "8. Estados de producto y publicación", 1)

    add_heading(doc, "8.1 Estados del producto", 2)
    add_table(
        doc,
        ["Estado", "Descripción"],
        [
            ["Sin publicar", "Producto registrado internamente. Puede editarse y eliminarse."],
            ["Publicado", "Producto visible en SGPA y, según configuración, en el portal público."],
        ],
    )

    add_heading(doc, "8.2 Flujo de publicación", 2)
    add_numbered(doc, "El docente registra un producto → queda en estado Sin publicar.")
    add_numbered(doc, "Desde Mis productos, hace clic en Publicar.")
    add_numbered(doc, "En el modal, define para cada archivo si es Público (descargable por cualquiera) o Restringido (solo el docente).")
    add_numbered(doc, "Confirma con Sí, publicar.")
    add_numbered(doc, "Para editar o eliminar un producto publicado, primero debe Despublicar.")

    add_heading(doc, "8.3 Reglas de archivos", 2)
    add_table(
        doc,
        ["Regla", "Valor"],
        [
            ["Tamaño máximo por archivo", "10 MB"],
            ["Máximo de archivos por producto", "5"],
            ["Formatos permitidos", "PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR, 7Z"],
            ["Archivo obligatorio", "Principal (exactamente uno)"],
            ["Roles adicionales", "Anexo, Evidencia, Otro"],
        ],
    )

    # --- 9. FAQ ---
    add_heading(doc, "9. Preguntas frecuentes", 1)

    faqs = [
        (
            "¿Puedo usar un correo que no sea @unicartagena.edu.co?",
            "No. El sistema solo acepta correos institucionales con dominio @unicartagena.edu.co.",
        ),
        (
            "¿Por qué no puedo editar mi producto?",
            "Los productos publicados no se pueden editar. Debe despublicarlos primero desde Mis productos.",
        ),
        (
            "¿Qué diferencia hay entre Publicado y Sin publicar?",
            "Sin publicar es un borrador interno visible solo para usted y los administradores. Publicado hace visible el producto en el sistema y, si configura archivos como Públicos, en el portal.",
        ),
        (
            "¿Quién puede ver mis archivos restringidos?",
            "Solo usted como docente propietario. Los administradores pueden ver la metadata pero no descargar archivos restringidos.",
        ),
        (
            "¿Cómo exporto mi reporte de producción?",
            "En Mis reportes, aplique los filtros deseados y use los botones Exportar Excel o Exportar PDF.",
        ),
        (
            "Olvidé mi contraseña, ¿qué hago?",
            "En la pantalla de inicio de sesión, seleccione Olvidaste tu contraseña, ingrese su correo y siga el proceso de verificación con el código de 6 dígitos.",
        ),
        (
            "No veo tipos de producto al registrar, ¿por qué?",
            "La taxonomía de productos aún no ha sido configurada. Contacte al superadministrador o al administrador del sistema.",
        ),
    ]
    for q, a in faqs:
        p = doc.add_paragraph()
        rq = p.add_run(f"P: {q}")
        rq.bold = True
        rq.font.size = Pt(11)
        add_para(doc, f"R: {a}")

    # --- 10. Anexos ---
    add_heading(doc, "10. Anexos", 1)

    add_heading(doc, "10.1 Tabla de permisos por rol", 2)
    add_table(
        doc,
        ["Funcionalidad", "Docente", "Doc. Admin", "Admin", "Super Admin"],
        [
            ["Registrar productos propios", "Sí", "Sí", "No", "No"],
            ["Publicar/despublicar propios", "Sí", "Sí", "No", "No"],
            ["Mis productos / Mis reportes", "Sí", "Sí", "No", "No"],
            ["Gestionar usuarios", "No", "Sí*", "Sí*", "Sí"],
            ["Ver todos los productos", "No", "Sí", "Sí", "Sí"],
            ["Moderar productos ajenos", "No", "Sí", "Sí", "Sí"],
            ["Reportes institucionales", "No", "Sí", "Sí", "No"],
            ["Reportes del sistema", "No", "No", "No", "Sí"],
            ["Logs de auditoría", "No", "No", "No", "Sí"],
            ["Configuración del sistema", "No", "No", "No", "Sí"],
            ["Portal público", "Sí", "Sí", "Sí", "Sí"],
        ],
    )
    add_note(doc, "* No pueden asignar el rol Super Admin ni gestionar cuentas de superadministrador.")

    add_heading(doc, "10.2 Rutas principales del sistema", 2)
    add_table(
        doc,
        ["Pantalla", "Ruta"],
        [
            ["Portal público", "/portal/public"],
            ["Iniciar sesión", "/login"],
            ["Registro", "/register"],
            ["Dashboard docente", "/dashboard/docente"],
            ["Registrar producto", "/dashboard/docente/registrar"],
            ["Mis productos", "/dashboard/docente/productos"],
            ["Mis reportes", "/dashboard/docente/reportes"],
            ["Dashboard administrativo", "/dashboard/admin"],
            ["Usuarios (admin)", "/dashboard/admin/usuarios"],
            ["Productos (admin)", "/dashboard/admin/productos"],
            ["Reportes (admin)", "/dashboard/admin/reportes"],
            ["Dashboard superadmin", "/dashboard/superadmin"],
            ["Auditoría", "/dashboard/superadmin/auditoria"],
            ["Configuración", "/dashboard/superadmin/configuracion"],
            ["Mi perfil", "/dashboard/perfil"],
        ],
    )

    add_heading(doc, "10.3 Soporte", 2)
    add_para(
        doc,
        "Para incidencias técnicas o solicitudes de acceso, contacte a la Oficina de Sistemas "
        "o al administrador designado por su dependencia o facultad."
    )

    # Pie de documento
    doc.add_paragraph()
    footer_p = doc.add_paragraph()
    footer_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    fr = footer_p.add_run("— Fin del documento —")
    fr.italic = True
    fr.font.size = Pt(10)
    fr.font.color.rgb = RGBColor(0x80, 0x80, 0x80)

    doc.save(OUTPUT)
    print(f"Generado: {OUTPUT}")


if __name__ == "__main__":
    build_document()
