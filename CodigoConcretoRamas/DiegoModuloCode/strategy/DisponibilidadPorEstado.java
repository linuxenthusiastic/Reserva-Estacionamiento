package com.reservas.estacionamiento.strategy;

import com.reservas.estacionamiento.model.Espacio;
import com.reservas.estacionamiento.model.EstadoEspacio;

import java.util.List;
import java.util.stream.Collectors;

public class DisponibilidadPorEstado implements DisponibilidadStrategy {
    @Override
    public List<Espacio> filtrar(List<Espacio> espacios) {
        return espacios.stream()
                .filter(e -> e.getEstado() == EstadoEspacio.DISPONIBLE)
                .collect(Collectors.toList());
    }
}
