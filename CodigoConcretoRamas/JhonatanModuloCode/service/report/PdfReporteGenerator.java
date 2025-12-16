package com.parking.system.service.report;

import com.parking.system.model.Factura;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class PdfReporteGenerator implements IReporteGenerator {
    @Override
    public byte[] generarArchivo(List<Factura> facturas) {
        StringBuilder sb = new StringBuilder();
        sb.append("--- REPORTE PDF ---\n");
        for (Factura f : facturas) {
            sb.append("Factura #").append(f.getId())
                    .append(" | NIT: ").append(f.getNitCliente())
                    .append(" | Total: ").append(f.getMontoTotal())
                    .append("\n");
        }
        sb.append("-------------------\n");
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }
}
