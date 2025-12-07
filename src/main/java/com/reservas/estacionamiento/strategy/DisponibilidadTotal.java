package com.reservas.estacionamiento.strategy;

import com.reservas.estacionamiento.model.Espacio;

import java.util.List;

public class DisponibilidadTotal implements DisponibilidadStrategy {
    @Override
    public List<Espacio> filtrar(List<Espacio> espacios) {
        return espacios;
    }
}
