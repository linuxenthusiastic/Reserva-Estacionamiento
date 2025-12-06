package com.reservas.estacionamiento.observer;

import com.reservas.estacionamiento.model.Espacio;

public interface EspacioObserver {
    public void onEstadoCambio(Espacio espacio);
}
