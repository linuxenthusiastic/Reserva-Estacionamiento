package com.parking.system.dto;

public class TicketResponse {
    private double montoTotal;
    private String moneda;
    private long minutosCobrados;
    private String detalle;
    private boolean tieneMulta;

    
    //Getters
    public String getDetalle() {
        return detalle;
    }

    public boolean isTieneMulta() {
        return tieneMulta;
    }

    public long getMinutosCobrados() {
        return minutosCobrados;
    }

    public String getMoneda() {
        return moneda;
    }

    public double getMontoTotal() {
        return montoTotal;
    }



    //Setters
    public void setMontoTotal(double montoTotal) {
        this.montoTotal = montoTotal;
    }

    public void setMoneda(String moneda) {
        this.moneda = moneda;
    }

    public void setMinutosCobrados(long minutosCobrados) {
        this.minutosCobrados = minutosCobrados;
    }

    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }

    public void setTieneMulta(boolean tieneMulta) {
        this.tieneMulta = tieneMulta;
    }
}
