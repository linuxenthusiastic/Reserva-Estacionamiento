package com.parking.system.service;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.Random;

@Component
public class QRCodeGenerator {

    private static final String CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int LONGITUD_CODIGO = 8;
    private final Random random = new Random();

    /**
     * Genera un código QR simple y aleatorio (ej: A1B2C3D4)
     */
    public String generarCodigo(Long reservaId, LocalDateTime fechaReserva) {
        StringBuilder codigo = new StringBuilder();

        for (int i = 0; i < LONGITUD_CODIGO; i++) {
            int index = random.nextInt(CARACTERES.length());
            codigo.append(CARACTERES.charAt(index));
        }

        return codigo.toString();
    }

    /**
     * Valida que el código tenga el formato correcto
     */
    public boolean esCodigoValido(String codigo) {
        if (codigo == null || codigo.isEmpty()) {
            return false;
        }

        // Acepta códigos de 8 caracteres alfanuméricos
        if (codigo.matches("^[A-Z0-9]{" + LONGITUD_CODIGO + "}$")) {
            return true;
        }

        // También acepta el formato antiguo por compatibilidad
        return codigo.startsWith("PARKING-") && codigo.split("-").length >= 3;
    }

    /**
     * Extrae el ID de la reserva del código QR antiguo
     * Para códigos nuevos, retorna null
     */
    public Long extraerReservaId(String codigoQR) {
        if (codigoQR == null || codigoQR.isEmpty()) {
            return null;
        }

        // Si es formato antiguo PARKING-X-..., extraer X
        if (codigoQR.startsWith("PARKING-")) {
            try {
                String[] partes = codigoQR.split("-");
                return Long.parseLong(partes[1]);
            } catch (Exception e) {
                return null;
            }
        }

        // Para códigos nuevos aleatorios, no se puede extraer el ID
        return null;
    }
}
