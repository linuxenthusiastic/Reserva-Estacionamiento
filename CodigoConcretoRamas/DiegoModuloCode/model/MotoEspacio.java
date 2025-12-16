package com.parking.system.model;

public class MotoEspacio implements EspacioBase {
    private int id;
    private int numero;
    private int sedeId;
    private EstadoEspacio estado = EstadoEspacio.DISPONIBLE;
    private  TipoEspacio tipo = TipoEspacio.MOTO;

    public MotoEspacio(int id, int numero, int sedeId) {
        this.id = id;
        this.numero = numero;
        this.sedeId = sedeId;
    }

    @Override
    public int getId() { return id; }

    @Override
    public int getNumero() { return numero; }

    @Override
    public TipoEspacio getTipo() { return TipoEspacio.MOTO; }

    @Override
    public EstadoEspacio getEstado() { return estado; }

    @Override
    public int getSedeId() { return sedeId; }

    @Override
    public void setEstado(EstadoEspacio estado) { this.estado = estado; }
}
