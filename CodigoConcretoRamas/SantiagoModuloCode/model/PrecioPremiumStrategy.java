package com.parking.system.model;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class PrecioPremiumStrategy implements PrecioPaseStrategy {
    
    @Override
    public BigDecimal calcularPrecio() {
        return new BigDecimal("300.00");
    }
    
    @Override
    public String getTipo() {
        return "PREMIUM";
    }
}
