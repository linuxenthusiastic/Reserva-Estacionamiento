package com.parking.system.service;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class QRCodeGenerator {
    
    public String generarCodigo(Long reservaId, LocalDateTime fechaReserva) {
        String timestamp = fechaReserva.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String hash = generarHash(reservaId, timestamp);
        
        return String.format("PARKING-%d-%s-%s", reservaId, timestamp, hash);
    }
    
    public boolean esCodigoValido(String codigo) {
        if (codigo == null || !codigo.startsWith("PARKING-")) {
            return false;
        }
        
        String[] partes = codigo.split("-");
        if (partes.length != 4) {
            return false;
        }
        
        try {
            Long reservaId = Long.parseLong(partes[1]);
            String timestamp = partes[2];
            String hashRecibido = partes[3];
            
            String hashEsperado = generarHash(reservaId, timestamp);
            
            return hashRecibido.equals(hashEsperado);
            
        } catch (Exception e) {
            return false;
        }
    }
    
    public Long extraerReservaId(String codigo) {
        if (!esCodigoValido(codigo)) {
            throw new IllegalArgumentException("Código QR inválido");
        }
        
        String[] partes = codigo.split("-");
        return Long.parseLong(partes[1]);
    }
    
    private String generarHash(Long reservaId, String timestamp) {
        String data = reservaId + timestamp + "SECRET_KEY_PARKING_2024";
        int hash = data.hashCode();
        return Integer.toHexString(Math.abs(hash)).substring(0, 6);
    }
}