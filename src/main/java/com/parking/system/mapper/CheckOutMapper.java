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
        response.setMinutosReservados(checkOut.getMinutosReservados());
        response.setMinutosExcedidos(checkOut.getMinutosExcedidos());
        response.setTipoVehiculo(checkOut.getTipoVehiculo());
        response.setMontoCobrado(checkOut.getMontoCobrado());
        response.setFacturaId(checkOut.getFacturaId());
        response.setExentoMembresia(checkOut.isExentoMembresia());

        long minutos = checkOut.getTiempoTotalMinutos();
        long horas = minutos / 60;
        long mins = minutos % 60;

        String mensaje;
        if (checkOut.isExentoMembresia()) {
            mensaje = String.format("Check-out realizado. Tiempo: %dh %dmin. EXENTO POR MEMBRESÍA",
                    horas, mins);
        } else {
            mensaje = String.format("Check-out realizado. Tiempo: %dh %dmin. Monto: Bs. %.2f",
                    horas, mins, checkOut.getMontoCobrado());
        }

        response.setMensaje(mensaje);

        return response;
    }
}
