package com.parking.system.factory;

import com.parking.system.model.*;

public class DiscapacitadoEspacioFactory implements EspacioFactory {
    @Override
    public Espacio crearEspacio(int id, int numero, int sedeId) {
        return new Espacio(id, numero, TipoEspacio.DISCAPACITADO, EstadoEspacio.DISPONIBLE, sedeId);
    }
}
