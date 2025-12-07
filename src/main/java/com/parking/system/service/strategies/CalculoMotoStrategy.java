package com.parking.system.service.strategies;

import org.springframework.stereotype.Component;

@Component("Moto")
public class CalculoMotoStrategy implements ICalculoCobroStrategy {
    @Override
    public double calcular(long minutos, double precioBase) {
        // Ejemplo: Motos pagan el 80% de la tarifa base
        return minutos * (precioBase * 0.80);
    }
}
