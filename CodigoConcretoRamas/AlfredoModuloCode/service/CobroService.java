package com.parking.system.service;

import com.parking.system.dto.TicketResponse;
import com.parking.system.model.Factura;
import com.parking.system.model.Tarifa;
import com.parking.system.repository.TarifaRepository;
import com.parking.system.service.report.IReporteGenerator;
import com.parking.system.service.report.ReporteFactory;
import com.parking.system.service.strategies.DescuentoDecorator;
import com.parking.system.service.strategies.ICalculoCobroStrategy;
import com.parking.system.service.strategies.MultaDecorator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CobroService {

    private final TarifaRepository tarifaRepository;
    private final Map<String, ICalculoCobroStrategy> estrategias; // K: "Auto", "Moto" (Bean names)
    private final ReporteFactory reporteFactory;

    // Simulación de persistencia de facturas en el servicio por brevedad (o podría
    // ir al Repo)
    private final List<Factura> facturasRealizadas = new ArrayList<>();
    private Long nextFacturaId = 1L;

    @Autowired
    public CobroService(TarifaRepository tarifaRepository,
            Map<String, ICalculoCobroStrategy> estrategias,
            ReporteFactory reporteFactory) {
        this.tarifaRepository = tarifaRepository;
        this.estrategias = estrategias;
        this.reporteFactory = reporteFactory;
    }

    public TicketResponse calcularCobro(String tipoVehiculo, long minutos, boolean conMulta) {
        // 1. Obtener precio base
        // Para simplificar, asumimos tarifa fija o buscamos la primera compatible
        // En prod: buscar por hora actual
        Optional<Tarifa> tarifaOpt = tarifaRepository.buscarPorTipoYHorario(tipoVehiculo, LocalTime.now());
        double precioBase = tarifaOpt.map(Tarifa::getPrecioUnitario).orElse(10.0); // Default 10.0

        // 2. Seleccionar Estrategia Base (Auto/Moto)
        ICalculoCobroStrategy estrategia = estrategias.get(tipoVehiculo);
        if (estrategia == null) {
            throw new IllegalArgumentException("Tipo de vehículo no soportado: " + tipoVehiculo);
        }

        // 3. Decorar si es necesario (Multas, Descuentos)
        if (conMulta) {
            estrategia = new MultaDecorator(estrategia);
        }

        // Ejemplo: Si son más de 300 minutos (5 horas), aplicar descuento
        if (minutos > 300) {
            estrategia = new DescuentoDecorator(estrategia);
        }

        // 4. Calcular
        double total = estrategia.calcular(minutos, precioBase);

        String detalle = String.format("Cobro para %s (%d mins). Precio base: %.2f. Multa: %b. Total: %.2f",
                tipoVehiculo, minutos, precioBase, conMulta, total);

        return new TicketResponse(total, detalle);
    }

    public Factura emitirFactura(String nit, double monto) {
        Factura factura = new Factura(nextFacturaId++, nit, monto, LocalDateTime.now());
        facturasRealizadas.add(factura);
        return factura;
    }

    public byte[] generarReporte(String formato) {
        IReporteGenerator generador = reporteFactory.getGenerador(formato);
        return generador.generarArchivo(facturasRealizadas);
    }

    public List<Factura> obtenerTodasFacturas() {
        return new ArrayList<>(facturasRealizadas);
    }

    public Optional<Factura> obtenerFacturaPorId(Long id) {
        return facturasRealizadas.stream()
                .filter(f -> f.getId().equals(id))
                .findFirst();
    }
}
