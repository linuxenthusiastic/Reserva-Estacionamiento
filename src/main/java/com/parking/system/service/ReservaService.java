package com.parking.system.service;

import com.parking.system.model.Reserva;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ReservaService {
    
    private final List<Reserva> reservas = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);
    
    public Reserva crearReserva(Long usuarioId, Long espacioId, 
                                LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        
        if (fechaInicio.isAfter(fechaFin)) {
            throw new IllegalArgumentException("Fecha inicio debe ser antes que fecha fin");
        }
        
        Reserva reserva = new Reserva();
        reserva.setId(idGenerator.getAndIncrement());
        reserva.setUsuarioId(usuarioId);
        reserva.setEspacioId(espacioId);
        reserva.setFechaInicio(fechaInicio);
        reserva.setFechaFin(fechaFin);
        
        reservas.add(reserva);
        return reserva;
    }
    
    public List<Reserva> obtenerTodas() {
        return new ArrayList<>(reservas);
    }
}