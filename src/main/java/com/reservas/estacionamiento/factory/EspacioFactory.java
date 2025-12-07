package com.reservas.estacionamiento.factory;

import com.reservas.estacionamiento.model.Espacio;
import com.reservas.estacionamiento.model.TipoEspacio;

public interface EspacioFactory {
    Espacio crearEspacio(int id, int numero, int sedeId);
}
