package com.parking.system.controller;

import com.parking.system.model.Reserva;
import com.parking.system.service.ReservaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {
    
    private final ReservaService reservaService;
    
    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }
    
    @PostMapping
    public ResponseEntity<?> crearReserva(@RequestBody Map<String, Object> request) {
        try {
            Long usuarioId = Long.valueOf(request.get("usuarioId").toString());
            Long espacioId = Long.valueOf(request.get("espacioId").toString());
            LocalDateTime fechaInicio = LocalDateTime.parse(request.get("fechaInicio").toString());
            LocalDateTime fechaFin = LocalDateTime.parse(request.get("fechaFin").toString());
            
            Reserva reserva = reservaService.crearReserva(usuarioId, espacioId, fechaInicio, fechaFin);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(reserva);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}