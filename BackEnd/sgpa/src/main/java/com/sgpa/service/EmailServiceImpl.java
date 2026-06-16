package com.sgpa.service;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:SGPA <noreply@unicartagena.edu.co>}")
    private String mailFrom;

    @Value("${app.mail.from-name:SGPA}")
    private String mailFromName;

    @Value("${app.mail.from-address:}")
    private String mailFromAddress;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @PostConstruct
    void logMailConfig() {
        if (isConfigured()) {
            log.info("SMTP configurado. Remitente: {}", mailFrom);
        } else {
            log.warn("SMTP NO configurado: spring.mail.username vacío. Revisa application-local.properties");
        }
    }

    @Override
    public boolean isConfigured() {
        return StringUtils.hasText(mailUsername);
    }

    @Override
    public void enviarCorreoResetCodigo(String destinatario, String codigo, int minutosValidez) {
        if (!isConfigured()) {
            throw new IllegalStateException("SMTP no configurado (spring.mail.username vacío)");
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(resolveFromAddress());
            helper.setTo(destinatario);
            helper.setSubject("Código de restablecimiento — SGPA");
            helper.setText(buildHtmlBody(codigo, minutosValidez), true);

            log.info("Enviando código de reset por SMTP a {}", destinatario);
            mailSender.send(message);
            log.info("Correo con código de restablecimiento enviado a {}", destinatario);
        } catch (MessagingException | MailException ex) {
            log.error("Error SMTP al enviar correo a {}: {}", destinatario, ex.getMessage(), ex);
            throw new IllegalStateException(
                    "No se pudo enviar el correo de restablecimiento. Intenta más tarde.");
        }
    }

    private InternetAddress resolveFromAddress() throws MessagingException {
        try {
            if (StringUtils.hasText(mailFromAddress)) {
                return new InternetAddress(mailFromAddress, mailFromName, StandardCharsets.UTF_8.name());
            }
            return new InternetAddress(mailFrom);
        } catch (java.io.UnsupportedEncodingException ex) {
            throw new MessagingException("Codificación UTF-8 no soportada para el remitente", ex);
        }
    }

    private String buildHtmlBody(String codigo, int minutosValidez) {
        return """
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 560px;">
                  <h2 style="color: #EC7A21;">SGPA — Universidad de Cartagena</h2>
                  <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                  <p>Tu código de verificación es:</p>
                  <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #A43D29;">%s</p>
                  <p>Ingresa este código en SGPA para crear una nueva contraseña.</p>
                  <p style="font-size: 12px; color: #666;">
                    El código expira en %d minutos. Si no solicitaste este cambio, ignora este correo.
                  </p>
                </div>
                """.formatted(codigo, minutosValidez);
    }
}
