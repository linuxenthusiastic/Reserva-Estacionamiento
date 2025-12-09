package com.parking.system.service.report;

import org.springframework.stereotype.Component;

@Component
public class ReporteFactory {
    public IReporteGenerator getGenerador(String formato) {
        if ("pdf".equalsIgnoreCase(formato)) {
            return new PdfReporteGenerator();
        } else if ("excel".equalsIgnoreCase(formato)) {
            return new ExcelReporteGenerator();
        }
        throw new IllegalArgumentException("Formato de reporte no soportado: " + formato);
    }
}
