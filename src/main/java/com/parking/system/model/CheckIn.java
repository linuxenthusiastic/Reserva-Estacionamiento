package com.parking.system.model;

import java.time.LocalDateTime;

public class CheckIn {
    
    private Long id;
    private Long reservaId;
    private LocalDateTime horaEntrada;
    private String dispositivoId;
    
    public CheckIn() {
        this.horaEntrada = LocalDateTime.now();
    }
    
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
}