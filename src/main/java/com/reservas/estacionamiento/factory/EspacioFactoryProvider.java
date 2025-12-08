package com.reservas.estacionamiento.factory;

import com.reservas.estacionamiento.model.TipoEspacio;

public class EspacioFactoryProvider {
    public static EspacioFactory getFactory(TipoEspacio tipo) {
        return switch (tipo) {
            case AUTO -> new AutoEspacioFactory();
            case MOTO -> new MotoEspacioFactory();
            case DISCAPACITADO -> new DiscapacitadoEspacioFactory();
            case VIP -> new VIPEspacioFactory();
        };
    }
}
