package com.parking.system.mapper;

import com.parking.system.dto.ReservaResponse;
import com.parking.system.model.Reserva;
import org.springframework.stereotype.Component;

@Component
public class ReservaMapper {
    
    public ReservaResponse toResponse(Reserva reserva) {
        ReservaResponse response = new ReservaResponse();
        response.setId(reserva.getId());
        response.setUsuarioId(reserva.getUsuarioId());
        response.setEspacioId(reserva.getEspacioId());
        response.setFechaInicio(reserva.getFechaInicio());
        response.setFechaFin(reserva.getFechaFin());
        response.setEstado(reserva.getEstado());
        response.setQrCode(reserva.getQrCode());  // ← AQUÍ
        response.setFechaCreacion(reserva.getFechaCreacion());
        return response;
    }
}