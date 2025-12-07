package com.parking.system.service.strategies;

public class MultaDecorator extends CobroDecorator {
    private final double MONTO_MULTA = 50.0;

    public MultaDecorator(ICalculoCobroStrategy cobroEnvuelto) {
        super(cobroEnvuelto);
    }

    @Override
    public double calcular(long minutos, double precioBase) {
        return super.calcular(minutos, precioBase) + MONTO_MULTA;
    }
}
