package com.parking.system.repository;

import com.parking.system.model.Tarifa;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface TarifaRepository {
    Tarifa guardar(Tarifa tarifa);

    List<Tarifa> listarTodas();

    Optional<Tarifa> buscarPorTipoYHorario(String tipo, LocalTime hora);
}
