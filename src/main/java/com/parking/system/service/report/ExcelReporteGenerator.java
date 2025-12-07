package com.parking.system.service.report;

import com.parking.system.model.Factura;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class ExcelReporteGenerator implements IReporteGenerator {
    @Override
    public byte[] generarArchivo(List<Factura> facturas) {
        StringBuilder sb = new StringBuilder();
        sb.append("ID,NIT,TOTAL,FECHA\n");
        for (Factura f : facturas) {
            sb.append(f.getId()).append(",")
                    .append(f.getNitCliente()).append(",")
                    .append(f.getMontoTotal()).append(",")
                    .append(f.getFechaEmision())
                    .append("\n");
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }
}
