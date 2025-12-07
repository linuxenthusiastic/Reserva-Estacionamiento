package com.parking.system.service.strategies;

public class DescuentoDecorator extends CobroDecorator {
    private final double PORCENTAJE_DESCUENTO = 0.10; // 10%

    public DescuentoDecorator(ICalculoCobroStrategy cobroEnvuelto) {
        super(cobroEnvuelto);
    }

    @Override
    public double calcular(long minutos, double precioBase) {
        double subtotal = super.calcular(minutos, precioBase);
        return subtotal - (subtotal * PORCENTAJE_DESCUENTO);
    }
}
