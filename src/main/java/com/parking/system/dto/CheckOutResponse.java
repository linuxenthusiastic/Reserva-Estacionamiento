package com.parking.system.dto;

import java.time.LocalDateTime;

public class CheckOutResponse {

    private Long id;
    private Long reservaId;
    private LocalDateTime horaSalida;
    private Long tiempoTotalMinutos;
    private Long minutosReservados;
    private Long minutosExcedidos;
    private String tipoVehiculo;
    private Double montoCobrado;
    private Long facturaId;
    private boolean exentoMembresia;
    private String mensaje;

    public CheckOutResponse() {
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

    public Double getMontoCobrado() {
        return montoCobrado;
    }

    public void setMontoCobrado(Double montoCobrado) {
        this.montoCobrado = montoCobrado;
    }

    public Long getFacturaId() {
        return facturaId;
    }

    public void setFacturaId(Long facturaId) {
        this.facturaId = facturaId;
    }

    public boolean isExentoMembresia() {
        return exentoMembresia;
    }

    public void setExentoMembresia(boolean exentoMembresia) {
        this.exentoMembresia = exentoMembresia;
    }

    public Long getMinutosReservados() {
        return minutosReservados;
    }

    public void setMinutosReservados(Long minutosReservados) {
        this.minutosReservados = minutosReservados;
    }

    public Long getMinutosExcedidos() {
        return minutosExcedidos;
    }

    public void setMinutosExcedidos(Long minutosExcedidos) {
        this.minutosExcedidos = minutosExcedidos;
    }

    public String getTipoVehiculo() {
        return tipoVehiculo;
    }

    public void setTipoVehiculo(String tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
