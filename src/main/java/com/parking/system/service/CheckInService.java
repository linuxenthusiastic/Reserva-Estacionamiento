package com.parking.system.service;

import com.parking.system.model.CheckIn;
import com.parking.system.model.Reserva;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class CheckInService {
    
    private final List<CheckIn> checkIns = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);
    private final ReservaService reservaService;
    
    public CheckInService(ReservaService reservaService) {
        this.reservaService = reservaService;
    }
    
    public CheckIn realizarCheckIn(Long reservaId, String dispositivoId) {
        Optional<Reserva> reservaOpt = reservaService.obtenerPorId(reservaId);
        
        if (reservaOpt.isEmpty()) {
            throw new IllegalArgumentException("Reserva no encontrada");
        }
        
        Reserva reserva = reservaOpt.get();
        
        if (!"CONFIRMADA".equals(reserva.getEstado())) {
            throw new IllegalStateException("La reserva no está confirmada. Estado: " + reserva.getEstado());
        }
        
        return crearCheckIn(reserva, dispositivoId);
    }
    
    public CheckIn realizarCheckInConQR(String codigoQR, String dispositivoId) {
        Optional<Reserva> reservaOpt = reservaService.buscarPorCodigoQR(codigoQR);
        
        if (reservaOpt.isEmpty()) {
            throw new IllegalArgumentException("Código QR inválido o reserva no encontrada");
        }
        
        Reserva reserva = reservaOpt.get();
        
        if (!"CONFIRMADA".equals(reserva.getEstado())) {
            throw new IllegalStateException("La reserva no está confirmada. Estado: " + reserva.getEstado());
        }
        
        return crearCheckIn(reserva, dispositivoId);
    }
    
    private CheckIn crearCheckIn(Reserva reserva, String dispositivoId) {
        CheckIn checkIn = new CheckIn();
        checkIn.setId(idGenerator.getAndIncrement());
        checkIn.setReservaId(reserva.getId());
        
        if (dispositivoId == null || dispositivoId.isEmpty()) {
            checkIn.setDispositivoId("DISPOSITIVO-DEFAULT");
        } else {
            checkIn.setDispositivoId(dispositivoId);
        }
        
        reserva.setEstado("EN_USO");
        
        checkIns.add(checkIn);
        return checkIn;
    }
    
    public List<CheckIn> obtenerTodos() {
        return new ArrayList<>(checkIns);
    }
    
    public Optional<CheckIn> obtenerPorReserva(Long reservaId) {
        return checkIns.stream()
                .filter(c -> c.getReservaId().equals(reservaId))
                .findFirst();
    }
}