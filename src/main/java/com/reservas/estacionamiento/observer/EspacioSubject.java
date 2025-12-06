package com.reservas.estacionamiento.observer;

import com.reservas.estacionamiento.model.Espacio;

import java.util.ArrayList;
import java.util.List;

public class EspacioSubject {
    private List<EspacioObserver> observadores = new ArrayList<>();

    public void agregarObservador(EspacioObserver observador) {
        observadores.add(observador);
    }

    public void notificarObservadores(Espacio espacio) {
        for (EspacioObserver observador : observadores) {
            observador.onEstadoCambio(espacio);
        }
    }
}
