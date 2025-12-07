package com.parking.system.service.report;

import com.parking.system.model.Factura;
import java.util.List;

public interface IReporteGenerator {
    byte[] generarArchivo(List<Factura> facturas);
}
