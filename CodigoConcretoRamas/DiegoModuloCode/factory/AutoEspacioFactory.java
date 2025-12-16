package com.reservas.estacionamiento.factory;

import com.reservas.estacionamiento.model.*;

public class AutoEspacioFactory implements EspacioFactory {
    @Override
    public Espacio crearEspacio(int id, int numero, int sedeId) {
        return new Espacio(id,numero, TipoEspacio.AUTO, EstadoEspacio.DISPONIBLE, sedeId);
    }
}
