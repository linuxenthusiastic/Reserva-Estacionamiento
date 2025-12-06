package com.reservas.estacionamiento.strategy;

import com.reservas.estacionamiento.model.Espacio;
import com.reservas.estacionamiento.model.TipoEspacio;

import java.util.List;
import java.util.stream.Collectors;

public class DisponibilidadPorTipo implements DisponibilidadStrategy {
    private final TipoEspacio tipo;

    public DisponibilidadPorTipo(TipoEspacio tipo) {
        this.tipo = tipo;
    }

    @Override
    public List<Espacio> filtrar(List<Espacio> espacios) {
        return espacios.stream()
                .filter(e -> e.getTipo() == tipo)
                .collect(Collectors.toList());
    }
}
