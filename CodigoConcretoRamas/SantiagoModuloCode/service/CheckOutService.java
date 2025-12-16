package com.parking.system.service;

import com.parking.system.model.CheckIn;
import com.parking.system.model.CheckOut;
import com.parking.system.model.EstadoEspacio;
import com.parking.system.model.Reserva;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class CheckOutService {

    private final List<CheckOut> checkOuts = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);
    private final ReservaService reservaService;
    private final CheckInService checkInService;
    private final EspacioService espacioService;

    public CheckOutService(ReservaService reservaService, CheckInService checkInService,
            EspacioService espacioService) {
        this.reservaService = reservaService;
        this.checkInService = checkInService;
        this.espacioService = espacioService;
    }

    public CheckOut realizarCheckOut(Long reservaId) {
        Optional<Reserva> reservaOpt = reservaService.obtenerPorId(reservaId);

        if (reservaOpt.isEmpty()) {
            throw new IllegalArgumentException("Reserva no encontrada");
        }

        Reserva reserva = reservaOpt.get();

        if (!"EN_USO".equals(reserva.getEstado())) {
            throw new IllegalStateException("La reserva no está en uso");
        }

        Optional<CheckIn> checkInOpt = checkInService.obtenerPorReserva(reservaId);

        if (checkInOpt.isEmpty()) {
            throw new IllegalStateException("No se encontró check-in");
        }

        CheckIn checkIn = checkInOpt.get();

        CheckOut checkOut = new CheckOut();
        checkOut.setId(idGenerator.getAndIncrement());
        checkOut.setReservaId(reservaId);

        LocalDateTime horaEntrada = checkIn.getHoraEntrada();
        LocalDateTime horaSalida = LocalDateTime.now();
        Duration duracion = Duration.between(horaEntrada, horaSalida);
        checkOut.setTiempoTotalMinutos(duracion.toMinutes());

        // Actualizar estado de la reserva
        reserva.setEstado("COMPLETADA");

        // Liberar el espacio (OCUPADO → DISPONIBLE)
        espacioService.actualizarEstado(reserva.getEspacioId().intValue(), EstadoEspacio.DISPONIBLE);
        System.out.println(">>> CHECK-OUT: Espacio " + reserva.getEspacioId() + " liberado (DISPONIBLE)");

        // TODO: Aquí se debería generar el cobro automáticamente
        // Cobro cobro = cobroService.generarCobroPorReserva(reservaId,
        // duracion.toMinutes());
        // checkOut.setCobroId(cobro.getId());
        System.out.println(">>> CHECK-OUT: Tiempo total: " + duracion.toMinutes() + " minutos");
        System.out.println(">>> CHECK-OUT: Se debe generar cobro para reserva " + reservaId);

        checkOuts.add(checkOut);
        return checkOut;
    }

    public List<CheckOut> obtenerTodos() {
        return new ArrayList<>(checkOuts);
    }
}
