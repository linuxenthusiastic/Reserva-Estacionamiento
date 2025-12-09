package com.parking.system.controller;

import com.parking.system.dto.CobroRequest;
import com.parking.system.dto.FacturaResponse;
import com.parking.system.dto.TicketResponse;
import com.parking.system.model.Factura;
import com.parking.system.service.CobroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cobros")
public class CobroController {

    private final CobroService cobroService;

    @Autowired
    public CobroController(CobroService cobroService) {
        this.cobroService = cobroService;
    }

    @PostMapping("/calcular")
    public ResponseEntity<TicketResponse> calcularCobro(@RequestBody CobroRequest request) {
        TicketResponse response = cobroService.calcularCobro(
                request.getTipoVehiculo(),
                request.getMinutos(),
                request.isConMulta());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/pagar")
    public ResponseEntity<FacturaResponse> procesarPago(@RequestBody CobroRequest request) {
        // Primero calculamos
        TicketResponse ticket = cobroService.calcularCobro(
                request.getTipoVehiculo(),
                request.getMinutos(),
                request.isConMulta());

        // Luego emitimos factura
        Factura factura = cobroService.emitirFactura(request.getNitCliente(), ticket.getMontoTotal());

        return ResponseEntity.ok(new FacturaResponse(
                factura.getId(),
                factura.getNitCliente(),
                factura.getMontoTotal(),
                factura.getFechaEmision()));
    }

    @GetMapping("/reporte")
    public ResponseEntity<byte[]> generarReporte(@RequestParam(defaultValue = "pdf") String formato) {
        byte[] archivo = cobroService.generarReporte(formato);

        String filename = "reporte." + (formato.equalsIgnoreCase("excel") ? "csv" : "pdf"); // Excel simple como CSV
        MediaType mediaType = formato.equalsIgnoreCase("pdf") ? MediaType.APPLICATION_PDF : MediaType.TEXT_PLAIN;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(mediaType)
                .body(archivo);
    }
}
