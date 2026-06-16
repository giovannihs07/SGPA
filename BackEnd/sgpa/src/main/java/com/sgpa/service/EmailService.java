package com.sgpa.service;

public interface EmailService {

    boolean isConfigured();

    void enviarCorreoResetCodigo(String destinatario, String codigo, int minutosValidez);
}
