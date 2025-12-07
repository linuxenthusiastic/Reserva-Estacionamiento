package com.parking.system.model;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class PrecioEmpresarialStrategy implements PrecioPaseStrategy {
    
    @Override
    public BigDecimal calcularPrecio() {
        return new BigDecimal("500.00");
    }
    
    @Override
    public String getTipo() {
        return "EMPRESARIAL";
    }
}