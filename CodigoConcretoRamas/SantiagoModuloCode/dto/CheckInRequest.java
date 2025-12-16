package com.parking.system.dto;

public class CheckInRequest {
    
    private Long reservaId;
    private String dispositivoId;
    
    public CheckInRequest() {}
    
    public Long getReservaId() {
        return reservaId;
    }
    
    public void setReservaId(Long reservaId) {
        this.reservaId = reservaId;
    }
    
    public String getDispositivoId() {
        return dispositivoId;
    }
    
    public void setDispositivoId(String dispositivoId) {
        this.dispositivoId = dispositivoId;
    }
}