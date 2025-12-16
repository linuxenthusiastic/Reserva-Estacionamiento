package com.parking.system.strategy;

import com.parking.system.model.Espacio;

import java.util.List;

public class DisponibilidadTotal implements DisponibilidadStrategy {
    @Override
    public List<Espacio> filtrar(List<Espacio> espacios) {
        return espacios;
    }
}
