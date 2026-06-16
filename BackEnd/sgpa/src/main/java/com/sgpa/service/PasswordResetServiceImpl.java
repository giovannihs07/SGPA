package com.sgpa.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.exception.PasswordResetRateLimitException;
import com.sgpa.exception.PasswordResetTokenException;
import com.sgpa.model.auth.PasswordResetToken;
import com.sgpa.model.audit.ModuloAuditoria;
import com.sgpa.model.audit.ResultadoAuditoria;
import com.sgpa.model.users.EstadoUsuario;
import com.sgpa.model.users.User;
import com.sgpa.repository.PasswordResetTokenRepository;
import com.sgpa.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private static final int CODE_LENGTH = 6;
    private static final String MENSAJE_LIMITE_SOLICITUDES =
            "Has agotado los intentos para solicitar un código de restablecimiento. "
                    + "Podrás volver a intentarlo en una hora.";

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AuditService auditService;

    @Value("${app.password-reset.expiration-minutes:30}")
    private int expirationMinutes;

    @Value("${app.password-reset.dev-log-code:true}")
    private boolean devLogCode;

    /** 0 = sin límite (desarrollo). En producción: app.password-reset.max-requests-per-hour=3 */
    @Value("${app.password-reset.max-requests-per-hour:0}")
    private int maxRequestsPerHour;

    @Override
    @Transactional
    public void solicitarReset(String email, String ipAddress) {
        String normalizedEmail = email.trim();
        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);

        if (userOpt.isEmpty()) {
            log.info("Reset omitido: correo no registrado ({})", normalizedEmail);
            auditService.registrar(ModuloAuditoria.AUTH, "SOLICITUD_RESET",
                    "Solicitud de restablecimiento para correo no registrado",
                    "User", null, normalizedEmail, null,
                    ResultadoAuditoria.FALLIDO, normalizedEmail, ipAddress);
            return;
        }

        User user = userOpt.get();

        if (user.getEstado() != EstadoUsuario.ACTIVO) {
            log.info("Reset omitido: cuenta no activa ({}, estado={})", normalizedEmail, user.getEstado());
            auditService.registrar(ModuloAuditoria.AUTH, "SOLICITUD_RESET",
                    "Solicitud de restablecimiento para cuenta no activa",
                    "User", user.getId(), normalizedEmail,
                    Map.of("estado", user.getEstado().name()),
                    ResultadoAuditoria.FALLIDO, normalizedEmail, ipAddress);
            return;
        }

        if (maxRequestsPerHour > 0) {
            LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
            long recentRequests = tokenRepository.countRecentByUserEmail(normalizedEmail, oneHourAgo);
            if (recentRequests >= maxRequestsPerHour) {
                log.warn("Límite de solicitudes de reset alcanzado para {} ({} en la última hora)",
                        normalizedEmail, recentRequests);
                auditService.registrar(ModuloAuditoria.AUTH, "SOLICITUD_RESET",
                        "Límite de solicitudes de restablecimiento excedido",
                        "User", user.getId(), normalizedEmail, null,
                        ResultadoAuditoria.FALLIDO, normalizedEmail, ipAddress);
                throw new PasswordResetRateLimitException(MENSAJE_LIMITE_SOLICITUDES);
            }
        }

        String codigo = generarCodigo();
        String codigoHash = hashValor(codigo);
        LocalDateTime now = LocalDateTime.now();

        tokenRepository.invalidateActiveTokensForUser(user, now);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setTokenHash(codigoHash);
        resetToken.setExpiresAt(now.plusMinutes(expirationMinutes));
        tokenRepository.save(resetToken);
        log.info("Código de reset generado para {}", normalizedEmail);

        if (!emailService.isConfigured()) {
            logResetCode(normalizedEmail, codigo, "SMTP no configurado", true);
            auditService.registrar(ModuloAuditoria.AUTH, "SOLICITUD_RESET",
                    "Código de restablecimiento generado (SMTP no configurado)",
                    "User", user.getId(), normalizedEmail, null,
                    ResultadoAuditoria.EXITOSO, normalizedEmail, ipAddress);
            return;
        }

        try {
            emailService.enviarCorreoResetCodigo(normalizedEmail, codigo, expirationMinutes);
            auditService.registrar(ModuloAuditoria.AUTH, "SOLICITUD_RESET",
                    "Correo con código de restablecimiento enviado",
                    "User", user.getId(), normalizedEmail, null,
                    ResultadoAuditoria.EXITOSO, normalizedEmail, ipAddress);
        } catch (RuntimeException ex) {
            logResetCode(normalizedEmail, codigo, ex.getMessage(), true);
            auditService.registrar(ModuloAuditoria.AUTH, "SOLICITUD_RESET",
                    "Error al enviar correo de restablecimiento",
                    "User", user.getId(), normalizedEmail,
                    Map.of("motivo", ex.getMessage() != null ? ex.getMessage() : "Error SMTP"),
                    ResultadoAuditoria.FALLIDO, normalizedEmail, ipAddress);
            log.error("Fallo SMTP al enviar reset para {}", normalizedEmail, ex);
        }
    }

    @Override
    @Transactional
    public void restablecerPassword(String email, String codigo, String passwordNuevo,
            String passwordConfirmacion, String ipAddress) {

        if (!passwordNuevo.equals(passwordConfirmacion)) {
            throw new IllegalArgumentException("Las contraseñas no coinciden");
        }

        PasswordResetToken resetToken = buscarCodigoValido(email, codigo);
        User user = resetToken.getUser();
        String userEmail = user.getEmail();

        user.setPassword(passwordEncoder.encode(passwordNuevo));
        userRepository.save(user);

        LocalDateTime now = LocalDateTime.now();
        resetToken.setUsedAt(now);
        tokenRepository.save(resetToken);
        tokenRepository.invalidateActiveTokensForUser(user, now);

        auditService.registrar(ModuloAuditoria.AUTH, "RESET_PASSWORD",
                "Contraseña restablecida mediante código de recuperación",
                "User", user.getId(), userEmail, null,
                ResultadoAuditoria.EXITOSO, userEmail, ipAddress);
    }

    private PasswordResetToken buscarCodigoValido(String email, String codigo) {
        if (email == null || email.isBlank()) {
            throw new PasswordResetTokenException("El correo electrónico es obligatorio");
        }
        if (codigo == null || !codigo.matches("\\d{6}")) {
            throw new PasswordResetTokenException("El código no es válido");
        }

        String normalizedEmail = email.trim();
        String codigoHash = hashValor(codigo.trim());
        PasswordResetToken resetToken = tokenRepository
                .findByTokenHashAndUser_EmailAndUsedAtIsNull(codigoHash, normalizedEmail)
                .orElseThrow(() -> new PasswordResetTokenException(
                        "El código no es válido o ya fue utilizado"));

        if (resetToken.isExpired()) {
            throw new PasswordResetTokenException(
                    "El código ha expirado. Solicita uno nuevo.");
        }

        if (resetToken.getUser().getEstado() != EstadoUsuario.ACTIVO) {
            throw new PasswordResetTokenException(
                    "La cuenta asociada a este código no está activa.");
        }

        return resetToken;
    }

    private String generarCodigo() {
        int max = (int) Math.pow(10, CODE_LENGTH);
        int min = max / 10;
        int code = new SecureRandom().nextInt(max - min) + min;
        return String.format("%0" + CODE_LENGTH + "d", code);
    }

    private String hashValor(String valor) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(valor.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Algoritmo SHA-256 no disponible", ex);
        }
    }

    private void logResetCode(String email, String codigo, String motivo, boolean force) {
        if (!force && !devLogCode) return;
        log.warn("""
                [DEV] Restablecimiento de contraseña ({})
                Usuario: {}
                Código: {}
                """, motivo, email, codigo);
    }

    private void logResetCode(String email, String codigo, String motivo) {
        logResetCode(email, codigo, motivo, false);
    }
}
