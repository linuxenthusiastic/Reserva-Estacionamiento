package com.parking.system.strategy;

import com.parking.system.model.Espacio;

import java.util.List;

public interface DisponibilidadStrategy {
    List<Espacio> filtrar(List<Espacio> espacios);
}
