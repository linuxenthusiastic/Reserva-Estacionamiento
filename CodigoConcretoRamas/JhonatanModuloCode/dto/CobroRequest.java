package com.parking.system.dto;

public class CobroRequest {
    private String tipoVehiculo;
    private long minutos;
    private boolean conMulta;
    private String nitCliente;

    public String getTipoVehiculo() {
        return tipoVehiculo;
    }

    public void setTipoVehiculo(String tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }

    public long getMinutos() {
        return minutos;
    }

    public void setMinutos(long minutos) {
        this.minutos = minutos;
    }

    public boolean isConMulta() {
        return conMulta;
    }

    public void setConMulta(boolean conMulta) {
        this.conMulta = conMulta;
    }

    public String getNitCliente() {
        return nitCliente;
    }

    public void setNitCliente(String nitCliente) {
        this.nitCliente = nitCliente;
    }
}
