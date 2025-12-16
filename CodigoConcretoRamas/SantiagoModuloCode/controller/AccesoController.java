package com.parking.system.controller;

import com.parking.system.dto.CheckInRequest;
import com.parking.system.dto.CheckInResponse;
import com.parking.system.dto.CheckOutResponse;
import com.parking.system.mapper.CheckInMapper;
import com.parking.system.mapper.CheckOutMapper;
import com.parking.system.model.CheckIn;
import com.parking.system.model.CheckOut;
import com.parking.system.model.Reserva;
import com.parking.system.service.CheckInService;
import com.parking.system.service.CheckOutService;
import com.parking.system.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/acceso")
public class AccesoController {

    private final CheckInService checkInService;
    private final CheckOutService checkOutService;
    private final CheckInMapper checkInMapper;
    private final CheckOutMapper checkOutMapper;
    private final ReservaService reservaService;

    @Autowired
    public AccesoController(CheckInService checkInService,
            CheckOutService checkOutService,
            CheckInMapper checkInMapper,
            CheckOutMapper checkOutMapper,
            ReservaService reservaService) {
        this.checkInService = checkInService;
        this.checkOutService = checkOutService;
        this.checkInMapper = checkInMapper;
        this.checkOutMapper = checkOutMapper;
        this.reservaService = reservaService;
    }

    @PostMapping("/check-in")
    public ResponseEntity<?> realizarCheckIn(@RequestBody CheckInRequest request) {
        try {
            CheckIn checkIn = checkInService.realizarCheckIn(
                    request.getReservaId(),
                    request.getDispositivoId());

            CheckInResponse response = checkInMapper.toResponse(checkIn);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/check-out/{reservaId}")
    public ResponseEntity<?> realizarCheckOut(@PathVariable Long reservaId) {
        try {
            CheckOut checkOut = checkOutService.realizarCheckOut(reservaId);

            CheckOutResponse response = checkOutMapper.toResponse(checkOut);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/validar-qr-para-checkin") // Renamed endpoint to avoid conflict
    public ResponseEntity<?> validarQRParaCheckIn(@RequestBody Map<String, String> request) {
        try {
            String codigoQR = request.get("codigoQR");
            CheckIn checkIn = checkInService.realizarCheckInConQR(codigoQR, "DISPOSITIVO-WEB");

            // Obtener la reserva para incluir espacioId en la respuesta
            Reserva reserva = reservaService.obtenerPorId(checkIn.getReservaId())
                    .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada"));

            return ResponseEntity.ok(checkInMapper.toResponse(checkIn, reserva));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/validar-qr")
    public ResponseEntity<Map<String, Object>> validarQR(@RequestBody Map<String, String> request) {
        try {
            String codigoQR = request.get("codigoQR");
            String dispositivoId = request.getOrDefault("dispositivoId", "LECTOR-DEFAULT");

            CheckIn checkIn = checkInService.realizarCheckInConQR(codigoQR, dispositivoId);

            // Obtener la reserva para incluir espacioId
            Optional<Reserva> reservaOpt = reservaService.obtenerPorId(checkIn.getReservaId());
            Long espacioId = reservaOpt.map(Reserva::getEspacioId).orElse(null);

            return ResponseEntity.ok(Map.of(
                    "valido", true,
                    "accion", "ABRIR_BARRERA",
                    "mensaje", "Acceso permitido",
                    "reservaId", checkIn.getReservaId(),
                    "espacioId", espacioId != null ? espacioId : 0L,
                    "checkInId", checkIn.getId(),
                    "dispositivo", checkIn.getDispositivoId()));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(Map.of(
                    "valido", false,
                    "accion", "DENEGAR_ACCESO",
                    "mensaje", "Código QR inválido",
                    "razon", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.ok(Map.of(
                    "valido", false,
                    "accion", "DENEGAR_ACCESO",
                    "mensaje", "Reserva no válida",
                    "razon", e.getMessage()));
        }
    }

    @PostMapping("/buscar-por-qr")
    public ResponseEntity<?> buscarPorQR(@RequestBody Map<String, String> request) {
        try {
            String codigoQR = request.get("codigoQR");

            if (codigoQR == null || codigoQR.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Código QR requerido"));
            }

            // Buscar la reserva por código QR usando el servicio
            Optional<com.parking.system.model.Reserva> reservaOpt = checkInService.buscarReservaPorQR(codigoQR);

            if (reservaOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "No se encontró reserva con ese código QR"));
            }

            com.parking.system.model.Reserva reserva = reservaOpt.get();

            return ResponseEntity.ok(Map.of(
                    "reservaId", reserva.getId(),
                    "estado", reserva.getEstado(),
                    "espacioId", reserva.getEspacioId()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
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
