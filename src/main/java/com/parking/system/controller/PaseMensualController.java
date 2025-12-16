package com.parking.system.controller;

import com.parking.system.dto.CrearPaseMensualRequest;
import com.parking.system.dto.PaseMensualResponse;
import com.parking.system.mapper.PaseMensualMapper;
import com.parking.system.model.PaseMensual;
import com.parking.system.service.PaseMensualService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pases-mensuales")
public class PaseMensualController {
    
    private final PaseMensualService paseMensualService;
    private final PaseMensualMapper mapper;
    
    public PaseMensualController(PaseMensualService paseMensualService, PaseMensualMapper mapper) {
        this.paseMensualService = paseMensualService;
        this.mapper = mapper;
    }
    
    @PostMapping
    public ResponseEntity<?> crearPase(@RequestBody CrearPaseMensualRequest request) {
        try {
            PaseMensual pase = paseMensualService.crearPase(
                request.getUsuarioId(),
                request.getTipo(),
                request.getEspacioAsignado()
            );
            
            PaseMensualResponse response = mapper.toResponse(pase);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<PaseMensualResponse>> obtenerTodos() {
        List<PaseMensual> pases = paseMensualService.obtenerTodos();
        
        List<PaseMensualResponse> responses = pases.stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PaseMensualResponse> obtenerPorId(@PathVariable Long id) {
        Optional<PaseMensual> pase = paseMensualService.obtenerPorId(id);
        
        if (pase.isPresent()) {
            PaseMensualResponse response = mapper.toResponse(pase.get());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PaseMensualResponse>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        List<PaseMensual> pases = paseMensualService.obtenerPorUsuario(usuarioId);
        
        List<PaseMensualResponse> responses = pases.stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/vigentes")
    public ResponseEntity<List<PaseMensualResponse>> obtenerVigentes() {
        List<PaseMensual> pases = paseMensualService.obtenerVigentes();
        
        List<PaseMensualResponse> responses = pases.stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    @PutMapping("/{id}/renovar")
    public ResponseEntity<?> renovarPase(@PathVariable Long id) {
        boolean renovado = paseMensualService.renovarPase(id);
        
        if (renovado) {
            return ResponseEntity.ok(Map.of("mensaje", "Pase renovado por 30 días más"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelarPase(@PathVariable Long id) {
        boolean cancelado = paseMensualService.cancelarPase(id);
        
        if (cancelado) {
            return ResponseEntity.ok(Map.of("mensaje", "Pase cancelado"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
