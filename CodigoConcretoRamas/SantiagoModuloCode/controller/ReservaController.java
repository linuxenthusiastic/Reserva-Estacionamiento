package com.parking.system.controller;

import com.parking.system.dto.CrearReservaRequest;
import com.parking.system.dto.ReservaResponse;
import com.parking.system.mapper.ReservaMapper;
import com.parking.system.model.Reserva;
import com.parking.system.service.ReservaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
    public ResponseEntity<?> crearReserva(@RequestBody CrearReservaRequest request) {
        try {
            Reserva reserva = reservaService.crearReserva(
                request.getUsuarioId(),
                request.getEspacioId(),
                request.getFechaInicio(),
                request.getFechaFin()
            );
            
            ReservaResponse response = mapper.toResponse(reserva);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
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
    
    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponse> obtenerPorId(@PathVariable Long id) {
        Optional<Reserva> reserva = reservaService.obtenerPorId(id);
        
        if (reserva.isPresent()) {
            ReservaResponse response = mapper.toResponse(reserva.get());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ReservaResponse>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        List<Reserva> reservas = reservaService.obtenerPorUsuario(usuarioId);
        
        List<ReservaResponse> responses = reservas.stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    // NUEVO: Obtener reservas activas
    @GetMapping("/activas")
    public ResponseEntity<List<ReservaResponse>> obtenerActivas() {
        List<Reserva> reservas = reservaService.obtenerActivas();
        
        List<ReservaResponse> responses = reservas.stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    // NUEVO: Verificar disponibilidad
    @GetMapping("/disponibilidad/{espacioId}")
    public ResponseEntity<Map<String, Object>> verificarDisponibilidad(
            @PathVariable Long espacioId,
            @RequestParam String fechaInicio,
            @RequestParam String fechaFin) {
        
        try {
            LocalDateTime inicio = LocalDateTime.parse(fechaInicio);
            LocalDateTime fin = LocalDateTime.parse(fechaFin);
            
            boolean disponible = reservaService.verificarDisponibilidad(espacioId, inicio, fin);
            
            return ResponseEntity.ok(Map.of(
                "espacioId", espacioId,
                "disponible", disponible,
                "fechaInicio", fechaInicio,
                "fechaFin", fechaFin
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Formato de fecha inválido"));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelarReserva(@PathVariable Long id) {
        boolean cancelada = reservaService.cancelarReserva(id);
        
        if (cancelada) {
            return ResponseEntity.ok(Map.of("mensaje", "Reserva cancelada"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}