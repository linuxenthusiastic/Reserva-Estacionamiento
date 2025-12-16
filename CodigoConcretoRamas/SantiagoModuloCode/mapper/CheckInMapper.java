package com.parking.system.mapper;

import com.parking.system.dto.CheckInResponse;
import com.parking.system.model.CheckIn;
import com.parking.system.model.Reserva;
import org.springframework.stereotype.Component;

@Component
public class CheckInMapper {

    public CheckInResponse toResponse(CheckIn checkIn, Reserva reserva) {
        CheckInResponse response = new CheckInResponse();
        response.setId(checkIn.getId());
        response.setReservaId(checkIn.getReservaId());
        response.setEspacioId(reserva.getEspacioId());
        response.setHoraEntrada(checkIn.getHoraEntrada());
        response.setMensaje("Check-in realizado exitosamente");
        return response;
    }

    // Sobrecarga para compatibilidad (sin espacioId)
    public CheckInResponse toResponse(CheckIn checkIn) {
        CheckInResponse response = new CheckInResponse();
        response.setId(checkIn.getId());
        response.setReservaId(checkIn.getReservaId());
        response.setEspacioId(null);
        response.setHoraEntrada(checkIn.getHoraEntrada());
        response.setMensaje("Check-in realizado exitosamente");
        return response;
    }
}
