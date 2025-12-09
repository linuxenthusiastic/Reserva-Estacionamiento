package com.parking.system.controller;

import com.parking.system.dto.*;
import com.parking.system.mapper.CheckInMapper;
import com.parking.system.mapper.CheckOutMapper;
import com.parking.system.model.CheckIn;
import com.parking.system.model.CheckOut;
import com.parking.system.service.CheckInService;
import com.parking.system.service.CheckOutService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accesos")
public class AccesoController {
    
    private final CheckInService checkInService;
    private final CheckOutService checkOutService;
    private final CheckInMapper checkInMapper;
    private final CheckOutMapper checkOutMapper;
    
    public AccesoController(CheckInService checkInService, 
                           CheckOutService checkOutService,
                           CheckInMapper checkInMapper,
                           CheckOutMapper checkOutMapper) {
        this.checkInService = checkInService;
        this.checkOutService = checkOutService;
        this.checkInMapper = checkInMapper;
        this.checkOutMapper = checkOutMapper;
    }
    
    @PostMapping("/check-in")
    public ResponseEntity<?> realizarCheckIn(@RequestBody CheckInRequest request) {
        try {
            CheckIn checkIn = checkInService.realizarCheckIn(
                request.getReservaId(),
                request.getDispositivoId()
            );
            
            CheckInResponse response = checkInMapper.toResponse(checkIn);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/check-out")
    public ResponseEntity<?> realizarCheckOut(@RequestBody CheckOutRequest request) {
        try {
            CheckOut checkOut = checkOutService.realizarCheckOut(request.getReservaId());
            
            CheckOutResponse response = checkOutMapper.toResponse(checkOut);
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/validar-qr")
    public ResponseEntity<Map<String, Object>> validarQR(@RequestBody Map<String, String> request) {
        try {
            String codigoQR = request.get("codigoQR");
            String dispositivoId = request.getOrDefault("dispositivoId", "LECTOR-DEFAULT");
            
            CheckIn checkIn = checkInService.realizarCheckInConQR(codigoQR, dispositivoId);
            
            return ResponseEntity.ok(Map.of(
                "valido", true,
                "accion", "ABRIR_BARRERA",
                "mensaje", "Acceso permitido",
                "reservaId", checkIn.getReservaId(),
                "checkInId", checkIn.getId(),
                "dispositivo", checkIn.getDispositivoId()
            ));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(Map.of(
                "valido", false,
                "accion", "DENEGAR_ACCESO",
                "mensaje", "Código QR inválido",
                "razon", e.getMessage()
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.ok(Map.of(
                "valido", false,
                "accion", "DENEGAR_ACCESO",
                "mensaje", "Reserva no válida",
                "razon", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/check-ins")
    public ResponseEntity<List<CheckInResponse>> obtenerCheckIns() {
        List<CheckIn> checkIns = checkInService.obtenerTodos();
        
        List<CheckInResponse> responses = checkIns.stream()
                .map(checkInMapper::toResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/check-outs")
    public ResponseEntity<List<CheckOutResponse>> obtenerCheckOuts() {
        List<CheckOut> checkOuts = checkOutService.obtenerTodos();
        
        List<CheckOutResponse> responses = checkOuts.stream()
                .map(checkOutMapper::toResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
}