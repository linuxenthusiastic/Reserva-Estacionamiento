package com.parking.system.factory;

import com.parking.system.model.Espacio;
import com.parking.system.model.TipoEspacio;

public interface EspacioFactory {
    Espacio crearEspacio(int id, int numero, int sedeId);
}
