package com.parking.system.model;

import java.time.LocalTime;

public class Tarifa {
    private Long id;
    private String tipoVehiculo;
    private double precioUnitario;
    private LocalTime horaInicioValidez;
    private LocalTime horaFinValidez;

    public Tarifa() {
    }

    public Tarifa(Long id, String tipoVehiculo, double precioUnitario, LocalTime horaInicioValidez,
            LocalTime horaFinValidez) {
        this.id = id;
        this.tipoVehiculo = tipoVehiculo;
        this.precioUnitario = precioUnitario;
        this.horaInicioValidez = horaInicioValidez;
        this.horaFinValidez = horaFinValidez;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipoVehiculo() {
        return tipoVehiculo;
    }

    public void setTipoVehiculo(String tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }

    public double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public LocalTime getHoraInicioValidez() {
        return horaInicioValidez;
    }

    public void setHoraInicioValidez(LocalTime horaInicioValidez) {
        this.horaInicioValidez = horaInicioValidez;
    }

    public LocalTime getHoraFinValidez() {
        return horaFinValidez;
    }

    public void setHoraFinValidez(LocalTime horaFinValidez) {
        this.horaFinValidez = horaFinValidez;
    }
}
