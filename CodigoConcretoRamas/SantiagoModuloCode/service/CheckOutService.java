package com.parking.system.service;

import com.parking.system.dto.TicketResponse;
import com.parking.system.model.*;
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
    private final CobroService cobroService;
    private final MembresiaService membresiaService;

    public CheckOutService(ReservaService reservaService, CheckInService checkInService,
            EspacioService espacioService, CobroService cobroService, MembresiaService membresiaService) {
        this.reservaService = reservaService;
        this.checkInService = checkInService;
        this.espacioService = espacioService;
        this.cobroService = cobroService;
        this.membresiaService = membresiaService;
    }

    public CheckOut realizarCheckOut(Long reservaId) {
        // 1. Validar reserva
        Optional<Reserva> reservaOpt = reservaService.obtenerPorId(reservaId);
        if (reservaOpt.isEmpty()) {
            throw new IllegalArgumentException("Reserva no encontrada");
        }

        Reserva reserva = reservaOpt.get();

        if (!"EN_USO".equals(reserva.getEstado())) {
            throw new IllegalStateException("La reserva no está en uso. Estado actual: " + reserva.getEstado());
        }

        // 2. Obtener check-in
        Optional<CheckIn> checkInOpt = checkInService.obtenerPorReserva(reservaId);
        if (checkInOpt.isEmpty()) {
            throw new IllegalStateException("No se encontró check-in para esta reserva");
        }

        CheckIn checkIn = checkInOpt.get();

        // 3. Calcular tiempos
        LocalDateTime horaEntrada = checkIn.getHoraEntrada();
        LocalDateTime horaSalida = LocalDateTime.now();
        Duration duracionReal = Duration.between(horaEntrada, horaSalida);
        long minutosReales = duracionReal.toMinutes();

        // Calcular minutos reservados
        Duration duracionReservada = Duration.between(reserva.getFechaInicio(), reserva.getFechaFin());
        long minutosReservados = duracionReservada.toMinutes();

        // Verificar si excedió el tiempo
        long minutosExcedidos = minutosReales - minutosReservados;
        boolean aplicarMulta = minutosExcedidos > 0;

        System.out.println(
                ">>> CHECK-OUT: Minutos reales: " + minutosReales + ", Minutos reservados: " + minutosReservados);
        if (aplicarMulta) {
            System.out.println(">>> CHECK-OUT: EXCEDIÓ " + minutosExcedidos + " minutos - SE APLICARÁ MULTA");
        }

        // 4. Crear check-out
        CheckOut checkOut = new CheckOut();
        checkOut.setId(idGenerator.getAndIncrement());
        checkOut.setReservaId(reservaId);
        checkOut.setTiempoTotalMinutos(minutosReales);
        checkOut.setMinutosReservados(minutosReservados);
        checkOut.setMinutosExcedidos(minutosExcedidos > 0 ? minutosExcedidos : 0);
        checkOut.setTipoVehiculo(reserva.getTipoVehiculo() != null ? reserva.getTipoVehiculo() : "Auto");

        // 5. Verificar membresía
        boolean tieneMembresia = membresiaService.tieneMembresiaVigente(reserva.getUsuarioId());

        if (tieneMembresia) {
            // Usuario con membresía - NO SE COBRA
            checkOut.setExentoMembresia(true);
            checkOut.setMontoCobrado(0.0);
            System.out.println(">>> CHECK-OUT: Usuario tiene MEMBRESÍA VIGENTE - Exento de pago");
        } else {
            // Usuario sin membresía - CALCULAR COBRO
            try {
                String tipoVehiculo = reserva.getTipoVehiculo() != null ? reserva.getTipoVehiculo() : "Auto";

                // Calcular cobro usando CobroService con estrategias
                TicketResponse ticket = cobroService.calcularCobro(
                        tipoVehiculo,
                        minutosReales,
                        aplicarMulta);

                double montoCobrado = ticket.getMontoTotal();

                // Aplicar recargo VIP si corresponde
                Espacio espacio = espacioService.obtenerPorId(reserva.getEspacioId().intValue());
                if (espacio != null && espacio.getTipo() == TipoEspacio.VIP) {
                    // Recargo del 30% para espacios VIP
                    montoCobrado = montoCobrado * 1.30;
                    System.out.println(">>> CHECK-OUT: Espacio VIP - Aplicando recargo del 30%");
                }

                checkOut.setMontoCobrado(montoCobrado);

                // Generar factura
                Factura factura = cobroService.emitirFactura("0", montoCobrado);
                checkOut.setFacturaId(factura.getId());

                System.out.println(">>> CHECK-OUT: Cobro calculado - Monto: Bs. " + montoCobrado);
                System.out.println(">>> CHECK-OUT: Factura generada #" + factura.getId());
                System.out.println(">>> CHECK-OUT: Detalle: " + ticket.getDetalle());

            } catch (Exception e) {
                System.err.println(">>> CHECK-OUT: Error al calcular cobro: " + e.getMessage());
                // No fallar el check-out si hay error en el cobro
                checkOut.setMontoCobrado(0.0);
            }
        }

        // 6. Actualizar estado de la reserva
        reserva.setEstado("COMPLETADA");

        // 7. Liberar el espacio (OCUPADO → DISPONIBLE)
        espacioService.actualizarEstado(reserva.getEspacioId().intValue(), EstadoEspacio.DISPONIBLE);
        System.out.println(">>> CHECK-OUT: Espacio " + reserva.getEspacioId() + " liberado (DISPONIBLE)");
        System.out.println(">>> CHECK-OUT: Reserva #" + reservaId + " completada exitosamente");

        checkOuts.add(checkOut);
        return checkOut;
    }

    public List<CheckOut> obtenerTodos() {
        return new ArrayList<>(checkOuts);
    }
}
