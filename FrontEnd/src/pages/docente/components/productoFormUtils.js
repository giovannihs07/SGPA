/** Estado inicial del formulario de producto (IDs de taxonomía dinámica). */
export const INITIAL_PRODUCTO_FORM = {
    nombre:          "",
    descripcion:     "",
    categoriaId:     "",
    subcategoriaId:  "",
    tipoProductoId:  "",
    atributos:       {},
};

/** Convierte la respuesta del API al estado del formulario */
export const productoToForm = (producto) => ({
    nombre:         producto.nombre ?? "",
    descripcion:    producto.descripcion ?? "",
    categoriaId:    producto.categoriaId != null ? String(producto.categoriaId) : "",
    subcategoriaId: producto.subcategoriaId != null ? String(producto.subcategoriaId) : "",
    tipoProductoId: producto.tipoProductoId != null ? String(producto.tipoProductoId) : "",
    atributos:      producto.atributos ?? {},
    // Nombres de taxonomía (solo para resolver IDs al editar productos legacy)
    categoria:      producto.categoria ?? "",
    subcategoria:   producto.subcategoria ?? "",
    tipo:           producto.tipo ?? "",
});

/** Resuelve IDs desde el schema cuando la respuesta solo trae nombres (compatibilidad). */
export const resolveFormFromProduct = (producto, schema = []) => {
    const base = productoToForm(producto);
    if (base.tipoProductoId || !schema.length) return base;

    for (const cat of schema) {
        if (cat.nombre !== producto.categoria) continue;
        base.categoriaId = String(cat.id);
        for (const sub of cat.subcategorias ?? []) {
            if (sub.nombre !== producto.subcategoria) continue;
            base.subcategoriaId = String(sub.id);
            for (const tipo of sub.tipos ?? []) {
                if (tipo.nombre === producto.tipo) {
                    base.tipoProductoId = String(tipo.id);
                }
            }
        }
    }
    return base;
};

/** Payload JSON que espera el backend */
export const buildProductoPayload = (form, { archivosNuevos = [], archivosEliminarIds = [] } = {}) => {
    const payload = {
        nombre:         form.nombre.trim(),
        descripcion:    form.descripcion.trim(),
        tipoProductoId: Number(form.tipoProductoId),
        atributos:      form.atributos,
    };
    if (archivosNuevos.length) {
        payload.archivosMeta = archivosNuevos.map((a, i) => ({
            rol:   a.rol,
            orden: a.orden ?? i + 1,
        }));
    }
    if (archivosEliminarIds.length) {
        payload.archivosEliminarIds = archivosEliminarIds;
    }
    return payload;
};

export const findCategoria = (schema, categoriaId) =>
    schema.find((c) => String(c.id) === String(categoriaId));

export const findSubcategoria = (schema, categoriaId, subcategoriaId) => {
    const cat = findCategoria(schema, categoriaId);
    return cat?.subcategorias?.find((s) => String(s.id) === String(subcategoriaId));
};

export const findTipo = (schema, categoriaId, subcategoriaId, tipoProductoId) => {
    const sub = findSubcategoria(schema, categoriaId, subcategoriaId);
    return sub?.tipos?.find((t) => String(t.id) === String(tipoProductoId));
};

/** Atributos del tipo seleccionado, ordenados */
export const getAtributosDelTipo = (schema, categoriaId, subcategoriaId, tipoProductoId) => {
    const tipo = findTipo(schema, categoriaId, subcategoriaId, tipoProductoId);
    if (!tipo?.atributos) return [];
    return [...tipo.atributos].sort(
        (a, b) => (a.orden ?? 0) - (b.orden ?? 0),
    );
};

/** Localiza el tipo de producto en el schema a partir de un producto guardado. */
export const findTipoByProducto = (schema, producto) => {
    if (!schema?.length || !producto) return null;

    if (producto.tipoProductoId != null) {
        if (producto.categoriaId != null && producto.subcategoriaId != null) {
            const tipo = findTipo(
                schema,
                producto.categoriaId,
                producto.subcategoriaId,
                producto.tipoProductoId,
            );
            if (tipo) return tipo;
        }
        for (const cat of schema) {
            for (const sub of cat.subcategorias ?? []) {
                const tipo = sub.tipos?.find(
                    (t) => String(t.id) === String(producto.tipoProductoId),
                );
                if (tipo) return tipo;
            }
        }
    }

    if (!producto.tipo) return null;

    for (const cat of schema) {
        if (producto.categoria && cat.nombre !== producto.categoria) continue;
        for (const sub of cat.subcategorias ?? []) {
            if (producto.subcategoria && sub.nombre !== producto.subcategoria) continue;
            const tipo = sub.tipos?.find((t) => t.nombre === producto.tipo);
            if (tipo) return tipo;
        }
    }
    return null;
};

/** Mapa nombreAtributo → etiqueta definida por el superadmin. */
export const buildEtiquetasAtributosMap = (schema, producto) => {
    const tipo = findTipoByProducto(schema, producto);
    if (!tipo?.atributos?.length) return {};
    return Object.fromEntries(
        tipo.atributos.map((a) => [a.nombreAtributo, a.etiqueta]),
    );
};

export const INPUT_BASE =
    "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 " +
    "bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 " +
    "placeholder-gray-300 dark:placeholder-gray-600 " +
    "focus:outline-none focus:ring-2 focus:ring-[#EFB357]/50 focus:border-[#EFB357] " +
    "transition disabled:opacity-40 disabled:cursor-not-allowed";
