package com.reservas.estacionamiento.model;

public class Espacio {
    private int id;
    private int numero;
    private TipoEspacio tipo;
    private EstadoEspacio estado;
    private int sedeId;

    public Espacio(int id, int numero, TipoEspacio tipo, EstadoEspacio estado, int sedeId) {
        this.id = id;
        this.numero = numero;
        this.tipo = tipo;
        this.estado = estado;
        this.sedeId = sedeId;
    }
    public int getId() { return id; }
    public int getNumero() { return numero; }
    public TipoEspacio getTipo() { return tipo; }
    public EstadoEspacio getEstado() { return estado; }
    public int getSedeId() { return sedeId; }

    public void setNumero(int numero) { this.numero = numero; }
    public void setTipo(TipoEspacio tipo) { this.tipo = tipo; }
    public void setEstado(EstadoEspacio estado) { this.estado = estado; }
    public void setSedeId(int sedeId) { this.sedeId = sedeId; }
}
