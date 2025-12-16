package com.parking.system.strategy;

/*
import com.parking.system.model.Reserva;
*/

import com.parking.system.model.Espacio;
import com.parking.system.service.EspacioService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/*
public class DisponibilidadPorHorario implements DisponibilidadStrategy {

    private final LocalDateTime inicio;
    private final LocalDateTime fin;
    private final ReservaService reservaService;

    public DisponibilidadPorHorario(LocalDateTime inicio, LocalDateTime fin, ReservaService reservaService) {
        this.inicio = inicio;
        this.fin = fin;
        this.reservaService = reservaService;
    }

    @Override
    public List<Espacio> filtrar(List<Espacio> espacios) {
        return espacios.stream()
                .filter(espacio -> this.estaDisponible(espacio))
                .collect(Collectors.toList());
    }

    private boolean estaDisponible(Espacio espacio) {
        List<Reserva> reservas = obtenerReservasDeEspacio(espacio.getId());

        for (Reserva r : reservas) {
            boolean solapa = r.getFechaInicio().isBefore(fin) && r.getFechaFin().isAfter(inicio);
            if (solapa) return false;
        }
        return true;
    }

    private List<Reserva> obtenerReservasDeEspacio(int espacioId) {
        return reservaService.obtenerTodas().stream()
                .filter(r -> r.getEspacioId() == espacioId)
                .toList();
    }

}
*/
