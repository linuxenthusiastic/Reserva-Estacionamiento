package com.parking.system.dto;

public class CrearPaseMensualRequest {
    
    private Long usuarioId;
    private String tipo;
    private Long espacioAsignado;
    
    public CrearPaseMensualRequest() {}
    
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
}
