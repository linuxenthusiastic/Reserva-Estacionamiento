package com.parking.system.dto;

public class LoginResponse {
    private Long id;
    private String nombre;
    private String email;
    private String rol;
    private String mensaje;

    public LoginResponse(Long id, String nombre, String email, String rol, String mensaje) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.mensaje = mensaje;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
}
