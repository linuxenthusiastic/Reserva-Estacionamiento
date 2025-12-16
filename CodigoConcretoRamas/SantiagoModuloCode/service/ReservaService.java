package com.parking.system.service;

import com.parking.system.model.EstadoEspacio;
import com.parking.system.model.Reserva;
import com.parking.system.service.EspacioService;
import com.parking.system.service.QRCodeGenerator;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class ReservaService {

    private final List<Reserva> reservas = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);
    private final QRCodeGenerator qrCodeGenerator;
    private final EspacioService espacioService;

    public ReservaService(QRCodeGenerator qrCodeGenerator, EspacioService espacioService) {
        this.qrCodeGenerator = qrCodeGenerator;
        this.espacioService = espacioService;
    }

    public Reserva crearReserva(Long usuarioId, Long espacioId,
            LocalDateTime fechaInicio, LocalDateTime fechaFin) {

        if (fechaInicio.isAfter(fechaFin) || fechaInicio.isEqual(fechaFin)) {
            throw new IllegalArgumentException("La fecha de inicio debe ser anterior a la fecha de fin");
        }

        LocalDateTime ahora = LocalDateTime.now();
        if (fechaInicio.isBefore(ahora)) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser en el pasado");
        }

        long horas = java.time.Duration.between(fechaInicio, fechaFin).toHours();
        if (horas > 12) {
            throw new IllegalArgumentException("La reserva no puede durar más de 12 horas. Duración: " + horas + "h");
        }

        if (!verificarDisponibilidad(espacioId, fechaInicio, fechaFin)) {
            throw new IllegalStateException("El espacio " + espacioId + " no está disponible en ese horario");
        }

        // Crear reserva
        Reserva reserva = new Reserva();
        reserva.setId(idGenerator.getAndIncrement());
        reserva.setUsuarioId(usuarioId);
        reserva.setEspacioId(espacioId);
        reserva.setFechaInicio(fechaInicio);
        reserva.setFechaFin(fechaFin);
        reserva.setEstado("PENDIENTE"); // Estado inicial

        // Generar código QR
        String codigoQR = qrCodeGenerator.generarCodigo(reserva.getId(), fechaInicio);
        reserva.setQrCode(codigoQR);

        reservas.add(reserva);

        // Actualizar estado del espacio a RESERVADO
        espacioService.actualizarEstado(espacioId.intValue(), EstadoEspacio.RESERVADO);
        System.out.println(">>> Espacio " + espacioId + " marcado como RESERVADO");

        return reserva;
    }

    public Optional<Reserva> buscarPorCodigoQR(String codigoQR) {
        if (!qrCodeGenerator.esCodigoValido(codigoQR)) {
            return Optional.empty();
        }

        Long reservaId = qrCodeGenerator.extraerReservaId(codigoQR);
        return obtenerPorId(reservaId);
    }

    public List<Reserva> obtenerTodas() {
        return new ArrayList<>(reservas);
    }

    public Optional<Reserva> obtenerPorId(Long id) {
        return reservas.stream()
                .filter(r -> r.getId().equals(id))
                .findFirst();
    }

    public List<Reserva> obtenerPorUsuario(Long usuarioId) {
        return reservas.stream()
                .filter(r -> r.getUsuarioId().equals(usuarioId))
                .collect(Collectors.toList());
    }

    public List<Reserva> obtenerActivas() {
        return reservas.stream()
                .filter(r -> "EN_USO".equals(r.getEstado()))
                .collect(Collectors.toList());
    }

    public boolean verificarDisponibilidad(Long espacioId, LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return reservas.stream()
                .filter(r -> r.getEspacioId().equals(espacioId))
                .filter(r -> "CONFIRMADA".equals(r.getEstado()) || "EN_USO".equals(r.getEstado()))
                .noneMatch(r -> hayConflictoHorario(r, fechaInicio, fechaFin));
    }

    private boolean hayConflictoHorario(Reserva reserva, LocalDateTime inicio, LocalDateTime fin) {
        boolean terminaAntes = fin.isBefore(reserva.getFechaInicio()) || fin.isEqual(reserva.getFechaInicio());
        boolean empiezaDespues = inicio.isAfter(reserva.getFechaFin()) || inicio.isEqual(reserva.getFechaFin());
        return !(terminaAntes || empiezaDespues);
    }

    public boolean cancelarReserva(Long id) {
        Optional<Reserva> reserva = obtenerPorId(id);

        if (reserva.isPresent()) {
            Reserva r = reserva.get();
            r.setEstado("CANCELADA");

            // Liberar el espacio
            espacioService.actualizarEstado(r.getEspacioId().intValue(), EstadoEspacio.DISPONIBLE);
            System.out.println(">>> Espacio " + r.getEspacioId() + " liberado (reserva cancelada)");

            return true;
        }

        return false;
    }

    public boolean aprobarReserva(Long id) {
        Optional<Reserva> reserva = obtenerPorId(id);

        if (reserva.isPresent() && "PENDIENTE".equals(reserva.get().getEstado())) {
            reserva.get().setEstado("CONFIRMADA");
            System.out.println(">>> Reserva " + id + " APROBADA");
            return true;
        }

        return false;
    }

    public boolean rechazarReserva(Long id) {
        Optional<Reserva> reserva = obtenerPorId(id);

        if (reserva.isPresent() && "PENDIENTE".equals(reserva.get().getEstado())) {
            Reserva r = reserva.get();
            r.setEstado("RECHAZADA");

            // Liberar el espacio
            espacioService.actualizarEstado(r.getEspacioId().intValue(), EstadoEspacio.DISPONIBLE);
            System.out.println(">>> Reserva " + id + " RECHAZADA - Espacio " + r.getEspacioId() + " liberado");

            return true;
        }

        return false;
    }

    public List<Reserva> obtenerPendientes() {
        return reservas.stream()
                .filter(r -> "PENDIENTE".equals(r.getEstado()))
                .collect(Collectors.toList());
    }
}