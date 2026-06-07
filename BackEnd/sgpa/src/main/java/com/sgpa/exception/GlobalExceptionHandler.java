package com.sgpa.exception;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String MENSAJE_ARCHIVO_DEMASIADO_GRANDE =
        "El archivo adjunto supera el tamaño máximo permitido de 10 MB.";

    // ==================== 404 Not Found Exceptions ====================

    @ExceptionHandler(ArchivoNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleArchivoNotFound(ArchivoNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", "El archivo adjunto no está disponible en el servidor."));
    }

    @ExceptionHandler(ProductoDocenteNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleProductoDocenteNotFound(ProductoDocenteNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(DocenteNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleDocenteNotFound(DocenteNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(ProgramaNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleProgramaNotFound(ProgramaNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(FacultadNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleFacultadNotFound(FacultadNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(InstitucionNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleInstitucionNotFound(InstitucionNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(PersonaNotFoundException.class)
    public ResponseEntity<Map<String, String>> handlePersonaNotFound(PersonaNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", ex.getMessage()));
    }

    // ==================== 400 Bad Request Exceptions ====================

    @ExceptionHandler(TipoProductoInvalidoException.class)
    public ResponseEntity<Map<String, String>> handleTipoInvalido(TipoProductoInvalidoException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(ProductoNoEditableException.class)
    public ResponseEntity<Map<String, String>> handleProductoNoEditable(ProductoNoEditableException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(ProductoNoEliminableException.class)
    public ResponseEntity<Map<String, String>> handleProductoNoEliminable(ProductoNoEliminableException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(AccesoDenegadoException.class)
    public ResponseEntity<Map<String, String>> handleAccesoDenegado(AccesoDenegadoException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(UsuarioNoPendienteException.class)
    public ResponseEntity<Map<String, String>> handleUsuarioNoPendiente(UsuarioNoPendienteException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(TaxonomiaEnUsoException.class)
    public ResponseEntity<Map<String, String>> handleTaxonomiaEnUso(TaxonomiaEnUsoException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of("error", ex.getMessage()));
    }

    // ==================== Upload / multipart ====================

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> handleMaxUploadSize(MaxUploadSizeExceededException ex) {
        return ResponseEntity.status(HttpStatus.CONTENT_TOO_LARGE)
            .body(Map.of("error", MENSAJE_ARCHIVO_DEMASIADO_GRANDE));
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<Map<String, String>> handleMultipart(MultipartException ex) {
        if (esErrorTamanoArchivo(ex)) {
            return ResponseEntity.status(HttpStatus.CONTENT_TOO_LARGE)
                .body(Map.of("error", MENSAJE_ARCHIVO_DEMASIADO_GRANDE));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of("error", "No se pudo procesar el archivo adjunto."));
    }

    private boolean esErrorTamanoArchivo(Throwable ex) {
        Throwable actual = ex;
        while (actual != null) {
            if (actual instanceof MaxUploadSizeExceededException) return true;
            String nombre = actual.getClass().getSimpleName();
            if (nombre.contains("SizeLimitExceeded")) return true;
            actual = actual.getCause();
        }
        return false;
    }

    // ==================== Validation Exceptions ====================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<String>>> handleValidation(MethodArgumentNotValidException ex) {
        List<String> errores = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .toList();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of("errores", errores));
    }

    // ==================== Generic Exception ====================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "Error interno del servidor: " + ex.getMessage()));
    }
}
