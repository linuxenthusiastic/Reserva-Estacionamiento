package com.parking.system.repository.impl;

import com.parking.system.model.Tarifa;
import com.parking.system.repository.TarifaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class InMemoryTarifaRepository implements TarifaRepository {

    private final List<Tarifa> baseDeDatos = new ArrayList<>();
    private Long nextId = 1L;

    @Override
    public Tarifa guardar(Tarifa tarifa) {
        if (tarifa.getId() == null) {
            tarifa.setId(nextId++);
        }
        baseDeDatos.add(tarifa);
        return tarifa;
    }

    @Override
    public List<Tarifa> listarTodas() {
        return new ArrayList<>(baseDeDatos);
    }

    @Override
    public Optional<Tarifa> buscarPorTipoYHorario(String tipo, LocalTime hora) {
        return baseDeDatos.stream()
                .filter(t -> t.getTipoVehiculo().equalsIgnoreCase(tipo))
                .findFirst();
        // Simplificación: En un caso real verificariamos Rangos de hora
        // .filter(t -> !hora.isBefore(t.getHoraInicioValidez()) &&
        // !hora.isAfter(t.getHoraFinValidez()))
    }
}
