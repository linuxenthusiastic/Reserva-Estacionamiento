package com.parking.system.model;

import java.time.LocalDateTime;

public class Factura {
    private Long id;
    private String nitCliente;
    private double montoTotal;
    private LocalDateTime fechaEmision;

    public Factura() {
    }

    public Factura(Long id, String nitCliente, double montoTotal, LocalDateTime fechaEmision) {
        this.id = id;
        this.nitCliente = nitCliente;
        this.montoTotal = montoTotal;
        this.fechaEmision = fechaEmision;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNitCliente() {
        return nitCliente;
    }

    public void setNitCliente(String nitCliente) {
        this.nitCliente = nitCliente;
    }

    public double getMontoTotal() {
        return montoTotal;
    }

    public void setMontoTotal(double montoTotal) {
        this.montoTotal = montoTotal;
    }

    public LocalDateTime getFechaEmision() {
        return fechaEmision;
    }

    public void setFechaEmision(LocalDateTime fechaEmision) {
        this.fechaEmision = fechaEmision;
    }
}
