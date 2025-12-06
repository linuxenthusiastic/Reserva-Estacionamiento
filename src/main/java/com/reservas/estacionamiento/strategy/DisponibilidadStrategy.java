package com.reservas.estacionamiento.strategy;

import com.reservas.estacionamiento.model.Espacio;

import java.util.List;

public interface DisponibilidadStrategy {
    List<Espacio> filtrar(List<Espacio> espacios);
}
