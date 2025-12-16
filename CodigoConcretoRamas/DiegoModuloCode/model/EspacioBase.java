package com.parking.system.model;

public interface EspacioBase {
    int getId();
    int getNumero();
    TipoEspacio getTipo();
    EstadoEspacio getEstado();
    int getSedeId();

    void setEstado(EstadoEspacio estado);
}
