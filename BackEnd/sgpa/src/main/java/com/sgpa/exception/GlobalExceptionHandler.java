package com.sgpa.exception;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ==================== 404 Not Found Exceptions ====================

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
