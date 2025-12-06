package com.parking.system.dto;

public class TicketResponse {
    private double montoTotal;
    private String detalle;

    public TicketResponse(double montoTotal, String detalle) {
        this.montoTotal = montoTotal;
        this.detalle = detalle;
    }

    public double getMontoTotal() {
        return montoTotal;
    }

    public String getDetalle() {
        return detalle;
    }
}
