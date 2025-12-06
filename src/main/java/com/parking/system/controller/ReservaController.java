package com.parking.system.controller;

import com.parking.system.dto.CrearReservaRequest;
import com.parking.system.dto.ReservaResponse;
import com.parking.system.mapper.ReservaMapper;
import com.parking.system.model.Reserva;
import com.parking.system.service.ReservaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {
    
    private final ReservaService reservaService;
    private final ReservaMapper mapper;
    
    public ReservaController(ReservaService reservaService, ReservaMapper mapper) {
        this.reservaService = reservaService;
        this.mapper = mapper;
    }
    
    @PostMapping
    public ResponseEntity<ReservaResponse> crearReserva(@RequestBody CrearReservaRequest request) {
        try {
            Reserva reserva = reservaService.crearReserva(
                request.getUsuarioId(),
                request.getEspacioId(),
                request.getFechaInicio(),
                request.getFechaFin()
            );
            
            ReservaResponse response = mapper.toResponse(reserva);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<ReservaResponse>> obtenerTodas() {
        List<Reserva> reservas = reservaService.obtenerTodas();
        
        List<ReservaResponse> responses = reservas.stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
}