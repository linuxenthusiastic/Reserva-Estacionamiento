package com.parking.system.mapper;

import com.parking.system.dto.CheckInResponse;
import com.parking.system.model.CheckIn;
import org.springframework.stereotype.Component;

@Component
public class CheckInMapper {
    
    public CheckInResponse toResponse(CheckIn checkIn) {
        CheckInResponse response = new CheckInResponse();
        response.setId(checkIn.getId());
        response.setReservaId(checkIn.getReservaId());
        response.setHoraEntrada(checkIn.getHoraEntrada());
        response.setDispositivoId(checkIn.getDispositivoId());
        response.setMensaje("Check-in realizado exitosamente");
        return response;
    }
}