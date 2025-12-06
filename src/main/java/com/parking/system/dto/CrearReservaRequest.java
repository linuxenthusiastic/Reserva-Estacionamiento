package com.parking.system.dto;

import java.time.LocalDateTime;

public class CrearReservaRequest {
    
    private Long usuarioId;
    private Long espacioId;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    
    public CrearReservaRequest() {}
    
    public Long getUsuarioId() {
        return usuarioId;
    }
    
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
    
    public Long getEspacioId() {
        return espacioId;
    }
    
    public void setEspacioId(Long espacioId) {
        this.espacioId = espacioId;
    }
    
    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }
    
    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    
    public LocalDateTime getFechaFin() {
        return fechaFin;
    }
    
    public void setFechaFin(LocalDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }
}