package com.parking.system.dto;

import java.time.LocalDateTime;

public class CheckInResponse {
    
    private Long id;
    private Long reservaId;
    private LocalDateTime horaEntrada;
    private String dispositivoId;
    private String mensaje;
    
    public CheckInResponse() {}
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getReservaId() {
        return reservaId;
    }
    
    public void setReservaId(Long reservaId) {
        this.reservaId = reservaId;
    }
    
    public LocalDateTime getHoraEntrada() {
        return horaEntrada;
    }
    
    public void setHoraEntrada(LocalDateTime horaEntrada) {
        this.horaEntrada = horaEntrada;
    }
    
    public String getDispositivoId() {
        return dispositivoId;
    }
    
    public void setDispositivoId(String dispositivoId) {
        this.dispositivoId = dispositivoId;
    }
    
    public String getMensaje() {
        return mensaje;
    }
    
    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}