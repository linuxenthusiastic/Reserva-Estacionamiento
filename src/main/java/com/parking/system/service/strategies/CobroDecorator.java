package com.parking.system.service.strategies;

public abstract class CobroDecorator implements ICalculoCobroStrategy {
    protected ICalculoCobroStrategy cobroEnvuelto;

    public CobroDecorator(ICalculoCobroStrategy cobroEnvuelto) {
        this.cobroEnvuelto = cobroEnvuelto;
    }

    @Override
    public double calcular(long minutos, double precioBase) {
        return cobroEnvuelto.calcular(minutos, precioBase);
    }
}
