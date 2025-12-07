package com.parking.system.dto;

public class CheckOutRequest {
    
    private Long reservaId;
    
    public CheckOutRequest() {}
    
    public Long getReservaId() {
        return reservaId;
    }
    
    public void setReservaId(Long reservaId) {
        this.reservaId = reservaId;
    }
}