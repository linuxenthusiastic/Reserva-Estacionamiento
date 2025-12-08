package com.parking.system.service.strategies;

import org.springframework.stereotype.Component;

@Component("Auto")
public class CalculoAutoStrategy implements ICalculoCobroStrategy {
    @Override
    public double calcular(long minutos, double precioBase) {
        // Ejemplo: Cobro exacto por minuto * precioBase
        return minutos * precioBase;
    }
}
