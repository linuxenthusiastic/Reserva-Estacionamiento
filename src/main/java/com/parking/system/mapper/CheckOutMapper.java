package com.parking.system.mapper;

import com.parking.system.dto.CheckOutResponse;
import com.parking.system.model.CheckOut;
import org.springframework.stereotype.Component;

@Component
public class CheckOutMapper {
    
    public CheckOutResponse toResponse(CheckOut checkOut) {
        CheckOutResponse response = new CheckOutResponse();
        response.setId(checkOut.getId());
        response.setReservaId(checkOut.getReservaId());
        response.setHoraSalida(checkOut.getHoraSalida());
        response.setTiempoTotalMinutos(checkOut.getTiempoTotalMinutos());
        
        long minutos = checkOut.getTiempoTotalMinutos();
        long horas = minutos / 60;
        long mins = minutos % 60;
        
        String mensaje = String.format("Check-out realizado. Tiempo total: %dh %dmin (%d minutos)", 
                                       horas, mins, minutos);
        response.setMensaje(mensaje);
        
        return response;
    }
}