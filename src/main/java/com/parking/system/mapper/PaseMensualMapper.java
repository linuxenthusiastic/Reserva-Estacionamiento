package com.parking.system.mapper;

import com.parking.system.dto.PaseMensualResponse;
import com.parking.system.model.PaseMensual;
import org.springframework.stereotype.Component;

@Component
public class PaseMensualMapper {
    
    public PaseMensualResponse toResponse(PaseMensual pase) {
        PaseMensualResponse response = new PaseMensualResponse();
        response.setId(pase.getId());
        response.setUsuarioId(pase.getUsuarioId());
        response.setTipo(pase.getTipo());
        response.setEspacioAsignado(pase.getEspacioAsignado());
        response.setFechaInicio(pase.getFechaInicio());
        response.setFechaVencimiento(pase.getFechaVencimiento());
        response.setPrecio(pase.getPrecio());
        response.setEstado(pase.getEstado());
        response.setVigente(pase.estaVigente());
        response.setFechaCreacion(pase.getFechaCreacion());
        return response;
    }
}