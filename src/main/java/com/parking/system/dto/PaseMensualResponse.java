package com.parking.system.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaseMensualResponse {
    
    private Long id;
    private Long usuarioId;
    private String tipo;
    private Long espacioAsignado;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaVencimiento;
    private BigDecimal precio;
    private String estado;
    private boolean vigente;
    private LocalDateTime fechaCreacion;
    
    public PaseMensualResponse() {}
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUsuarioId() {
        return usuarioId;
    }
    
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
    
    public String getTipo() {
        return tipo;
    }
    
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    
    public Long getEspacioAsignado() {
        return espacioAsignado;
    }
    
    public void setEspacioAsignado(Long espacioAsignado) {
        this.espacioAsignado = espacioAsignado;
    }
    
    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }
    
    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    
    public LocalDateTime getFechaVencimiento() {
        return fechaVencimiento;
    }
    
    public void setFechaVencimiento(LocalDateTime fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
    
    public BigDecimal getPrecio() {
        return precio;
    }
    
    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }
    
    public String getEstado() {
        return estado;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
    
    public boolean isVigente() {
        return vigente;
    }
    
    public void setVigente(boolean vigente) {
        this.vigente = vigente;
    }
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
