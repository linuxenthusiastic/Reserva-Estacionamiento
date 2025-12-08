package com.parking.system.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaseMensual {
    
    private Long id;
    private Long usuarioId;
    private String tipo;
    private Long espacioAsignado;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaVencimiento;
    private BigDecimal precio;
    private String estado;
    private LocalDateTime fechaCreacion;
    
    public PaseMensual() {
        this.fechaCreacion = LocalDateTime.now();
        this.estado = "ACTIVO";
    }
    
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
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    
    public boolean estaVigente() {
        LocalDateTime ahora = LocalDateTime.now();
        return "ACTIVO".equals(estado) && 
               ahora.isAfter(fechaInicio) && 
               ahora.isBefore(fechaVencimiento);
    }
}