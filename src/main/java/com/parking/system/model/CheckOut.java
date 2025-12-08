package com.parking.system.model;

import java.time.LocalDateTime;

public class CheckOut {
    
    private Long id;
    private Long reservaId;
    private LocalDateTime horaSalida;
    private Long tiempoTotalMinutos;
    
    public CheckOut() {
        this.horaSalida = LocalDateTime.now();
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
    
    public LocalDateTime getHoraSalida() {
        return horaSalida;
    }
    
    public void setHoraSalida(LocalDateTime horaSalida) {
        this.horaSalida = horaSalida;
    }
    
    public Long getTiempoTotalMinutos() {
        return tiempoTotalMinutos;
    }
    
    public void setTiempoTotalMinutos(Long tiempoTotalMinutos) {
        this.tiempoTotalMinutos = tiempoTotalMinutos;
    }
}