package com.parking.system.model;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class PrecioPaseContext {
    
    private final Map<String, PrecioPaseStrategy> strategies;
    
    public PrecioPaseContext(List<PrecioPaseStrategy> strategyList) {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(
                    PrecioPaseStrategy::getTipo,
                    Function.identity()
                ));
    }
    
    public BigDecimal calcularPrecio(String tipo) {
        PrecioPaseStrategy strategy = strategies.get(tipo);
        
        if (strategy == null) {
            throw new IllegalArgumentException("Tipo de pase inválido: " + tipo);
        }
        
        return strategy.calcularPrecio();
    }
}