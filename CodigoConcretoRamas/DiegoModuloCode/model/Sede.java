package com.parking.system.model;

public class Sede {
    private int id;
    private String nombre;
    private String direccion;
    private String ciudad;

    public Sede(int id, String nombre, String direccion, String ciudad) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.ciudad = ciudad;
    }

    public int getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDireccion() { return direccion; }
    public String getCiudad() { return ciudad; }

    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }
}
