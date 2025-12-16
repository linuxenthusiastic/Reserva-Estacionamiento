package com.parking.system.model;

import java.math.BigDecimal;

public interface PrecioPaseStrategy {
    BigDecimal calcularPrecio();
    String getTipo();
}
