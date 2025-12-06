package com.reservas.estacionamiento.observer;

import com.reservas.estacionamiento.model.Espacio;

public class LoggerObserver implements EspacioObserver {
    @Override
    public void onEstadoCambio(Espacio espacio) {
        System.out.println(
                "[Observer] El espacio " + espacio.getId() +
                        " cambió su estado a " + espacio.getEstado()
        );
    }
}
